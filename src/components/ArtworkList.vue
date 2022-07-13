<template>
   <v-row ref="root" id="artworkList" class="pa-2">
     <v-overlay v-model="addingArtwork" contained class="justify-center align-center" content-class="width-90">
        <artwork-info class="flex-grow-1" @artwork-updated="artworkUpdated" @editing-aborted="addingArtwork = false"></artwork-info>
     </v-overlay>
        <v-col v-for="artwork in artworks" :key="artwork.id" cols="12">
          <artwork-info @artwork-updated="artworkUpdated" @positioning="(positioning_artwork) => $emit('positioning', positioning_artwork)" @artwork-deleted="removeArtworkFromList(artwork)" :artwork_id="artwork.id"></artwork-info>
        </v-col>
     <v-btn id="addArtworkButton" fab dark v-if="userStore.isLoggedIn" @click="addArtwork" color="success">
       <v-icon>mdi-plus</v-icon>
     </v-btn>
   </v-row>
</template>

<script>
import ArtworkInfo from "./ArtworkInfo";
import axios from "axios";
import {useUserStore} from "@/userStore";
export default {
  name: "ArtworkList",
  components: {ArtworkInfo},
  data: function (){
    return {
      artworks: [],
      addingArtwork: false
    }
  },
  async mounted () {
    this.artworks = await this.getArtworkArray()
  },
  setup(){
    const userStore = useUserStore()
    return {userStore}
  },
  methods:{
    getArtworkArray: async function (){
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/`)
      let artworks = JSON.parse(response.data.artwork)
      return artworks.map((artwork_id) => {return {id:artwork_id}})

    },
    addArtwork: async function(){
      this.addingArtwork = true
      },
    artworkUpdated: async function(updating_artwork){
      console.log(updating_artwork.id)
      console.log(this.artworks.map((artwork) => artwork.id))

      if (this.artworks.map((artwork) => artwork.id).indexOf(updating_artwork.id) === -1){
        this.addingArtwork = false
        this.artworks.unshift(updating_artwork)
        await this.$nextTick()
        this.$refs.root.scrollTop = 0
      }
      this.$emit('artwork-updated', updating_artwork)
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
  top:96px;
}

#artworkList{
  margin-top: 64px;
  height: calc(100vh - 64px);
  overflow: scroll;
  overflow-x: hidden;
  margin-left: 0;
  margin-right: 0;
}
#artworkList:after {
  content  : "";
  position : absolute;
  z-index  : 1;
  top   : 64px;
  left     : 0;
  pointer-events   : none;
  background-image : linear-gradient(to top,
  rgba(255,255,255, 0),
  rgba(255,255,255, 1) 90%);
  width    : 100%;
  height   : 2em;
}
</style>