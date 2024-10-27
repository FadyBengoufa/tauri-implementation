<script setup>
import {onMounted, ref} from "vue";
import { getUser } from "src/api/users";
import { useRouter } from "vue-router";
import Input from "components/basic/Input.vue"
import { useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useUserStore } from "src/stores/user";
import {test} from "src/api/auth";

const route = useRoute()
const router = useRouter()

const { id } = route.params
const userData = ref({})
const saving = ref(false)
const validation = ref({})

onMounted(() => {
  console.log('IndexPage mounted')
  test().then(res => console.log(res))
})

if (id) {
    getUser(id)
    .then(({data}) => {
        userData.value = {
            username : data.username
        }
    })
}

const { login } = useAuthStore()
const userStore = useUserStore()

async function save() {
    saving.value = true


    await login(userData.value).then((res) => {
        if (!res.status) {
            validation.value = res.error
        } else {
            validation.value = {}
            userStore.setUser().then(() => {
                router.push({name: "patient-list"})
            })
        };
    }).finally(() => {
        saving.value = false
    })
}


</script>

<template>
    <div class="p2 md:p-4 flex justify-center items-center flex-col h-screen">
        <div
            class="flex flex-col items-center justify-center gap-4"
        >
            <q-avatar size="70px">
                <img alt="Sobco logo" src="~assets/logo.png" sizes="">
            </q-avatar>
        </div>
        <div class="mt-2 md:mt-4">
            <q-card
                class="rounded-lg p-3"
                flat
                style="min-height: 20vh; min-width: 30vw;"
            >
                <div class="mt-2 flex flex-col">
                    <Input
                        label="Nom d'utilisateur"
                        v-model.trim="userData.username"
                        :error="validation['username']"
                    />

                    <Input
                        label="Mot de passe"
                        v-model="userData.password"
                        type="password"
                        :error="validation['password']"
                    />

                </div>
                <div class="flex justify-end ">
                    <q-btn
                        label="Se connecter"
                        no-caps
                        unelevated
                        color="primary"
                        :loading="saving"
                        @click="save"
                    />
                </div>

            </q-card>

        </div>
    </div>
</template>
