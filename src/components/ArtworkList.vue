<template>
   <v-col cols="12" sm="6" md="4" xl="2" id="root" ref="root">
      <v-row >
        <v-col v-for="artwork in artworks" :key="artwork.id" cols="12">
          <artwork-info @positioning="(positioning_artwork) => $emit('positioning', positioning_artwork)" :artwork_id="artwork.id"></artwork-info>
        </v-col>
      </v-row>
     <v-btn id="addArtworkButton" fab dark v-if="admin" @click="addArtwork" color="success">
       <v-icon>mdi-plus</v-icon>
     </v-btn>
   </v-col>
</template>

<script>
import ArtworkInfo from "@/components/ArtworkInfo";
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
    }
  }
}
</script>

<style scoped>
#root{
  position: fixed;
  right: 0;
  background: white;
  height: calc(100vh - 64px);
  overflow: scroll;
  overflow-x: hidden;
}
#addArtworkButton{
  position: fixed;
  right:20px;
  top:84px;
}
</style>