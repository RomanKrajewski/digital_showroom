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
          <v-checkbox dense v-model="artwork.sold" label="Verkauft"></v-checkbox>
        </v-row>
      <input ref="file" type="file" hidden accept="image/*" @change="uploadFileAWS">

    </v-form>
    <div v-if="!editing">
      <v-card-title>{{ artwork.name }}</v-card-title>
      <v-card-subtitle>{{artwork.width}} cm X {{artwork.height}} cm</v-card-subtitle>
      <v-card-subtitle v-if="artwork.sold">Verkauft</v-card-subtitle>
      <v-card-subtitle v-if="!artwork.sold">Verfügbar</v-card-subtitle>
    </div>
    <v-container class="pa-1">
      <v-img v-if="!editing" contain max-height="200" :src="artwork.image_url?artwork.image_url: 'https://imagesshowroom.s3.eu-central-1.amazonaws.com/placeholder.jpg'" ></v-img>
      <v-container id="upload_container" v-if="editing" :style="`background-image: url(${artwork.image_url?artwork.image_url:'https://imagesshowroom.s3.eu-central-1.amazonaws.com/placeholder.jpg'})`">
        <v-btn v-if="!uploading" color="success" @click="selectFile">
          Upload
        </v-btn>
        <v-progress-circular
            v-if="uploading"
            :indeterminate="true"
            color="primary"
        ></v-progress-circular>
      </v-container>
    </v-container>
    <v-card-actions>
      <v-row class="pa-1">
        <v-btn v-if="!userStore.isLoggedIn" class="ma-1" small color="primary" :href="contactLink">Kontakt</v-btn>
        <div v-if="userStore.isLoggedIn && !deleting">
          <v-btn v-if="!editing" class="ma-1" small color="primary" @click="$emit('positioning' , artwork)">Positionieren</v-btn>
          <v-btn v-if="!editing" class="ma-1" small color="primary" @click="editing = true">Bearbeiten</v-btn>
          <v-btn v-if="editing" class="ma-1" small color="primary" @click="saveArtwork">Speichern</v-btn>
          <v-btn v-if="!deleting && !editing" class="ma-1" small color="primary" @click="deleting = true">Löschen</v-btn>
        </div>
        <div v-if="deleting">
          <p class = "ma-1">Löschen?</p>
          <v-btn class="ma-1" small color="red" @click="deleteArtwork">Ja</v-btn>
          <v-btn class="ma-1" small color="grey" @click="deleting = false">Nein</v-btn>
        </div>
      </v-row>
    </v-card-actions>
  </v-card>
</div>
</template>

<script>
import axios from "axios";
import {useUserStore} from "../userStore";

export default {
  name: "ArtworkInfo",
  props: ['artwork_id'],
  data: function (){
    return {
      artwork: null,
      backend_url: process.env.VUE_APP_BACKEND_URL,
      editing: false,
      form:{
        valid: false,
      },
      uploading: false,
      deleting: false
    }
  },
  setup(){
    const userStore = useUserStore()
    return {userStore}
  },
  computed:{
    contactLink: function (){
      return "mailto:post@kevin-luedicke.de?subject=Anfrage zu " + this.artwork.name
    },
    admin: function (){
      return this.userStore.isLoggedIn
    }
  },
  async mounted () {
      if (!this.artwork_id) {
        this.editing = true
        this.artwork = {
          width: null,
          height: null,
          name: null,
          sold: false,
          image_url: ""
        }
      }else{
        this.artwork = await this.fetchArtworkInfo({id: this.artwork_id})
      }
   },
  methods: {
    fetchArtworkInfo: async function(artwork){
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${artwork.id}`)
      artwork = response.data.artwork
      artwork.height = parseInt(artwork.height)
      artwork.width = parseInt(artwork.width)
      if (!artwork.image_url){
        artwork.image_url = ""
      }
      return artwork
    },
    deleteArtwork: async function(){
      if(this.artwork.id){
        await axios.delete(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.artwork.id}`)
      }
      this.$emit('artwork-deleted', this.artwork)
    },
    saveArtwork: async function(){
      const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.artwork.id !== undefined ? this.artwork.id : ''}`, this.artwork)
      const artwork = response.data.artwork
      artwork.height = parseInt(artwork.height)
      artwork.width = parseInt(artwork.width)
      this.artwork = artwork
      this.editing = false
      this.$emit('artwork-updated', this.artwork)
    },
    selectFile: async function(){
      let fileInputElement = this.$refs.file;
      await fileInputElement.click();
    },

    uploadFile: async function(){
      let fileInputElement = this.$refs.file
      let file = fileInputElement.files[0]
      this.uploading = true
      const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/image/`, file, {headers: {
        'Content-Type': file.type
      }})
      const image_id = response.data.image.id
      this.artwork.image_id = image_id
      this.uploading = false
    },
    uploadFileAWS: async function(){
      let fileInputElement = this.$refs.file
      let file = fileInputElement.files[0]
      this.uploading = true
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/image/s3_request`, {params: {
          file_name: file.name
        }})
      const put_url = response.data.url
      const upload_response = await axios.put(put_url, file, {headers: {'Content-Type': ''}})
      this.artwork.image_url = put_url.split("?")[0]
      console.log(upload_response)
      this.uploading = false
    }

  }
}
</script>

<style scoped>

p{
  display: inline;
}

#upload_container{
  background-size: contain;
  background-position: center;
  height:200px;
  display: flex;
  justify-content: center;
  align-items: center
}


</style>