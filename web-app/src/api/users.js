import {api} from "boot/axios";


export async function getUsers(filters, page = 1, limit = 20) {
  filters = Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => value !== "")
  )
  const {status, data, error} = await api.get(`users`, {
    params:  {
      ...filters,
      limit,
      page
    },

  })
  return {status, data, error}
}

export async function getUser(userId) {
  const {status, data, error} = await api.get(`users/${userId}`)
  return {status, data: data, error}
}


export async function createUser(user) {
  const { status, data, error } = await api.post('users', user);
  return {status , data, error}
}

export async function updateUser(userId, user) {
  const { status, data, error } = await api.patch(`users/${userId}`, user);
  return {status , data, error}
}

export async function deleteUser(id) {
  const { status, data, error } = await api.delete(`users/${id}`);
  return {status , data, error}
}

export async function blockUser(id) {
  const { status, data, error } = await api.patch(`users/${id}/block`);
  return {status , data, error}
}

export async function unblockUser(id) {
  const { status, data, error } = await api.patch(`users/${id}/unblock`);
  return {status , data, error}
}

