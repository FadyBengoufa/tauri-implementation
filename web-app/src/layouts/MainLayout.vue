<template>
  <q-layout view="hHh lpR fFf">
    <Header/>
    <q-page-container>
      <div class="bg-gray-100" style="height: calc(100vh - 50px); overflow: scroll">
        <router-view />
      </div>
    </q-page-container>

  </q-layout>

</template>

<script setup>
import Header from "components/layout/Header.vue";

</script>
