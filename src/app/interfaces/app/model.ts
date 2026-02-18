export interface Link {
  name: string;
  link: string;
  subLinks?: SubLink[];
}

export interface SubLink {
  name: string;
  link: string;
}

export interface Star {
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: string;
  isExploding?: boolean;
  hoverTimer?: any;
}
