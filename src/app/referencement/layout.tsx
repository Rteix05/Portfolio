// Les pages sont des composants client : la metadata passe donc par ce layout.
export { metadata } from './metadata';

export default function ReferencementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
