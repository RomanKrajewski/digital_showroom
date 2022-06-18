<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

<!--      <h4>Digital Showroom</h4>-->

      <v-spacer></v-spacer>

      <v-btn icon v-on:click="toggleNavigation">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn icon v-on:click="toggleLogin">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <main-window :show_navigation="show_navigation" :show_login="show_login"/>
    </v-main>
  </v-app>
</template>

<script>
import MainWindow from './components/MainWindow';

export default {
  name: 'App',

  components: {
    MainWindow,
  },

  data: () => ({
    show_navigation: false,
    show_login: false
  }),

  methods: {
    toggleLogin: function () {
      this.show_login = !this.show_login
      if (this.show_login) {
        this.show_navigation = false
      }
    },
    toggleNavigation: function(){
      this.show_navigation = !this.show_navigation
      if(this.show_navigation){
        this.show_login = false
      }
    }
  }
};
</script>
<style>
  html{
    overflow-y: auto;
  }
</style>