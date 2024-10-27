<script setup>

const props = defineProps(['label', "error"])

</script>

<template>

    <div class="p-field">
        <div class="text-gray-600 font-medium text-md mb-1 pl-1">
            {{props.label}}
        </div>
        <q-input 
            dense
            outlined
            class="w-full"
            debounce="800"
            v-bind="$attrs"
            :error="!!props.error"
            :error-message="props.error" 
        >
            <slot>
                
            </slot>
        </q-input>
    </div>

</template>

<style>
.p-field .q-field__inner{
    background-color: white !important;
}

</style>