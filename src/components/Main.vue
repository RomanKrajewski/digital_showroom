<template>
  <div >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="ma-0 pa-0">
              <babylon-canvas  :positioning-artwork="positioningArtwork" @artwork-positioned="positioningArtwork = null"></babylon-canvas>
          </v-col>
          <artwork-list @positioning="initPositioningArtwork" v-if="show_navigation"></artwork-list>
          <login v-if="show_login"></login>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import BabylonCanvas from "@/components/BabylonCanvas";
import ArtworkList from "@/components/ArtworkList";
import Login from "@/components/Login";

export default {

  name: 'Main',
  components: {Login, ArtworkList, BabylonCanvas},
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
</style>

