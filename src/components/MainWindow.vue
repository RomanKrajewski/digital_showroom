<template>
  <div >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="ma-0 pa-0">
              <babylon-canvas  :positioning-artwork="positioningArtwork" @artwork-positioned="positioningArtwork = null"></babylon-canvas>
          </v-col>
          <v-col cols="12" sm="6" md="4" xl="2" id="right_pane_root" class="ma-0 pa-0">
            <artwork-list @positioning="initPositioningArtwork" v-if="show_navigation"></artwork-list>
            <login-form v-if="show_login"></login-form>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import BabylonCanvas from "@/components/BabylonCanvas";
import ArtworkList from "@/components/ArtworkList";
import LoginForm from "@/components/LoginForm";

export default {

  name: 'MainWindow',
  components: {LoginForm, ArtworkList, BabylonCanvas},
  props:['show_navigation', 'show_login'],
  data: function (){
    return {
      positioningArtwork: {prop: true },
    }
  },
  methods: {
    initPositioningArtwork: function (artwork){
      this.positioningArtwork = artwork
    }
  }

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#right_pane_root{
  position: fixed;
  right: 0;
  background: white;
}
</style>

