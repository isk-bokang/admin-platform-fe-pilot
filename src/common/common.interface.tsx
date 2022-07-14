export interface Router<T> {
  key: string;
  children?: T[];
}

export interface SidebarRoute extends Router<SidebarRoute>{
  label?: string;
  icon?: any;
}

export interface RoutePage extends Router<RoutePage> {
  page?: JSX.Element;
}
