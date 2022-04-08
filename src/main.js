import { createApp , watch} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import axios from "axios";
import {LOCAL_STORAGE_KEY} from "@/constants";
import {getCookie} from "@/utils";

loadFonts()

//make axios send and set credential cookies
axios.defaults.withCredentials = true
axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie('csrf_access_token');

//set pinia to be persitent after page reload

const pinia = createPinia()
watch(
    pinia.state,
    (state) => {
        // persist the whole state to the local storage whenever it changes
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    },
    { deep: true }
)

const app =createApp(App)
app.use(pinia)
app.use(vuetify)
app.mount('#app')

