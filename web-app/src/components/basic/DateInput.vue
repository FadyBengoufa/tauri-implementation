<template>
    <div class="mb-1">
      <q-input
            outlined
            dense
            @change="onChangeDate"
            :model-value="date"
            class="w-full"
            :error="!!props.error || !!errorMessage"
            :error-message="!!errorMessage ? errorMessage : props.error"
        >
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  :model-value="date"
                  @update:model-value="onChangeDate"
                  mask="DD-MM-YYYY"
                >
                <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
                </q-date>
            </q-popup-proxy>
            </q-icon>
        </template>
        </q-input>
    </div>
</template>

<script setup>
import {ref,computed, watch} from "vue";
import {formatDate} from "src/utils/helper";
import {date as quasarDate} from "quasar";


const props = defineProps(['error'])
const dateModel = defineModel()
const errorMessage = ref('')


const date = computed(()=>{
  const datetemp=formatDate(dateModel.value);
  if(datetemp){
    return datetemp;
  }else{
    return dateModel.value;
  }
})



function onChangeDate(v) {
  
  if (v === formatDate(dateModel.value)) return;

  dateModel.value = v;

  if (v==='') {
    errorMessage.value = '';
    dateModel.value = null;
    return;
  }

  //check using regular expressions that the date is in the format DD-MM-YYYY or D-M-YYYY or DD-M-YYYY or D-MM-YYYY
  const datePattern = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-[0-9]{4}$/;
  if (!datePattern.test(v)) {
    errorMessage.value = 'date invalide'
    return;
  }
  // if the date is in the format of D-M-YYYY or DD-M-YYYY or D-MM-YYYY format it to DD-MM-YYYY by adding 0 to the day or month
  if (v.split('-')[0].length === 1) {
    v = '0' + v
  }
  if (v.split('-')[1].length === 1) {
    v = v.split('-')[0] + '-0' + v.split('-')[1] + '-' + v.split('-')[2]
  }


  const extractedDate = quasarDate.extractDate(v, 'DD-MM-YYYY')
  if (isValidDate(v)) {
    dateModel.value = extractedDate
    errorMessage.value = '' // Clear error message if date is valid
  } else {
    errorMessage.value = 'date invalide'
  }
}

function isValidDate(dateStr) {
  // Extract day, month, and year from the date string
  const parts = dateStr.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Check if year, month, and day are numbers
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }

  // Check month range
  if (month < 1 || month > 12) {
    return false;
  }

  // Check day range
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  return true;
}



</script>
