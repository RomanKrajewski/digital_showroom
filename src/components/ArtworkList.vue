<template>
   <v-row ref="root" id="artworkList" class="pa-2">
        <v-col v-for="artwork in artworks" :key="artwork.id" cols="12">
          <artwork-info @artwork-updated="(updating_artwork) => $emit('artwork-updated', updating_artwork)" @positioning="(positioning_artwork) => $emit('positioning', positioning_artwork)" @artwork-deleted="removeArtworkFromList(artwork)" :artwork_id="artwork.id"></artwork-info>
        </v-col>
     <v-btn id="addArtworkButton" fab dark v-if="admin" @click="addArtwork" color="success">
       <v-icon>mdi-plus</v-icon>
     </v-btn>
   </v-row>
</template>

<script>
import ArtworkInfo from "./ArtworkInfo";
import axios from "axios";
export default {
  name: "ArtworkList",
  components: {ArtworkInfo},
  data: function (){
    return {
      artworks: [],
      admin: true
    }
  },
  async mounted () {
    this.artworks = await this.getArtworkArray()
  },
  methods:{
    getArtworkArray: async function (){
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/`)
      let artworks = JSON.parse(response.data.artwork)
      return artworks.map((artwork_id) => {return {id:artwork_id}})
    },
    addArtwork: async function(){
      this.artworks.unshift({})
      await this.$nextTick()
      this.$refs.root.scrollTop = 0
    },
    removeArtworkFromList: function(artwork){

      this.artworks = this.artworks.filter((el) => el.id !== artwork.id)
    }
  }
}
</script>

<style scoped>

#addArtworkButton{
  position: fixed;
  right:20px;
  top:84px;
}

#artworkList{
  height: calc(100vh - 64px);
  overflow: scroll;
  overflow-x: hidden;
}
</style>