<template>
  <v-app>


    <v-main>
      <v-container id="button_container">
          <v-row cols="12">

            <v-btn icon variant="flat" color="transparent" v-on:click="toggleLogin">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
            <v-btn icon variant="flat" color="transparent" v-on:click="toggleNavigation">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </v-row>

      </v-container>
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
  #button_container{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
  }
  /*used by overlay content in artwork list*/
  .width-90{
    width:90%;
  }
</style>