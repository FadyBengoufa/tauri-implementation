<template>
    <q-dialog>
        <q-card style="width: 500px" class="px-3 py-2">
        <div class="flex items-center  mb-4">
            <div class="w-8 h-8 flex-center rounded-full bg-red-200 text-red-600 flex items-center justify-center">
            <q-icon size="1.3rem" name="svguse:icons/warning.svg#icon"/>
            </div>
            <div class="ml-2 text-gray-700 text-lg font-medium">
                {{ props.title }}
            </div>
        </div>
        <slot></slot>
        <div class="mt-4 flex justify-end">
            <q-btn class="mr-2" label="Annuler" color="grey-13" unelevated v-close-popup/>
            <q-btn :label="props.buttonName" color="red-8" unelevated @click="emit('onValidate')" :loading="props.loading"/>
        </div>
        </q-card>
    </q-dialog>
</template>

<script setup>
const emit = defineEmits('onValidate')
const props = defineProps(['loading', 'title', 'buttonName'])

</script>

<style scoped>

</style>
