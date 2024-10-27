<template>
    <q-dialog 
      @hide="importResponse = null"
    >
  
      <!-- FIXME: There is overflow-x. `.overflow-hidden` is a hack -->
      <!-- FIXME: Properly set a width for q-dialog -->
      <q-card class="overflow-hidden w-full" style="width: 700px; max-width: 80vw;">
  
        <header class="text-xl font-semibold flex q-pa-sm text-white justify-between items-center bg-primary"
          >
          <div>
            <q-icon class="pp-rounded-icon q-pa-xs q-mx-md bg-slate-400" size="sm"
              name="file_upload"></q-icon>
            <span>Téléverser votre fichier</span>
          </div>
          <q-btn size="md" round icon="close" flat v-close-popup></q-btn>
        </header>
  
        <section v-if="importResponse !== null" class="pp-import-report q-ma-md">
  
          <!-- With success box -->
          <div v-if="importResponse.toFixCount === 0" class="bg-white text-black q-pa-md rounded-borders">
            <div class="text-h6 text-bold">Le fichier est téleversé avec succée.</div>
  
            <!-- Rapport -->
            <div class="bg-grey-2 text-black text-body1 q-pa-md">
  
              <div class="q-pa-sm">
                <div class="text-secondary">Nombre des éléments valides</div>
                <div class="text-black text-bold"> {{ importResponse.successfulCount }}</div>
              </div>
  
              <hr>
  
              <div class="q-pa-sm">
                <div class="text-red">Nombre des éléments invalides</div>
                <div class="row items-center justify-between">
                  <div class="text-black text-bold"> {{ importResponse.toFixCount }}</div>
                  <q-btn v-if="importResponse.toFixExcelUrl" label="Telecharger les lignes invalides" flat
                    color="secondary" class="text-bold" style="text-decoration: underline;"
                    :href="importResponse.toFixExcelUrl"></q-btn>
                </div>
              </div>
  
              <hr>
  
  
            </div>
            <!-- Rapport END -->
  
          </div>
  
          <!-- With error box -->
          <div v-else class="bg-red-1 text-red-10 q-pa-md rounded-borders">
            <div class="text-h4 text-bold">Erreur dans le téléversement</div>
            <div class="text-body2 q-pa-sm">
              Vous avez <b>{{ importResponse.toFixCount }} erreurs</b>  dans votre fichier,
              vous devez telecharger la liste des données erronées, fix them, then upload them.
            </div>
  
            <!-- Rapport -->
            <div class="bg-white rounded-md text-black text-body1 q-pa-md">
  
              <div class="q-pa-sm">
                <div class="text-green">Nombre des éléments valides</div>
                <div class="text-black text-bold"> {{ importResponse.successfulCount }}</div>
              </div>
  
              <hr>
  
              <div class="q-pa-sm">
                <div class="text-red">Nombre des éléments invalides</div>
                <div class="row items-center justify-between">
                  <div class="text-black text-bold"> {{ importResponse.toFixCount }}</div>
                  <q-btn v-if="importResponse.toFixExcelUrl" label="Telecharger les lignes invalides" flat
                    color="secondary" class="text-bold" style="text-decoration: underline;"
                    :href="importResponse.toFixExcelUrl"></q-btn>
                </div>
              </div>
  
              <hr>
  
  
            </div>
            <!-- Rapport END -->
  
          </div>
        </section>
        <!-- Uploader -->
        <main class="text-center">
          <q-uploader ref="uploader" flat color="white" :multiple="false" :max-file-size="uploadMaxSizeInBytes"
            text-color="black" accept=".xlsx" :auto-expand="true" @added="onFileAdded" @removed="onFileRemoved"
            class="text-center q-ma-md w-auto" :url="up" field-name="file">
            <template v-slot:header>
              <div class="rounded-lg bg-slate-100 q-pa-md p-3">
              <div>
                <q-icon 
                  color="grey-5" 
                  name="img:/icons/upload.svg" 
                  size="5rem"
                />
                <!-- XXX: `q-uploader-add-trigger` is required for `pickFiles()` to work. -->
                <q-uploader-add-trigger />
              </div>
              <div class="text-lg q-pa-sm">Faites glisser et deposez votre fichier</div>
              <div class="pp-hint text-gray-400 text-subtitle2">
                Taille maximale {{ uploadMaxSizePretty }}
              </div>
            </div>
            </template>
          </q-uploader>
  
          <div class="flex flex-nowrap gap-3 items-center justify-center">
            <q-icon name="info" size="sm" color="grey-13">
              <q-tooltip>Select some Excel file (.XLSX)</q-tooltip>
            </q-icon>
            <q-btn
              :href="excelDownloadUrl"
              label="Télécharger l'exemple"
              color="secondary" 
              flat 
              no-caps 
            >
            </q-btn>
            <q-btn v-if="hasFile" @click="triggerFileUpload" color="secondary" no-caps label="Upload" class=""></q-btn>
            <q-btn v-else @click="uploader?.pickFiles" no-caps color="secondary" class="" label="Selectionner"></q-btn>
          </div>
  
          <!-- FIXME: thickness="10" changes nothing. -->
          <!-- TODO: It should capture focus and all -->
          <q-inner-loading :showing="importing">
            <q-spinner-oval size="5em" :thickness="10" color="primary" />
            <div class="text-body1 text-bold q-pa-md">Chargement...</div>
          </q-inner-loading>
        </main>
  
        <footer class="flex justify-end q-pa-md">
        </footer>
  
      </q-card>
  
    </q-dialog>
  </template>
  
<script setup lang="ts">
import { computed, ref, PropType } from 'vue';
import { Notify, QUploader } from 'quasar';
import { excelDownloadUrl as excelDownload, uploadExcel } from 'src/api/excel-uploader'

const props = defineProps({
resource: {
    type: String,
    required: false,
},

uploadMaxSizeInBytes: {
    type: Number,
    default: 10e+6,
},

uploadMaxSizePretty: {
    type: String,
    default: '10 MB',
},
model: {
  type: String,
  required: true,
}
// has 3 methods: import, download_url, upload_url
// resourceStore: { 
//     type: Object as PropType<PrestoStoreType>,
//     required: true,
// },

});

const up = ref()

// ---

interface ImportImportableExcelResponse {
    /**
     * Number of elements in the uploaded file.
     * Probably only for debugging.
     */
    parsedCount: number,
    /**
     * Successfully upserted/added elements.
     */
    successfulCount: number,
    /**
     * Elements with issues
     */
    toFixCount: number,
    /**
     * base64-encoded data URI.
     */
    toFixExcelUrl: string | undefined,
}

const importing = ref(false);
const importResponse = ref(null);
const failedExcelUrl = ref(null);


async function triggerFileUpload() {
    //uploader.value?.upload();
    importResponse.value = null;
    importing.value = true;

    try {
        const {status, data} = await uploadExcel(uploader.value?.files[0], props.model);
        if (!status) {
            Notify.create({
                message: 'Erreur lors du téléversement',
                color: 'negative',
                position: 'top-right',
            });
        } else {
          importResponse.value = data;
          failedExcelUrl.value  = window.URL.createObjectURL(new Blob([data.toFixExcelUrl.data]));
          
        };

    } finally {                                                    
        importing.value = false;
        uploader.value?.removeQueuedFiles();
    }
}                                                                           

// ---                                                                   

// route to download the example excel file
const excelDownloadUrl = computed(() => {
  return excelDownload(props.model);
});

// route to upload the excel file
const excelUploadUrl = computed(async() => {
  if (!uploader.value?.files[0]) {
    return;
  }
  return await uploadExcel(uploader.value?.files[0]);
});

const uploader = ref<QUploader | null>(null);

const hasFile = computed(() => {
  return uploader.value?.canUpload;
});

function onFileAdded(files: any) {
  console.debug('Files added', files);
}

function onFileRemoved(files: any) {
  console.debug('Files removed', files);
}
</script>

<style>
.pp-rounded-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
</style>