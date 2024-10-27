<template>
    <div class="mx-auto h-full flex-center flex-col gap-6 flex-nowrap">
        <img :class="imageClass??''" :src="image" alt="" />
        <div class="flex flex-col gap-y-2 text-center">
            <p class="text-gray-700 font-medium text-lg">
                {{ props.heading }}
            </p>
            <p class="text-gray-400 text-sm">
                {{ props.sub }}
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['heading', 'sub', 'image','imageClass']);
</script>
