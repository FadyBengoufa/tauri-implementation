import {api} from "boot/axios";

export async function  test() {
  const data = await api.get("test")
  if (data) return data
  else return null
}

export async function getUser() {
  const {status, data, error} = await api.get("auth/me")
  if (status) return data
  else return null
}

export async function logout() {
  const { status, data, error } = await api.post('auth/logout');
  return {status , data, error}
}


export async function login(credential) {
  const { status, data, error } = await api.post('auth/login', credential);
  return {status , data, error}
}

export async function refreshToken(credential) {
  const { status, data, error } = await api.post('auth/refresh-tokens', credential);
  return {status , data, error}
}
