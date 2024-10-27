import { api } from "boot/axios";

export async function com() {
  const { status, data, error } = await api.get(`/`);
  return { status, data: data, error };
}
