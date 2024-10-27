<script setup>
// import { getOptions, createOption } from "src/api/options";
import { onMounted, ref } from "vue";

const props = defineProps(['label', "error", 'optionType', 'searachable', 'createable', 'isMultiple'])
const options = ref([])
const select = ref(null)
const model = defineModel()
const validation = ref('')

onMounted(() => {
    // fetchOptions()
})



function fetchOptions(keyword){
    // getOptions(props.optionType, keyword)
    // .then(({data}) => {
    //     options.value = data
    // })
    // .finally()
}

const createOptionSelect = (val) => {
    createOption(props.optionType, val)
    .then(({status, data, error}) => {
        if (!status) validation.value = error
        else {
            validation.value = ''
            options.value.push(data)
            if (props.isMultiple) {
                model.value.push(data.value)
                select.value.blur()
            } else model.value = data.value
            

        }
    })
}

const filterFn = (val, update, abort) => {
    const keywords = val.toLowerCase()
    update(() => {
        fetchOptions(keywords)
    })
}

const searachableProps = !props.searachable ? {} : {
    onFilter: filterFn,
}
const createableProps = !props.createable ? {} : {
    onNewValue: createOptionSelect,
}

const multipleProps = !props.isMultiple ? {} : {
    multiple: true,
    'use-chips': true,
}

</script>

<template>

    <div>
        <div class="text-gray-600 font-medium text-md mb-1">
            {{props.label}}
        </div>
        <!-- lose focus when new option created -->
        <q-select
            ref="select"
            v-model="model"
            dense
            outlined
            map-options
            emit-value
            class="w-full"
            v-bind="{
                ...$attrs, 
                ...searachableProps, 
                ...createableProps,
                ...multipleProps
            }"
            :use-input="model && !props.isMultiple ? false : true"
            :error="!!props.error || !!validation['label']"
            :error-message="props.error || validation['label']"
            :options="options"
        >
            <template v-slot:no-option="props">
                <q-item>
                    <q-item-section
                        v-if="props.createable"
                        class="text-blue-6 cursor-pointer"
                        :onclick="()=> createOptionSelect(props.inputValue)"
                    >                        
                            Créer une nouvelle option: {{ props.inputValue }}
                    </q-item-section>

                    <q-item-section
                        v-else
                        class="text-gray-500"
                    >
                        {{ props.inputValue ? "Aucun résultat pour: " + props.inputValue : "Aucun résultat disponible." }}
                    </q-item-section>

                </q-item>
            </template>
        </q-select>

    </div>

</template>