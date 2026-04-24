export interface SubMenu {
  id: number;
  name: string;
}

export interface Menu {
  id: number;
  name: string;
  subMenus: SubMenu[];
}

export interface ApiUser {
  initials: string;
  name?: string;
}

export interface Item {
  id: number;
  menuId?: number;
  name: string;
  subject: string;
  owner: string; // initials
  users: string[]; // initials
  date?: string;
  preview?: string;
}
