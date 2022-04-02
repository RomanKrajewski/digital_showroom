<template>
<div id="artwork_details_pane" v-if="artwork">

  <v-card class = "pa-1" >
    <v-form class="pa-3" v-if="editing" v-model="form.valid">
          <v-text-field label="Titel" v-model="artwork.name" required ></v-text-field>
        <v-row>
          <v-col cols = "3">
            <v-text-field label="Breite" dense v-model.number="artwork.width" required suffix="cm"></v-text-field>
          </v-col>
          <v-col cols = "3">
            <v-text-field label="Höhe" cols="3" dense v-model.number="artwork.height" required suffix="cm"></v-text-field>
          </v-col>
        </v-row>
      <input ref="file" type="file" hidden accept="image/*" @change="uploadFile">

    </v-form>
    <div v-if="!editing">
    <v-card-title>{{ artwork.name }}</v-card-title>
    <v-card-subtitle>{{artwork.width}} cm X {{artwork.height}} cm</v-card-subtitle>
    </div>
    <v-container class="pa-1">
    <v-img contain max-height="200" v-if="artwork.image_id !== null" :src="`${backend_url}/api/image/${artwork.image_id}`" >
      <v-overlay :absolute="true" :value="editing">
      <v-btn v-if="!uploading" color="success" @click="selectFile">
        Upload
      </v-btn>
      <v-progress-circular
          v-if="uploading"
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-overlay></v-img>
    </v-container>
    <v-card-actions>
      <v-row class="pa-1">
        <v-btn v-if="!admin" class="ma-1" small color="primary" :href="contactLink">Kontakt</v-btn>
        <v-btn v-if="admin && !editing" class="ma-1" small color="primary" @click="$emit('positioning' , artwork)">Positionieren</v-btn>
        <v-btn v-if="admin && !editing" class="ma-1" small color="primary" @click="editing = true">Bearbeiten</v-btn>
        <v-btn v-if="admin && editing" class="ma-1" small color="primary" @click="saveArtwork">Speichern</v-btn>
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
      artwork: null,
      backend_url: process.env.VUE_APP_BACKEND_URL,
      editing: false,
      admin: true,
      form:{
        valid: false,
      },
      uploading: false
    }
  },
  computed:{
    contactLink: function (){
      return "mailto:name@bla.de?subject=Anfrage zu " + this.artwork.title
    }
  },
  async mounted () {
      this.artwork = await this.fetchArtworkInfo({id: this.artwork_id})
   },
  methods: {
    fetchArtworkInfo: async function(artwork){
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${artwork.id}`)
      artwork = response.data.artwork
      artwork.height = parseInt(artwork.height)
      artwork.width = parseInt(artwork.width)
      return artwork
    },
    saveArtwork: async function(){
      await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.artwork.id}`, this.artwork)
      await this.fetchArtworkInfo(this.artwork)
      this.editing = false
    },
    selectFile: async function(){
      let fileInputElement = this.$refs.file;
      await fileInputElement.click();
    },

    uploadFile: async function(){
      let fileInputElement = this.$refs.file
      let file = fileInputElement.files[0]
      console.log(file.name + file.type)
      this.uploading = true
      const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/image/`, file, {headers: {
        'Content-Type': file.type
      }})
      const image_id = response.data.image.id
      this.artwork.image_id = image_id
      this.uploading = false
    }

  }
}
</script>

<style scoped>




</style>