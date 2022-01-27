<template>
   <v-col cols="4" id="root">
      <v-row >
        <v-col v-for="artwork in artworks" :key="artwork.id" cols="12">
          <artwork-info :artwork_id="artwork.id"></artwork-info>
        </v-col>
      </v-row>
   </v-col>
</template>

<script>
import ArtworkInfo from "@/components/ArtworkInfo";
export default {
  name: "ArtworkList",
  components: {ArtworkInfo},
  data: function (){
    return {
      artworks: [{id:1},{id:2},{id:3}]
    }
  }
}
</script>

<style scoped>
#root{
  position: fixed;
  right: 0;
  background: white;
  background-opacity: 0.5;
}
</style>