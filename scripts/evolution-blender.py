# Rend la lignée Salamèche → Reptincel → Dracaufeu en séquence d'images, façon
# évolution des jeux Pokémon : chaque forme devient une silhouette lumineuse sur
# fond sombre, alterne avec la forme suivante en rétrécissant/grandissant, flash,
# puis la forme suivante apparaît. La décomposition en pièces reste disponible
# via ECLATS mais n'est plus utilisée.
#
# Usage : blender -b --factory-startup --python scripts/evolution-blender.py -- <dossier-public> <dossier-sortie> <test|sequence> [images]
# Reptincel et Dracaufeu sont lus dans sources/modeles/ (dossier ignoré par git).
# Variante pour le mode sombre du site : préfixer la commande par EVO_FOND=sombre
# et convertir vers public/sequences/evolution-sombre.
# Puis : ffmpeg -framerate 30 -i <dossier-sortie>/%03d.png -c:v libwebp -quality 80 public/sequences/evolution/%03d.webp
import bpy, sys, math, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
PUBLIC, SORTIE, MODE = argv[0], argv[1], argv[2]
FRAMES = int(argv[3]) if len(argv) > 3 else 360

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def lisse(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def fenetre(t, debut, fin):
    return lisse((t - debut) / (fin - debut))


def selectionner(objets, actif=None):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objets:
        o.select_set(True)
    bpy.context.view_layer.objects.active = actif or objets[0]


# ---------- Chargement d'une forme ----------

def charger(fichier, hauteur, action=None, saturation=1.0, valeur=1.0, lissage=0):
    avant = set(scene.objects)
    # Charmander est servi par le site (public/) ; les deux autres, trop lourds, restent hors dépôt
    chemin = os.path.join(PUBLIC, fichier)
    if not os.path.exists(chemin):
        chemin = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sources', 'modeles', fichier)
    bpy.ops.import_scene.gltf(filepath=chemin)
    nouveaux = [o for o in scene.objects if o not in avant]

    # Pose de repos : on fige le squelette sur la première image de l'animation d'attente
    armatures = [o for o in nouveaux if o.type == 'ARMATURE']
    for arm in armatures:
        if action and action in bpy.data.actions:
            arm.animation_data_create()
            arm.animation_data.action = bpy.data.actions[action]
            if arm.animation_data.action_slot is None and len(bpy.data.actions[action].slots):
                arm.animation_data.action_slot = bpy.data.actions[action].slots[0]
        scene.frame_set(1)

    meshes = [o for o in nouveaux if o.type == 'MESH' and o.data.materials and o.name != 'Icosphere']
    for o in meshes:
        selectionner([o])
        for mod in list(o.modifiers):
            if mod.type == 'ARMATURE':
                bpy.ops.object.modifier_apply(modifier=mod.name)
    selectionner(meshes)
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    for o in nouveaux:
        if o not in meshes:
            bpy.data.objects.remove(o)

    # Une pièce par élément détaché du maillage
    for o in meshes:
        selectionner([o])
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.separate(type='LOOSE')
        bpy.ops.object.mode_set(mode='OBJECT')
    pieces = [o for o in scene.objects if o not in avant and o.type == 'MESH']
    selectionner(pieces)
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

    # Normalisation : hauteur donnée, pieds au sol, centré
    pts = [o.matrix_world @ Vector(c) for o in pieces for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    k = hauteur / (mx.z - mn.z)
    base = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
    for o in pieces:
        o.location = (o.location - base) * k
        o.scale = (k, k, k)
    selectionner(pieces)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    centre = Vector((0, 0, hauteur * 0.5))
    forme = {'pieces': [], 'hauteur': hauteur}
    for i, o in enumerate(sorted(pieces, key=lambda p: p.name)):
        d = o.location - centre
        d.y *= 0.5
        d.z *= 0.6
        if d.length < 1e-3:
            d = Vector((0, 0, 1))
        petite = max(o.dimensions) < hauteur * 0.12
        distance = hauteur * (0.25 + (0.2 if petite else 0.0) + 0.06 * (i % 3))
        rot = Vector(((i * 37 % 7) - 3, (i * 53 % 5) - 2, (i * 29 % 9) - 4)) * 0.09
        offset = d.normalized() * distance + Vector((0, 0, hauteur * 0.17))
        # Aucune pièce ne passe sous le sol
        bas = o.location.z - o.dimensions.z / 2 + offset.z
        if bas < 0.02:
            offset.z += 0.02 - bas
        forme['pieces'].append({
            'objet': o,
            'depart': o.location.copy(),
            'offset': offset,
            'rot': rot,
            'i': i,
        })
    # Modèles très anguleux : subdivision au rendu pour arrondir les silhouettes
    if lissage:
        for o in pieces:
            if len(o.data.vertices) < 40:
                continue
            o.data.shade_smooth()
            sub = o.modifiers.new("Lissage", 'SUBSURF')
            sub.levels = 0
            sub.render_levels = lissage
            sub.uv_smooth = 'PRESERVE_BOUNDARIES'

    # Groupe centré sur la forme : l'évolution la fait rétrécir et grandir d'un bloc
    bpy.ops.object.empty_add(location=(0, 0, hauteur * 0.5))
    groupe = bpy.context.object
    for o in pieces:
        o.parent = groupe
        o.matrix_parent_inverse = groupe.matrix_world.inverted()
    forme['groupe'] = groupe
    if saturation != 1.0 or valeur != 1.0:
        corriger_couleurs(pieces, saturation, valeur)
    forme['lueurs'] = ajouter_lueur(pieces)
    return forme


def corriger_couleurs(pieces, saturation, valeur):
    """Ravive une texture trop pâle sous l'éclairage blanc du studio."""
    vus = set()
    for o in pieces:
        for mat in o.data.materials:
            if mat is None or mat.name in vus or not mat.use_nodes:
                continue
            vus.add(mat.name)
            nt = mat.node_tree
            bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if not bsdf or not bsdf.inputs['Base Color'].is_linked:
                continue
            source = bsdf.inputs['Base Color'].links[0].from_socket
            hsv = nt.nodes.new('ShaderNodeHueSaturation')
            hsv.inputs['Saturation'].default_value = saturation
            hsv.inputs['Value'].default_value = valeur
            nt.links.new(source, hsv.inputs['Color'])
            nt.links.new(hsv.outputs['Color'], bsdf.inputs['Base Color'])


def ajouter_lueur(pieces):
    """Insère dans chaque matériau un mélange vers une émission blanche, piloté par une valeur."""
    valeurs = []
    vus = set()
    for o in pieces:
        for mat in o.data.materials:
            if mat is None or mat.name in vus or not mat.use_nodes:
                continue
            vus.add(mat.name)
            nt = mat.node_tree
            sortie = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'), None)
            if not sortie or not sortie.inputs['Surface'].links:
                continue
            source = sortie.inputs['Surface'].links[0].from_socket
            emission = nt.nodes.new('ShaderNodeEmission')
            emission.inputs['Color'].default_value = (0.82, 0.92, 1.0, 1)
            emission.inputs['Strength'].default_value = 2.5
            melange = nt.nodes.new('ShaderNodeMixShader')
            melange.inputs[0].default_value = 0.0
            nt.links.new(source, melange.inputs[1])
            nt.links.new(emission.outputs[0], melange.inputs[2])
            nt.links.new(melange.outputs[0], sortie.inputs['Surface'])
            # Les matériaux transparents (flamme) restent visibles en silhouette
            valeurs.append(melange.inputs[0])
    return valeurs


formes = [
    charger('charmander.glb', 1.7, lissage=2),
    charger('charmeleon.glb', 2.2, saturation=1.7, valeur=0.85, lissage=1),
    charger('charizard_006_sv.glb', 2.5, action='pm0006_00_00_00000_defaultwait01_loop'),
]

# ---------- Studio ----------
monde = bpy.data.worlds.new("Studio")
scene.world = monde
monde.use_nodes = True
nw = monde.node_tree
ambiance = nw.nodes["Background"]
ambiance.inputs[0].default_value = (1, 1, 1, 1)
ambiance.inputs[1].default_value = 0.35
fond_camera = nw.nodes.new("ShaderNodeBackground")
fond_camera.inputs[1].default_value = 2.0
chemin = nw.nodes.new("ShaderNodeLightPath")
melange_monde = nw.nodes.new("ShaderNodeMixShader")
nw.links.new(chemin.outputs["Is Camera Ray"], melange_monde.inputs[0])
nw.links.new(ambiance.outputs[0], melange_monde.inputs[1])
nw.links.new(fond_camera.outputs[0], melange_monde.inputs[2])
nw.links.new(melange_monde.outputs[0], nw.nodes["World Output"].inputs[0])

bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, -0.005))
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
emission_sol = nt.nodes.new("ShaderNodeEmission")
sortie_sol = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(diffus.outputs[0], vers_rgb.inputs[0])
nt.links.new(vers_rgb.outputs[0], rampe.inputs[0])
nt.links.new(rampe.outputs[0], emission_sol.inputs[0])
nt.links.new(emission_sol.outputs[0], sortie_sol.inputs[0])
sol.data.materials.append(mat)
# Le sol coupait le halo de l'évolution ; ses ombres ne se voyaient pas sur le blanc
sol.hide_render = True


# Variante du fond, pour suivre le thème du site : EVO_FOND=sombre donne un
# studio #050505 (fond du site en mode sombre) au lieu du blanc
FOND_STUDIO = 0.00076 if os.environ.get('EVO_FOND') == 'sombre' else 1.0


def studio(clair, flash=0.0):
    """clair : 1 = studio, 0 = fond noir de l'évolution. flash : blanc pur."""
    c = max(clair * FOND_STUDIO, flash)
    fond_camera.inputs[0].default_value = (c, c, c, 1)
    emission_sol.inputs[1].default_value = 2.0 * clair


bpy.ops.object.light_add(type='AREA', location=(2.5, -3, 5))
cle = bpy.context.object
cle.data.energy = 500
cle.data.size = 4
cle.rotation_euler = (math.radians(35), 0, math.radians(35))
bpy.ops.object.light_add(type='AREA', location=(-4, -2, 2.5))
douce = bpy.context.object
douce.data.energy = 120
douce.data.size = 6
douce.rotation_euler = (math.radians(70), 0, math.radians(-60))

bpy.ops.object.empty_add(location=(0, 0, 1))
pivot = bpy.context.object
bpy.ops.object.camera_add(location=(0, -7, 1.9))
cam = bpy.context.object
cam.parent = pivot
cam.data.lens = 35
contrainte = cam.constraints.new('TRACK_TO')
contrainte.target = pivot
scene.camera = cam

# ---------- Particules de lumière ----------
mat_etincelle = bpy.data.materials.new("Etincelle")
mat_etincelle.use_nodes = True
nt = mat_etincelle.node_tree
nt.nodes.clear()
em = nt.nodes.new("ShaderNodeEmission")
em.inputs[0].default_value = (0.75, 0.9, 1.0, 1)
em.inputs[1].default_value = 12.0
out = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(em.outputs[0], out.inputs[0])

mat_halo = bpy.data.materials.new("Halo")
mat_halo.use_nodes = True
mat_halo.surface_render_method = 'BLENDED'
nt = mat_halo.node_tree
nt.nodes.clear()
coord = nt.nodes.new("ShaderNodeTexCoord")
degrade = nt.nodes.new("ShaderNodeTexGradient")
degrade.gradient_type = 'SPHERICAL'
mapping = nt.nodes.new("ShaderNodeMapping")
mapping.inputs['Location'].default_value = (0, 0, 0)
attenuation = nt.nodes.new("ShaderNodeMath")
attenuation.operation = 'POWER'
attenuation.inputs[1].default_value = 2.2
intensite = nt.nodes.new("ShaderNodeMath")
intensite.operation = 'MULTIPLY'
intensite.inputs[1].default_value = 0.0
em_halo = nt.nodes.new("ShaderNodeEmission")
em_halo.inputs[0].default_value = (0.55, 0.78, 1.0, 1)
em_halo.inputs[1].default_value = 3.0
transparent = nt.nodes.new("ShaderNodeBsdfTransparent")
melange_halo = nt.nodes.new("ShaderNodeMixShader")
sortie_halo = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(coord.outputs['Object'], mapping.inputs['Vector'])
nt.links.new(mapping.outputs['Vector'], degrade.inputs['Vector'])
nt.links.new(degrade.outputs['Fac'], attenuation.inputs[0])
nt.links.new(attenuation.outputs[0], intensite.inputs[0])
nt.links.new(intensite.outputs[0], melange_halo.inputs[0])
nt.links.new(transparent.outputs[0], melange_halo.inputs[1])
nt.links.new(em_halo.outputs[0], melange_halo.inputs[2])
nt.links.new(melange_halo.outputs[0], sortie_halo.inputs[0])

bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 1))
halo = bpy.context.object
halo.data.materials.append(mat_halo)
halo.hide_render = True
vise = halo.constraints.new('TRACK_TO')
vise.track_axis = 'TRACK_Z'
vise.up_axis = 'UP_Y'
vise.target = cam
HALO_INTENSITE = intensite.inputs[1]

ETINCELLES = []
for j in range(48):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1, location=(0, 0, 0))
    e = bpy.context.object
    e.data.materials.append(mat_etincelle)
    e.hide_render = True
    ETINCELLES.append(e)


def etincelles(t):
    """Spirale vers le centre pendant l'évolution, gerbe vers l'extérieur à l'apparition."""
    for e in ETINCELLES:
        e.hide_render = True
    for n, ev in enumerate(EVOLUTIONS):
        centre = Vector((0, 0, formes[n + 1]['hauteur'] * 0.5))
        rayon = formes[n + 1]['hauteur'] * 1.3
        if ev['lueur'] <= t < ev['flash']:
            u = (t - ev['lueur']) / (ev['flash'] - ev['lueur'])
            for j, e in enumerate(ETINCELLES):
                phase = (u * 3.0 + j / len(ETINCELLES)) % 1.0
                angle = j * 2.39996 + phase * 5.0
                r = rayon * (1 - phase)
                hauteur = (((j * 37) % 11) / 10 - 0.5) * rayon * 1.2 * (1 - phase)
                e.location = centre + Vector((math.cos(angle) * r, math.sin(angle) * r * 0.6, hauteur))
                taille = 0.03 * math.sin(math.pi * phase) * min(1.0, u * 4)
                e.scale = (taille, taille, taille)
                e.hide_render = taille < 0.002
        elif ev['flash'] <= t < ev['revele'] + 0.03:
            v = (t - ev['flash']) / (ev['revele'] + 0.03 - ev['flash'])
            for j, e in enumerate(ETINCELLES):
                angle = j * 2.39996
                elevation = (((j * 53) % 13) / 12 - 0.5) * 1.6
                direction = Vector((math.cos(angle), math.sin(angle) * 0.6, elevation)).normalized()
                e.location = centre + direction * rayon * 1.6 * (1 - (1 - v) ** 2)
                taille = 0.045 * (1 - v)
                e.scale = (taille, taille, taille)
                e.hide_render = taille < 0.002


# ---------- Chorégraphie ----------
# Chaque forme : assemblée → éclatée → remontée → évolution. Les évolutions
# reprennent celles des jeux : fond sombre, silhouette lumineuse entière,
# particules en spirale, alternance ancienne/nouvelle forme qui rétrécit et
# grandit de plus en plus vite, flash, puis la nouvelle forme apparaît.
# Décomposition par forme (ouverture, tenue, remontage) ; None = reste assemblée
ECLATS = [None, None, None]
EVOLUTIONS = [
    {'sombre': 0.10, 'lueur': 0.13, 'alterne': 0.17, 'flash': 0.32, 'revele': 0.35, 'clair': 0.40},
    {'sombre': 0.55, 'lueur': 0.58, 'alterne': 0.62, 'flash': 0.77, 'revele': 0.80, 'clair': 0.85},
]


def ecart(n, t):
    if ECLATS[n] is None:
        return 0.0
    debut, ouvert, tenu, ferme = ECLATS[n]
    return fenetre(t, debut, ouvert) * (1 - fenetre(t, tenu, ferme))


def alternance(u):
    """0 → ancienne forme pleine taille, 1 → nouvelle. Oscille de plus en plus vite."""
    cycles = 1.0 * u + 2.5 * u * u
    s = 0.5 - 0.5 * math.cos(2 * math.pi * cycles)
    return s if u < 0.92 else s + (1 - s) * (u - 0.92) / 0.08


def poser(t):
    for n, forme in enumerate(formes):
        visible = False
        lueur = 0.0
        echelle = 1.0

        avant = EVOLUTIONS[n - 1] if n > 0 else None
        apres = EVOLUTIONS[n] if n < len(EVOLUTIONS) else None
        debut_vie = avant['flash'] if avant else 0.0
        fin_vie = apres['flash'] if apres else 2.0
        if debut_vie <= t < fin_vie:
            visible = True
        if apres:
            lueur = fenetre(t, apres['lueur'], apres['alterne'])
        # Encore en silhouette après le flash, puis les couleurs reviennent
        if avant and t >= avant['flash']:
            lueur = max(lueur, 1 - fenetre(t, avant['revele'], avant['clair'] - 0.01))

        # Pendant l'alternance, la forme qui sort rétrécit et celle qui arrive grandit
        for ev, role in ((apres, 'sort'), (avant, 'arrive')):
            if ev and ev['alterne'] <= t < ev['flash']:
                u = (t - ev['alterne']) / (ev['flash'] - ev['alterne'])
                a = alternance(u)
                part = (1 - a) if role == 'sort' else a
                echelle = 0.25 + 0.75 * part
                visible = part >= 0.5
                lueur = 1.0

        forme['groupe'].scale = (echelle, echelle, echelle)
        a = ecart(n, t)
        for pc in forme['pieces']:
            o = pc['objet']
            o.hide_render = not visible
            flottement = 0.03 * math.sin(t * 60 + pc['i']) * a
            o.location = pc['depart'] + pc['offset'] * a + Vector((0, 0, flottement))
            o.rotation_euler = (pc['rot'].x * a, pc['rot'].y * a, pc['rot'].z * a)
        for v in forme['lueurs']:
            v.default_value = lueur

    # Fond : sombre pendant l'évolution, blanc au flash, puis retour au studio
    noir = 0.0
    flash = 0.0
    for ev in EVOLUTIONS:
        entree = fenetre(t, ev['sombre'], ev['lueur'])
        sortie = 1 - fenetre(t, ev['revele'], ev['clair'])
        noir = max(noir, min(entree, sortie))
        flash = max(flash, fenetre(t, ev['flash'] - 0.012, ev['flash']) * (1 - fenetre(t, ev['flash'], ev['flash'] + 0.02)))
    studio(1 - noir, flash)
    # Au sommet du flash, tout vire au blanc
    for f in formes:
        for v in f['lueurs']:
            v.default_value = max(v.default_value, flash)
    etincelles(t)

    # Halo : monte avec la lueur, culmine au flash, s'éteint à l'apparition
    force = 0.0
    taille_halo = 1.0
    for n, ev in enumerate(EVOLUTIONS):
        f = fenetre(t, ev['lueur'], ev['alterne']) * (1 - fenetre(t, ev['revele'], ev['clair']))
        if f > force:
            force = f
            pulsation = 1 + 0.06 * math.sin(t * 60)
            taille_halo = formes[n + 1]['hauteur'] * 1.1 * pulsation * (1 + 0.6 * flash)
            halo.location = (0, 0.6, formes[n + 1]['hauteur'] * 0.5)
    halo.hide_render = force < 0.01
    halo.scale = (taille_halo, taille_halo, 1)
    HALO_INTENSITE.default_value = force * (0.9 + flash)


# Cadrage : (instant, distance, hauteur visée)
CADRAGE = [
    (0.00, 5.2, 0.85),
    (0.10, 5.2, 0.85),
    (0.17, 6.8, 1.05),
    (0.35, 6.8, 1.10),
    (0.42, 6.6, 1.10),
    (0.58, 6.6, 1.10),
    (0.62, 8.6, 1.30),
    (0.80, 8.6, 1.30),
    (1.00, 8.2, 1.25),
]


def camera(t):
    pivot.rotation_euler = (0, 0, math.radians(-30 + 60 * t))
    for (t0, d0, h0), (t1, d1, h1) in zip(CADRAGE, CADRAGE[1:]):
        if t0 <= t <= t1:
            k = lisse((t - t0) / (t1 - t0)) if t1 > t0 else 1
            d, h = d0 + (d1 - d0) * k, h0 + (h1 - h0) * k
            break
    pivot.location = (0, 0, h)
    cam.location = (0, -d, 0.7)


scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.view_settings.view_transform = 'Standard'
scene.view_settings.exposure = 0.0
scene.render.image_settings.file_format = 'PNG'
try:
    scene.eevee.taa_render_samples = 64
except Exception:
    pass

os.makedirs(SORTIE, exist_ok=True)
if MODE == 'test':
    instants = [float(x) for x in (argv[4].split(',') if len(argv) > 4 else '0,0.2,0.29,0.33,0.4,0.5,0.6,0.75,0.88,1'.split(','))]
else:
    instants = [n / (FRAMES - 1) for n in range(FRAMES)]
for n, t in enumerate(instants):
    chemin = os.path.join(SORTIE, f"{n + 1:03d}.png")
    # Reprise d'un rendu interrompu : les images déjà produites sont gardées
    if MODE != 'test' and os.path.exists(chemin):
        continue
    poser(t)
    camera(t)
    bpy.context.view_layer.update()
    if MODE == 'test':
        vis = [o for f in formes for pc in f['pieces'] for o in [pc['objet']] if not o.hide_render]
        if vis:
            pts = [o.matrix_world @ Vector(c) for o in vis for c in o.bound_box]
            print("DIAG", round(t, 3), "visibles", len(vis), "x %.2f..%.2f z %.2f..%.2f" % (min(p.x for p in pts), max(p.x for p in pts), min(p.z for p in pts), max(p.z for p in pts)), "cam", tuple(round(v, 2) for v in cam.matrix_world.translation), "lueur", [round(f['lueurs'][0].default_value, 2) if f['lueurs'] else None for f in formes])
    scene.render.filepath = os.path.join(SORTIE, f"{n + 1:03d}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDU", n + 1, len(instants), round(t, 3), flush=True)
