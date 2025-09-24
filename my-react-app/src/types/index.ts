export interface Route {
  path: string;
  component: React.FC;
  exact?: boolean;
}

export interface NavbarLink {
  name: string;
  path: string;
}