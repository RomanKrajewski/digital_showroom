<template>
  <div >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="ma-0 pa-0">
              <babylon-canvas :updating-artwork="updatingArtwork" :positioning-artwork="positioningArtwork" @artwork-hover-enter="initHoverInfo" @artwork-positioned="positioningArtwork = null"></babylon-canvas>
          </v-col>
          <v-col cols="12" sm="6" md="4" xl="2" id="right_pane_root" class="ma-0 pa-0">
            <artwork-list @artwork-updated="updateArtwork" @positioning="initPositioningArtwork" v-if="show_navigation"></artwork-list>
            <login-form v-if="show_login"></login-form>
          </v-col>
          <artwork-hover-info cols="12" sm="6" md="4" xl="2" v-if="showHoverInfo" :artwork="hoveringArtwork" ></artwork-hover-info>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import BabylonCanvas from "@/components/BabylonCanvas";
import ArtworkList from "@/components/ArtworkList";
import LoginForm from "@/components/LoginForm";
import ArtworkHoverInfo from "@/components/ArtworkHoverInfo";

export default {

  name: 'MainWindow',
  components: {ArtworkHoverInfo, LoginForm, ArtworkList, BabylonCanvas},
  props:['show_navigation', 'show_login'],
  data: function (){
    return {
      positioningArtwork: {prop: true },
      updatingArtwork:{prop:true},
      showHoverInfo: false,
      hoveringArtwork: {name:'sample', width:1, height:1}
    }
  },
  methods: {
    initPositioningArtwork: function (artwork){
      this.positioningArtwork = artwork
    },
    updateArtwork: function(artwork){
      this.updatingArtwork = artwork
    },
    initHoverInfo: function(artwork){
      this.showHoverInfo = true
      this.hoveringArtwork = artwork
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

