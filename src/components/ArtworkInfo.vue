<template>
<div id="artwork_details_pane">
  <v-card>
    <v-card-title>{{ artwork.name }}</v-card-title>
    <v-card-subtitle>{{artwork.width}} cm X {{artwork.height}} cm</v-card-subtitle>
    <v-container>
    <v-img v-if="artwork.image_id !== null" :src="`http://localhost:5000/api/image/${artwork.image_id}`" ></v-img>
    </v-container>
    <v-card-actions>
      <v-btn small color="primary" :href="contactLink">Kontakt</v-btn>
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
        title: "Kunstwerkstitel",
        height: 56,
        width: 2,
        image_id: null,
        image: null
      }
    }
  },
  computed:{
    contactLink: function (){
      return "mailto:name@bla.de?subject=Anfrage zu " + this.artwork.title
    }
  },
  mounted () {
    axios
        .get(`http://localhost:5000/api/artwork/${this.artwork_id}`)
        .then(response => this.artwork = response.data.artwork)
  }
  ,
  methods: {
    load_image: function(response) {
      this.artwork = response.data.artwork
      axios
          .get(`http://localhost:5000/api/image/9`)
          .then(response => this.artwork.image = response.data)
    }
  }
}
</script>

<style scoped>




</style>