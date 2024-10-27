<script setup>
import { getDoctors } from "src/api/doctor";
import { onMounted, ref, watch } from "vue";

const props = defineProps(['label', "error", 'searachable', 'createable', 'isMultiple', 'fetcher', 'getLabel', 'useClientFilter'])
const data = ref([])
const select = ref(null)


const model = defineModel()

const options = ref([])


const createOption = (data) => {
    if (!data) return
    options.value = data.map((item) => {
        return {
            label: props.getLabel(item),
            value: item.id
        }
    })
}

onMounted(() => {
    fetch()
})

watch(() => model.value, () => {
    if (model.value) {
        fetch({id: model.value})
    }
})

function fetch(filter){
    let page = 1
    let limit = 100
    props.fetcher(
        filter,
        page,
        limit
    )
        .then(({data}) => {
            // todo find another solution
            // this to only get the data and remove the count
            const {count, ...rest} = data
            data.value = count !== undefined ? Object.values(rest)[0] : data

            if(props.useClientFilter && filter && filter.keyword){
                data.value = data.filter( (v) => {
                    return v.label.toLowerCase().indexOf(filter.keyword) > - 1
                } )
            }
            createOption(data.value)
        })
        .finally()
}

// filter either by api or by client side
const filterFn = (val, update, abort) => {
    const keywords = val.toLowerCase()
    update(() => {
        fetch({
            id: model.value,
            keyword: keywords
        })
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
            map-data
            emit-value
            map-options
            v-bind="{
                ...$attrs,
                ...searachableProps,
                ...createableProps,
                ...multipleProps
            }"
            :use-input="model ? false : true"
            :error="!!props.error"
            :error-message="props.error"
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
