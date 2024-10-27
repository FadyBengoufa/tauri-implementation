<script setup>
import {computed, ref} from "vue";
import { truncate } from "src/utils/helper";

const props = defineProps(['text'])

const showMore = ref(false)
const showMoreLength = computed(() => showMore.value ? 0 : 20)

</script>

<template>
    <div class="text-gray-800 !whitespace-pre">
        {{ 
            truncate(props.text, showMoreLength) 
        }}
        <p
            v-if="props.text && props.text.length > showMoreLength"
            class="text-blue-500 underline cursor-pointer"
            @click="() => showMore = !showMore"
        >
            {{  
                showMore ? 'Voire moins' : 'Voire plus...'
            }}
        </p>
    </div>
</template>