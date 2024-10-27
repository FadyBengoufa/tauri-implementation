<template>
  <q-select
    ref="select"
    :use-input="!modelValue"
    clearable
    :model-value="modelValue"
    @update:model-value="v=>emit('update:model-value', v)"
    input-debounce="600"
    :options="newOptions"
    @filter="filterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>

import {ref, defineEmits, watch,onMounted} from "vue";

const props = defineProps(['filter', 'modelValue'])
const emit = defineEmits('update:model-value')
const newOptions = ref([])
const select = ref(null)
onMounted(async () => {
  newOptions.value = await props.filter(null, props.modelValue?.value);
});
watch(
  () => props.modelValue,
  async () => {
    // 2 cases of emit-value prop
    let value = props.modelValue?.value || props.modelValue
      if (newOptions.value.findIndex(opt => opt.value == value) === -1)
        newOptions.value = await props.filter(null, value);
  })

function filterFn(val, update) {
    if (props.modelValue) {
      update(async () => {
        newOptions.value = await props.filter(val, null)
      })
      return
  };
  update(async () => {
    let value = props.modelValue?.value || props.modelValue
    newOptions.value = await props.filter(val, value)
  })
}
</script>
