import type { Item, Menu } from "@/types/api";

const BASE = "http://my-json-server.typicode.com/EnkiGroup/DesafioFrontEnd2026Jr";

export async function fetchMenus(): Promise<Menu[]> {
  const res = await fetch(`${BASE}/menus`);
  if (!res.ok) throw new Error("Failed to fetch menus");
  return (await res.json()) as Menu[];
}

export async function fetchItemsForSubMenu(subMenuId: number): Promise<Item[]> {
  const res = await fetch(`${BASE}/items/${subMenuId}`);
  if (!res.ok) {
    // my-json-server returns 404 for unknown ids — treat as empty
    if (res.status === 404) return [];
    throw new Error("Failed to fetch items");
  }
  const data = (await res.json()) as unknown;
  // Endpoint can return either an array or a single object
  if (Array.isArray(data)) return data as Item[];
  if (data && typeof data === "object") return [data as Item];
  return [];
}
