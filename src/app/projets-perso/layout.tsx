// Les pages sont des composants client : la metadata passe donc par ce layout.
export { metadata } from './metadata';

export default function ProjetsPersoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
