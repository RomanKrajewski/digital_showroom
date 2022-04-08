<template>
<v-row id="login_root" class="pa-2">
  <v-col cols="12">
    <v-text-field label="Mail" v-model="user.email" required ></v-text-field>
    <v-text-field label="Passwort" v-model="user.password" required ></v-text-field>
    <v-btn color="primary" @click="login"> Login</v-btn>
  </v-col>
</v-row>
</template>

<script>
import axios from "axios";
import {getCookie} from "@/utils";

export default {
  name: "LoginForm",
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
      axios.defaults.withCredentials = true
      await axios.post(`${process.env.VUE_APP_BACKEND_URL}/auth/login`, this.user)
      axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie('csrf_access_token');
    }
  }
}
</script>

<style scoped>
</style>