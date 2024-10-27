<script setup>
import {ref} from "vue";
import { createUser, updateUser, getUser } from "src/api/users";
import { useRouter } from "vue-router";
import SectionTitle from "components/basic/SectionTitle.vue"
import Input from "components/basic/Input.vue"
import Select from "components/basic/Select.vue"
import { useRoute } from "vue-router";
import Breadcrumbs from "src/components/basic/Breadcrumbs.vue";

const route = useRoute()
const router = useRouter()

const { id } = route.params
const userData = ref({})
const saving = ref(false)
const validation = ref({})
const passwordConfirmation = ref('')

if (id) {
    getUser(id).then(({data}) => {
        userData.value = {
            id: data.id,
            username : data.username
        }
    })
}

async function save() {
    saving.value = true
    if (userData.value.id) {
        await updateUser(userData.value.id, {
            username: userData.value.username,
            password: userData.value.password,
        })
        .then(({status, error}) => {
            if (!status) validation.value = error
            else {
                validation.value = {}
                router.push('/users')
            }
        })
        .finally(() => saving.value = false)
    } else {
        await createUser(userData.value)
        .then(({status, data, error}) => {
            if (!status) validation.value = error
            else {
                validation.value = {}
                router.push('/users')
            }
        })
        .finally(() => saving.value = false)
    }
}


</script>

<template>
    <div class="p2 md:p-4">
        <Breadcrumbs
            :routes="[
                {to: {name: 'user-list'}, name: 'Admin'},
                {name: id ? 'Modifier' : 'Ajouter'}
            ]"
        />

        <SectionTitle :title="id ? 'Modifier' : 'Ajouter'" />

        <div class="mt-2 md:mt-4 md:pr-6">
            <q-card class="rounded-lg p-3" flat style="min-height: 70vh">
            <div class="mt-2 gap-y-12 grid grid-cols-3">
                <Input
                    label="Nom"
                    v-model.trim="userData.username"
                    class="pr-3"
                    :error="validation['username']"
                />

                <Input
                    label="Mot de passe"
                    v-model="userData.password"
                    type="password"
                    class="pr-3"
                    :error="validation['password']"
                />

                <Input
                    label="Confirmer le mot de passe"
                    v-model="passwordConfirmation"
                    type="password"
                    class="pr-3"
                    :error="validation['password_confirmation']"
                    :rules="[
                        (v) => v === userData.password || 'Les mots de passe ne correspondent pas',
                        (v) => !!v || 'Ce champ est obligatoire'
                    ]"
                />

            </div>

            </q-card>
            <div class="mt-4 flex justify-end sticky mt-2">
                <q-btn
                :label="id ? 'Modifier' : 'Sauvegarder'"
                no-caps
                unelevated
                color="primary"
                :loading="saving"
                :disable="!id && passwordConfirmation !== userData.password && userData.password !== ''"
                @click="save"
            />
            </div>
        </div>
    </div>
</template>
