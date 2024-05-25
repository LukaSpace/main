export interface Link {
    name: string,
    link: string,
    subLinks?: SubLink[]
  }
  
export interface SubLink {
name: string,
link: string
}