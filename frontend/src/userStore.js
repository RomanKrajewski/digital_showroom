import { defineStore } from 'pinia'
import {LOCAL_STORAGE_KEY} from "./constants";

const STORE_ID = 'user'

export const useUserStore = defineStore(STORE_ID, {
    state: () => {
        if(localStorage.getItem(LOCAL_STORAGE_KEY)){
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))[STORE_ID]
        }
        return { user: '' }
    },
    getters:{
        isLoggedIn(state){
            return !! state.user
        }
    },
    actions: {
        login(user) {
            this.user = user
        },
        logout(){
            this.user = ''
        }
    },
})
