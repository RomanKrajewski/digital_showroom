<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

      <h4>Digital Showroom</h4>

      <v-spacer></v-spacer>

      <v-btn icon v-on:click="show_navigation = !show_navigation">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn icon v-on:click="show_login = !show_login">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <Main :show_navigation="show_navigation" :show_login="show_login"/>
    </v-main>
  </v-app>
</template>

<script>
import Main from './components/Main';

export default {
  name: 'App',

  components: {
    Main,
  },

  data: () => ({
    show_navigation: false,
    show_login: false
  }),
};
</script>
<style>
  html{
    overflow-y: auto;
  }
</style>