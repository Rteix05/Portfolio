# Rend une vue éclatée d'un .glb en séquence d'images sur fond blanc.
# Usage : blender -b --factory-startup --python scripts/eclate-blender.py -- modele.glb dossier-sortie sequence
# Puis : ffmpeg -framerate 30 -i dossier-sortie/%03d.png -vf "scale=1280:-2" -c:v libwebp -quality 72 public/sequences/<nom>/%03d.webp

import bpy, sys, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
GLB, SORTIE, MODE = argv[0], argv[1], argv[2]  # MODE: test | sequence

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=GLB)

# Applique les transformations héritées de Sketchfab puis découpe en pièces détachées
for o in list(scene.objects):
    o.select_set(o.type == 'MESH')
bpy.context.view_layer.objects.active = next(o for o in scene.objects if o.type == 'MESH')
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in list(scene.objects):
    if o.type != 'MESH':
        bpy.data.objects.remove(o)
meshes = [o for o in scene.objects if o.type == 'MESH']
for o in meshes:
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')

pieces = [o for o in scene.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

# Normalise : hauteur 2, pieds au sol, centré
pts = [o.matrix_world @ Vector(c) for o in pieces for c in o.bound_box]
mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
taille = max(mx - mn)
k = 2.0 / taille
centre = (mn + mx) / 2
for o in pieces:
    o.location = (o.location - Vector((centre.x, centre.y, mn.z))) * k
    o.scale = (k, k, k)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
centre = Vector((0, 0, 1.0))


# ---------- Éclaté ----------
FRAMES = 240

def lisse(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)

depart = {o.name: o.location.copy() for o in pieces}
cibles = {}
for i, o in enumerate(pieces):
    d = o.location - centre
    d.y *= 0.5  # l'éclaté s'ouvre surtout vers les côtés, face caméra
    d.z *= 0.6
    if d.length < 1e-3:
        d = Vector((0, 0, 1))
    petite = max(o.dimensions) < 0.25
    distance = 0.5 + (0.4 if petite else 0.0) + 0.12 * (i % 3)
    cibles[o.name] = (d.normalized() * distance, Vector(((i * 37 % 7) - 3, (i * 53 % 5) - 2, (i * 29 % 9) - 4)) * 0.09)

def poser(t):
    # 0 → 0.12 assemblé, 0.12 → 0.45 ouverture, 0.45 → 0.62 tenu, 0.62 → 0.9 remontage
    for i, o in enumerate(pieces):
        decalage = (i % 6) * 0.012
        ouvre = lisse((t - 0.12 - decalage) / 0.30)
        ferme = lisse((t - 0.62 - decalage) / 0.26)
        a = ouvre * (1 - ferme)
        offset, rot = cibles[o.name]
        flottement = 0.04 * math.sin(t * 9 + i) * a
        o.location = depart[o.name] + offset * a + Vector((0, 0, flottement + 0.35 * a))
        o.rotation_euler = (rot.x * a, rot.y * a, rot.z * a)

# ---------- Studio blanc ----------
monde = bpy.data.worlds.new("Studio")
scene.world = monde
monde.use_nodes = True
nw = monde.node_tree
# Éclairage d'ambiance doux, mais fond vu par la caméra blanc pur
ambiance = nw.nodes["Background"]
ambiance.inputs[0].default_value = (1, 1, 1, 1)
ambiance.inputs[1].default_value = 0.7
blanc = nw.nodes.new("ShaderNodeBackground")
blanc.inputs[0].default_value = (1, 1, 1, 1)
blanc.inputs[1].default_value = 2.0
chemin = nw.nodes.new("ShaderNodeLightPath")
melange = nw.nodes.new("ShaderNodeMixShader")
nw.links.new(chemin.outputs["Is Camera Ray"], melange.inputs[0])
nw.links.new(ambiance.outputs[0], melange.inputs[1])
nw.links.new(blanc.outputs[0], melange.inputs[2])
nw.links.new(melange.outputs[0], nw.nodes["World Output"].inputs[0])

# Sol « attrape-ombres » : blanc pur partout sauf dans les ombres
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -0.005))
sol = bpy.context.object
mat = bpy.data.materials.new("Sol")
mat.use_nodes = True
nt = mat.node_tree
nt.nodes.clear()
diffus = nt.nodes.new("ShaderNodeBsdfDiffuse")
vers_rgb = nt.nodes.new("ShaderNodeShaderToRGB")
rampe = nt.nodes.new("ShaderNodeValToRGB")
rampe.color_ramp.elements[0].position = 0.05
rampe.color_ramp.elements[0].color = (0.78, 0.78, 0.78, 1)
rampe.color_ramp.elements[1].position = 0.45
emission = nt.nodes.new("ShaderNodeEmission")
emission.inputs[1].default_value = 2.0
sortie_mat = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(diffus.outputs[0], vers_rgb.inputs[0])
nt.links.new(vers_rgb.outputs[0], rampe.inputs[0])
nt.links.new(rampe.outputs[0], emission.inputs[0])
nt.links.new(emission.outputs[0], sortie_mat.inputs[0])
sol.data.materials.append(mat)

bpy.ops.object.light_add(type='AREA', location=(2.5, -3, 5))
cle = bpy.context.object
cle.data.energy = 900
cle.data.size = 4
cle.rotation_euler = (math.radians(35), 0, math.radians(35))
bpy.ops.object.light_add(type='AREA', location=(-4, -2, 2.5))
douce = bpy.context.object
douce.data.energy = 250
douce.data.size = 6
douce.rotation_euler = (math.radians(70), 0, math.radians(-60))

bpy.ops.object.empty_add(location=(0, 0, 1.05))
pivot = bpy.context.object
bpy.ops.object.camera_add(location=(0, -7.2, 1.9))
cam = bpy.context.object
cam.parent = pivot
cam.data.lens = 50
contrainte = cam.constraints.new('TRACK_TO')
contrainte.target = pivot
scene.camera = cam

def camera(t):
    # Lent tour de plateau, légère approche pendant l'éclaté
    pivot.rotation_euler = (0, 0, math.radians(-28 + 56 * t))
    a = lisse((t - 0.1) / 0.35) * (1 - lisse((t - 0.62) / 0.3))
    cam.location = (0, -7.2 - 1.2 * a, 1.9 + 0.4 * a)

scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1600
scene.render.resolution_y = 900
scene.render.film_transparent = False
scene.view_settings.view_transform = 'Standard'
scene.view_settings.exposure = 0.35
scene.render.image_settings.file_format = 'PNG'
try:
    scene.eevee.use_shadows = True
    scene.eevee.taa_render_samples = 32
except Exception:
    pass

import os
os.makedirs(SORTIE, exist_ok=True)
instants = [0.0, 0.5] if MODE == 'test' else [n / (FRAMES - 1) for n in range(FRAMES)]
for n, t in enumerate(instants):
    poser(t)
    camera(t)
    bpy.context.view_layer.update()
    scene.render.filepath = os.path.join(SORTIE, f"{n + 1:03d}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDU", n + 1, len(instants), flush=True)
