<template>
<v-card id="login_root" class="pa-2">
  <v-col v-if="userStore.isLoggedIn" >
    <h2>Eingeloggt als {{userStore.user}}</h2>
    <v-btn @click="logout">Logout</v-btn>
  </v-col>
  <v-col v-else>
    <v-text-field label="Mail" v-model="user.email" required ></v-text-field>
    <v-text-field label="Passwort" v-model="user.password" required ></v-text-field>
    <v-btn color="primary" @click="login"> Login</v-btn>
  </v-col>
</v-card>
</template>

<script>
import axios from "axios";
import {getCookie} from "@/utils";
import {useUserStore} from "@/userStore";

export default {
  name: "LoginForm",
  setup(){
    const userStore = useUserStore()
    return {userStore}
  },
  data: function (){
    return {
      user: {
        email: null,
        password: null,
        }
      }
  },
  methods:{
    login: async function (){
      await axios.post(`${process.env.VUE_APP_BACKEND_URL}/auth/login`, this.user)
      axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie('csrf_access_token');
      this.userStore.login(this.user.email)
    },
    logout: async function(){
      await axios.get(`${process.env.VUE_APP_BACKEND_URL}/auth/logout`)
      axios.defaults.headers.common['X-CSRF-TOKEN'] = ''
      this.userStore.logout()
    }
  }
}
</script>

<style scoped>
</style>