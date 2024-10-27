<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { createMedicalRecord, updateMedicalRecord, getMedicalRecords, getMedicalRecord } from "src/api/medical-records";
import { getOptions, createOption } from "src/api/options";
import Input from './Input.vue';
import SectionTitle from './SectionTitle.vue';
import { truncate } from 'src/utils/helper';

const emit = defineEmits(['saved', 'hide'])
const props = defineProps(['multiSelectId', 'api', 'optionType', 'hereditaire', 'title'])
const dialog = ref(false)
const validation = ref({})
const multiSelecteds = ref([])
const multiSelect = ref({
    data: {
    }
})
const loadingSaveMultiSelect = ref(false)

const handleClick = (item) => {
    let property = props.hereditaire  ? props.hereditaire : 'name'

    // the property hereditaire may not exist in multiSelect.data
    // so we need to create property if it does not exist
    if (!multiSelect.value.data[property]) multiSelect.value.data[property] = []

    // item is an object so it won't be found in the array
    // we need to check if the value of the item is in the array
    if (!multiSelect.value.data[property].some(i => i.value === item.value)) {
        multiSelect.value.data[property].push({
            label: item.label,
            value: item.value,
        })
    }
}

onMounted(() => {
    fetch(),
    fetchOptions()
})

const filter = ref('')
const defaultOptions = ref([])
const options = ref([])


function fetchOptions(){
    getOptions(props.optionType)//, props.maladieHereditaire)
    .then(({data}) => {
        options.value = data
        defaultOptions.value = data
    })
    .finally()
}


function fetchOptionsByKeyword(keyword){
    getOptions(props.optionType, keyword)
    .then(({data}) => {
        options.value = data
    })
    .finally()
}

const createOptionSelect = (val) => {
    createOption(props.optionType, val)
    .then(({status, data, error}) => {
        if (!status) validation.value = error
        else {
            options.value.push(data)
        }
    })
}


const filteredOptions = computed(() => {
    // TODO: if option is added to multiSelect, remove it from options
    return options.value
})

function fetch() {
    loadingSaveMultiSelect.value = true
    getMedicalRecords(props.api)
    .then(({data}) => {
        if (data.length) {
            multiSelect.value = {
                id: data[0].id,
                data: data[0].data
            }
        }
    })
    .finally(() => loadingSaveMultiSelect.value = false)
}


async function save() {
    loadingSaveMultiSelect.value = true
    multiSelecteds.value.push(multiSelect.value.data)
    let property = props.hereditaire  ? props.hereditaire : 'name'
    if (multiSelect.value.id) {
        await updateMedicalRecord(multiSelect.value.id, {
            type: props.api,
            data: {
                ...multiSelect.value.data,
                [property]: multiSelect.value.data[property]
            }
        })
            .then(({status, error}) => {
                if (!status) validation.value = error
                else {
                    dialog.value.hide()
                    emit("saved", multiSelect.value)
                }
            })
            .finally(() => loadingSaveMultiSelect.value = false)
    } else {
        await createMedicalRecord({
            type: props.api,
            //data: multiSelecteds.value//multiSelect.value.data
            data: {
                [property]: multiSelect.value.data[property]
            }
        })
            .then(({status, data, error}) => {
                if (!status) validation.value = error
                else {
                    dialog.value.hide()
                    emit("saved", data)
                    fetch()
                }
            })
            .finally(() => loadingSaveMultiSelect.value = false)
    }
}

watch(
    () => filter.value,
    () => {
        if (filter.value === '') {
            options.value = defaultOptions.value
        } else {
            fetchOptionsByKeyword(filter.value)
        }
    }
)

</script>


<template>
    <q-dialog
        ref="dialog"
        @hide="validation= {};
        emit('hide')"
    >
        <q-card
            style="width: 700px; max-width: 60vw; height: fit-content;"
            class="bg-grey-300 pt-2 pb-4 px-4"
        >
            <div class="cardSection">
                <q-card-section class="text-lg mb-0">
                <span class="text-md">
                    Selectionez les maladies
                </span>
                <p class="text-base text-gray-600">
                    les {{ props.hereditaire ? props.hereditaire: props.title }}
                </p>
            </q-card-section>
            </div>

            <q-card-section>
                <Input
                    label="Rechercher"
                    v-model="filter"
                    class="mb-2"

                />
                <div
                    class="grid grid-cols-2"
                >   
                <div>
                    <p class="text-base font-semibold text-gray-600 mb-4">
                        Les maladies
                    </p>
                    <q-virtual-scroll
                        style="max-height: 60vh;"
                        :items="filteredOptions"
                        item-key="id"
                        class="h-screen border"
                    >
                        <template v-slot="{ index, item }">
                            <q-item
                                clickable
                                v-ripple
                                :tabindex="index"
                                @click="handleClick(item)"
                            >
                                <q-item-section>
                                    <q-item-label>
                                        {{ item.label }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-virtual-scroll>
                </div>
                <div>
                    <p class="text-base font-semibold text-gray-600 mb-4">
                        Les maladies selectionnées
                    </p>
                    <q-virtual-scroll
                        style="max-height: 60vh;"
                        :items="multiSelect.data[props.hereditaire  ? props.hereditaire : 'name']"
                        item-key="id"
                        class="h-screen border bg-[#F9F9F9] p-4"
                    >
                    <template props="props" v-slot="{ index, item }">
                            <q-chip
                                class=" bg-white border-2 border-[#107D2E] flex flex-row gap-2"
                            >
                                <div class="flex flex-row items-center gap-2">
                                    <p>
                                        {{ truncate(item.label, 20) }}
                                    </p>
                                    <q-icon
                                        name="close"
                                        class="cursor-pointer  rounded-full bg-gray-100"
                                        @click="multiSelect.data[props.hereditaire  ? props.hereditaire : 'name'].splice(index, 1)"
                                    />
                                </div>
                            </q-chip>
                        </template>
                    </q-virtual-scroll>
                </div>

                </div>
            </q-card-section>
            <div class="mt-4 flex justify-end">
                <q-btn
                    :label="props.multiSelectId?'Mettre à jour':'Sauvegarder'"
                    color="primary"
                    unelevated
                    @click="save"
                    :loading="loadingSaveMultiSelect"
                />
            </div>
        </q-card>
    </q-dialog>
</template>

<style>
.cardSection .q-card__section.q-card__section--vert{
    padding-left: 16px;
    padding-bottom: 0px;

}

</style>