import { defineStore } from 'pinia'
const LOCAL_STORAGE_KEY = 'userStore'

export const userStore = defineStore('user', {
    state: () => {
        if (window.localStorage.getItem(LOCAL_STORAGE_KEY)){
            return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))
        }else{
            return { user: '' }
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
