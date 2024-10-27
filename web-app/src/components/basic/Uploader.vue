<script setup>

const model = defineModel()

</script>

<template>
    <q-uploader
        :id="model && typeof model !== 'object' ? '' : 'hidden_upload' "
        style="max-width: 300px"
        class="bg-white-200 drop-shadow-sm shadow-none"
        :url="model"
    >
        <template v-slot:header="props">
            <q-file
                v-if="!model || typeof model === 'object'"
                outlined
                dense
                v-model="model"
                v-bind="props"
                use-chips
                placeholder="Photo"
                accept=".jpg, .png, .jpeg, image/*"
                class="bg-white drop-shadow-sm"
            >
            <template v-slot:append>
                <q-icon name="attach_file" />
            </template>
            </q-file>
        </template>

        <template 
            v-slot:list="props"
        >
            <q-card-section
            >
                <div class="flex justify-end">
                    <div class="absolute bg-black w-[88%] h-[40px] opacity-20"></div>
                    <q-icon 
                        name="close" 
                        class="cursor-pointer absolute"
                        @click="model = null"
                        size="md"
                        color="white"
                    />
                </div>
                <img
                    :src="model"
                    class="w-full"
                />
            </q-card-section>
            
        </template>

    </q-uploader>
</template>


<style>
    #hidden_upload .q-uploader__list{
        display: none;
    }
</style>