<template>
  <div >
      <v-container fluid>
        <v-row>
          <v-col cols="12">
              <babylon-canvas></babylon-canvas>
          </v-col>
          <artwork-list v-if="show_navigation"></artwork-list>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import BabylonCanvas from "@/components/BabylonCanvas";
import ArtworkList from "@/components/ArtworkList";

export default {

  name: 'Main',
  components: {ArtworkList, BabylonCanvas},
  props:['show_navigation']
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#artwork-list-wrapper{
  position: fixed;
  right:10px;
}
</style>

