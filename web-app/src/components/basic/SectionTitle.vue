<script setup>

const props = defineProps(['title'])

</script>


<template>
    <div class="text-xl text-gray-600 font-semibold mt-3 mb-2">
        {{ props.title }}
    </div>
</template>