<template>
<div id="artwork_details_pane">
  <v-card class = "pa-1">
    <v-card-title>{{ artwork.name }}</v-card-title>
    <v-card-subtitle>{{artwork.width}} cm X {{artwork.height}} cm</v-card-subtitle>
    <v-container class="pa-1">
    <v-img contain max-height="200" v-if="artwork.image_id !== null" :src="`${backend_url}/api/image/${artwork.image_id}`" ></v-img>
    </v-container>
    <v-card-actions>
      <v-row class="pa-1">
        <v-btn class="ma-1" small color="primary" :href="contactLink">Kontakt</v-btn>
        <v-btn class="ma-1" small color="primary" @click="$emit('positioning' , artwork)">Positionieren</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "ArtworkInfo",
  props: ['artwork_id'],
  data: function (){
    return {
      artwork:{
        name: "Kunstwerkstitel",
        height: 56,
        width: 2,
        image_id: null,
        image: null
      },
      backend_url: process.env.VUE_APP_BACKEND_URL
    }
  },
  computed:{
    contactLink: function (){
      return "mailto:name@bla.de?subject=Anfrage zu " + this.artwork.title
    }
  },
  mounted () {
    axios
        .get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.artwork_id}`)
        .then(response => this.artwork = response.data.artwork)
  }
  ,
  methods: {
    load_image: function(response) {
      this.artwork = response.data.artwork
      axios
          .get(`${process.env.VUE_APP_BACKEND_URL}/api/image/9`)
          .then(response => this.artwork.image = response.data)
    }
  }
}
</script>

<style scoped>




</style>