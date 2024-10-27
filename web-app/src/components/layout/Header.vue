<script setup>
import { useAuthStore } from 'src/stores/auth';
import { useUserStore } from 'src/stores/user';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
function logout() {
  authStore.logout()
  userStore.setUser(true)
  router.push({ name: 'login' })

}

const originalLinks = [
  { title: 'Patients', to: 'patient-list' },
];

const links = computed(() => {
  if (user.value?.userableType === 'doctor') {
    return originalLinks.filter(link => link.to !== 'doctor-list' && link.to !== 'user-list' && link.to !== 'company-list' && link.to !== 'branch-list');
  }
  return originalLinks;
});
</script>

<template>
  <q-header bordered class="bg-primary text-white border-gray-200 px-6 flex items-center" style="height: 50px">
    <div class="flex flex-wrap justify-center items-center w-full">

      <div class="flex items-center justify-center ">
        <img src="~assets/logo.png" class="mr-3 h-6 sm:h-9" alt="Sobco Logo" />
        <span class="font-semibold text-lg">Sobco KPIs</span>
      </div>

    </div>
  </q-header>
</template>

<style scoped>

</style>
