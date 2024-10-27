import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {Notify} from "quasar";
import { useRouter } from 'vue-router';
const router = useRouter();
import { useAuthStore } from 'src/stores/auth';

const baseURL = process.env.DEV ? process.env.BACKEND_API : "https://api.kpi-service.com"
const isElectron = window.electronAPI !== undefined;

const api = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


// todo production ??
const logger = console.log


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


export default boot(({app,router}) => {

  api.interceptors.request.use(
    config => {
      // get access token from local storage
      // let token = localStorage.getItem('token');
      // if (token) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }
      return config;
    },
    error => Promise.reject(error)
  );


  api.interceptors.response.use(
    function (response) {
      return {status: true, data: response.data}
    },
    function (error) {
      logger(error)

      if (error.response?.status === 401){
        const authStore = useAuthStore();
        authStore.logout()
        window.location = "/login";
      }
      // validation Error
      if (error.response?.status === 422) {
        // todo make it more generic
        let errors = error.response?.data?.validation?.body
        return {status: false, error: errors}
      }
      else if (error.response?.status === 404) {
        Notify.create({
          position: 'top-right',
          color: 'red',
          message: "Ressource non trouvée",
          actions: [
            { label: 'retour', color: 'white', handler: () => { router.back() } },
            { label: 'accueil', color: 'white', handler: () => { router.replace({name:'home'}) } },
          ]
        })

      }
      // error
      else { Notify.create({
        position: 'top-right',
        color: 'red',
        message: "une erreur s'est produite"
      });

        return {status: false, error: error}
      }
    }
  );

  app.config.globalProperties.$api = api
  app.config.globalProperties.$axios = axios
})

export { api, isElectron }
