<template>
  <q-dialog auto-close>
    <q-card style="min-width: 500px" class="px-3 py-2">
      <div class="flex justify-between">
        <div class="flex items-center  mb-4">
          <div class="p-1 rounded-full bg-blue-200 text-primary">
            <q-icon size="1.3rem" name="svguse:icons/warning.svg#icon|0 0 14 12" />
          </div>
          <div class="ml-2 text-gray-700 text-lg font-medium">{{ title }}</div>
        </div>
        <q-icon v-close-popup class="hover:cursor-pointer" size="1rem"
          name="svguse:icons/cancel.svg#icon|0 0 9 9" />
      </div>
      <div>
        <p class="text-base">{{ text }}</p>
      </div>
      <div class="mt-4 gap-x-1 flex justify-end w-full">
        <slot name="actions"></slot>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(['text','title']);
</script>
