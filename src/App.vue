<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

      <h4>Digital Showroom</h4>

      <v-spacer></v-spacer>

      <v-btn icon v-on:click="toggle_menu">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <Main :show_navigation="show_navigation"/>
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
    show_navigation: false
  }),
  methods:{
    toggle_menu: function(){
      this.show_navigation = !this.show_navigation
    }
  }
};
</script>
<style>
  html{
    overflow-y: auto;
  }
</style>