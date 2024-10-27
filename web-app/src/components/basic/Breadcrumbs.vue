<template>
    <q-breadcrumbs>
        <q-breadcrumbs-el
            class="font-medium"
            :class="{
                'cursor-pointer hover:text-gray-400 text-gray-600': props.clickable,
                'text-gray-600': props.routes?.length === 0 || !props.clickable
            }"
            :to="props.clickable?{name: 'home'}:null"
            label="Accueil"
        />
        <template v-for="(route, index) in props.routes" :key="index">
            <q-breadcrumbs-el
                class="cursor-pointer text-gray-600 hover:text-gray-400"
                :class="{
                    'cursor-pointer hover:text-gray-600 text-primary font-semibold': index === props.routes.length - 1 && props.clickable,
                }"
                :to="route.to" 
                :label="route.name"
            />
        </template>
    </q-breadcrumbs>
</template>
<script setup>


const props = defineProps({
routes: {type: Object},
clickable: {
    type: Boolean,
    default: true
}
})

</script>
<style scoped>

</style>