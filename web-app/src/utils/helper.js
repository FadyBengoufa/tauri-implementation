import {date as quasarDate} from "quasar";

export function formatDate(date) {
  // todo make global
  if (!date) return "";
  return quasarDate.formatDate(new Date(date), 'DD-MM-YYYY')
}

export function truncate(text, length) {
  if (length === 0) return text;
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
}

export function formatToFormData(obj) {
  let formData = new FormData()

  for (let key in obj) {
      if (obj[key] instanceof Blob || obj[key] instanceof File) {
        formData.append(key, obj[key]);
        continue
      }
           // TODO verify array
      // if (Array.isArray(obj[key])) {
      //   obj[key].forEach((element, index) => {
      //     if (typeof element === 'object') {
      //       for (let dataKey in element) {
      //         // if value is empty don't append it, the server will handle it
      //         if (!element[dataKey]) {
      //           continue
      //         }
      //         formData.append(`${key}[${index}][${dataKey}]`, element[dataKey]);
      //       }
      //     } else {
      //       formData.append(`${key}[${index}]`, element);
      //     }
      //   });
      //   continue
      // }

      // Append the data object properties separately
      if (typeof obj[key] === 'object') {
        // verify if the object is empty
        if (obj[key] && Object.keys(obj[key]).length === 0) {
          formData.append(`${key}[empty]`, "");
        }
        for (let dataKey in obj[key]) {
          // if value is empty don't append it, the server will handle it
          if (!obj[key][dataKey]) {
            continue
          }
          // Append the data object properties separately
          formData.append(`${key}[${dataKey}]`, obj[key][dataKey]);
        }
        continue
      }
      formData.append(key, obj[key]);
  }
  return formData
}
