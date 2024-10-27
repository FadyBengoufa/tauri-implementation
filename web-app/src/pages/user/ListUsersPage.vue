<template>
    <q-page class="p-4">
      <Breadcrumbs
            :routes="[
                {to: {name: 'user-list'}, name: 'admins'},
            ]"
        />
      <div class="text-lg flex mt-4">
        <div class="w-full">
          <q-card flat class="rounded px-2 py-4 mb-4">
            <div class="grid grid-cols-3">

              <div class="pr-2">
                <Input
                  label="Recherche"
                  v-model="filters.keyword"
                  class=""
                />
              </div>
            </div>
          </q-card>
          <div class="flex items-center justify-end py-2">
            <router-link to="/users/create">
              <q-btn color="primary" icon="add" unelevated label="Nouvel administrateur" no-caps />
            </router-link>
          </div>
          <q-table
            flat
            :rows="users"
            :columns="columns"
            row-key="name"
            class="p-tr"
            table-header-class="text-gray-400 text-lg"
            style="height: 34rem"
            @request="onRequest"
            v-model:pagination="pagination"
            :filter="filters"
          >
            <template v-slot:body="props">
              <q-tr
                class="cursor-pointer"
                :props="props"
                @click="selectedUser = props.row.id"
              >
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  <template v-if="col.name === 'actions'">
                    <div class="row gap-2 justify-center">
                      <div class="mr-1 text-gray-600 hover:text-gray-400 cursor-pointer" @click.stop="">
                        <a :href="`/#/users/${props.row.id}/edit`">
                          <q-icon name="edit"/>
                        </a>
                      </div>
                      <div
                        v-if="props.row.id !== userStore.user.id"
                        @click.stop="openDeleteDialog = true; user={...props.row}"
                      >
                        <q-icon 
                          :name="props.row.block ? 'svguse:icons/lock_open_right.svg#open_lock' : 'lock' " 
                          :class="props.row.block ? 'text-green-600 hover:text-green-400' : 'text-red-600 hover:text-red-400'"
                          class="cursor-pointer" 
                        />
                      </div>
                    </div>

                  </template>
                  <template v-else>
                    {{ col.value }}
                  </template>
                </q-td>
              </q-tr>
            </template>

          </q-table>
        </div>
      </div>
      <ValidationDialog
        v-model="openDeleteDialog"
        title="Validation"
        buttonName="Confirmer"
        @hide="user = {}"
        @onValidate="confirmBlockOrUnblockUser"
        :loading="loadingDeleteUser"
      >
        Êtes-vous sûr de vouloir {{ user.block ? "débloquer" : "bloquer" }} <strong class="capitalize">{{ user.username }}</strong> ?
      </ValidationDialog>
  
    </q-page>
  </template>


<script setup>
import {onMounted, ref} from "vue";
import { deleteUser, getUsers, blockUser, unblockUser } from "src/api/users";
import Select from "src/components/basic/Select.vue";
import Input from "src/components/basic/Input.vue";
import DeleteDialog from "src/components/basic/DeleteDialog.vue";
import ValidationDialog from "src/components/basic/ValidationDialog.vue";
import Breadcrumbs from "src/components/basic/Breadcrumbs.vue";
import { useUserStore } from "src/stores/user";

const userStore = useUserStore()

const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 10
})

const filters = ref({

})

const users = ref([])
const user = ref({})
const openDeleteDialog = ref(false)
const loadingDeleteUser = ref(false)
const loadingUsers = ref(false)
const selectedUser = ref(null)

const columns = [
  {name: 'username', align: "left", label: "Nom d'admin", field: "username"},
  {name: 'actions', align: 'center', label: 'Les actions'}
]

onMounted(() => {
  fetchUsers()
})

function onRequest(props) {
  return fetchUsers(props.pagination)
}



function fetchUsers({page, rowsPerPage} = { page: 1, rowsPerPage: 20}) {
  loadingUsers.value = true
  getUsers(filters.value, page, rowsPerPage)
    .then(({data}) => {
      pagination.value.rowsNumber = data.count
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      users.value = data.users
    })
    .finally(() => loadingUsers.value = false)
}

function confirmBlockOrUnblockUser() {
  if (user.value.block) {
    confirmUnblockUser()
  } else {
    confirmBlockUser()
  }
}

function confirmBlockUser() {
  loadingDeleteUser.value = true
  blockUser(user.value.id)
    .then(() => {
      openDeleteDialog.value = false
      fetchUsers()
    })
    .finally(() => {
      loadingDeleteUser.value = false
    })
}

function confirmUnblockUser() {
  loadingDeleteUser.value = true

  unblockUser(user.value.id)
    .then(() => {
      openDeleteDialog.value = false
      fetchUsers()
    }).finally(() => {
      loadingDeleteUser.value = false
    })
}

function confirmDeleteUser(){
  loadingDeleteUser.value = true
  deleteUser(user.value.id)
    .then(() => {
      openDeleteDialog.value = false
      fetchUsers()
    })
    .finally(() => loadingDeleteUser.value = false)

}

</script>
