<template>
<div id="artwork_details_pane" v-if="artwork">
  <v-card class="pa-3">
    <v-form v-if="editing" v-model="form.valid" class="pa-6 pb-0">
        <v-row>
          <v-text-field dense label="Titel" v-model="artwork.name" required ></v-text-field>
        </v-row>
        <v-row>
            <v-text-field class="pl-1" label="Höhe" dense v-model.number="artwork.height" required suffix="cm"></v-text-field>
            <v-text-field class="pl-1" label="Breite" dense v-model.number="artwork.width" required suffix="cm"></v-text-field>
            <v-text-field class="pl-1" label="Jahr" dense v-model="artwork.year" ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field class="pl-1" label="Technik" dense v-model="artwork.technique" ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field class="pl-1" label="Link" dense v-model="artwork.hyperlink_url"/>
        </v-row>
      <v-row>
          <v-checkbox dense v-model="artwork.sold" label="Verkauft"></v-checkbox>
        </v-row>
      <input ref="file" type="file" hidden accept="image/jpeg, video/mp4" @change="uploadFileAWS">

    </v-form>
    <div v-if="!editing" class="pa-1">
      <v-card-title>{{ artwork.name }}</v-card-title>
      <v-card-subtitle>{{artwork.height}} x {{artwork.width}} cm</v-card-subtitle>
      <v-card-subtitle v-if="artwork.sold">Verkauft</v-card-subtitle>
      <v-card-subtitle v-if="!artwork.sold">Verfügbar</v-card-subtitle>
      <v-card-subtitle> {{artwork.technique}} </v-card-subtitle>
      <v-card-subtitle> {{artwork.year}} </v-card-subtitle>
      <v-card-subtitle> {{artwork.hyperlink_url}}</v-card-subtitle>
    </div>
    <v-container class="pa-0">
      <video v-if="artwork.image_url.endsWith('.mp4')" controls :src="artwork.image_url" style="width: 100%"></video>
      <v-img v-if="!editing" contain max-height="200" :src="artwork.image_url?artwork.image_url: 'https://imagesshowroom.s3.amazonaws.com/placeholder.jpg'" ></v-img>
      <v-container id="upload_container" v-if="editing" :style="`background-image: url(${artwork.image_url?artwork.image_url:'https://imagesshowroom.s3.amazonaws.com/placeholder.jpg'})`">
        <v-btn v-if="!uploading" color="success" @click="selectFile">
          Upload mp4 oder jpg
        </v-btn>
        <v-progress-circular
            v-if="uploading"
            :indeterminate="true"
            color="primary"
        ></v-progress-circular>
      </v-container>
    </v-container>
    <v-card-actions>
      <v-row v-if="!userStore.isLoggedIn" >
        <v-btn  class="ma-1" small color="primary" :href="contactLink">Kontakt</v-btn>
      </v-row>
        <v-row v-if="userStore.isLoggedIn && !deleting && !editing">
          <v-btn class="ma-1" small color="primary" @click="$emit('positioning' , artwork)">{{ artwork.position_vector?'Umhängen':'Hängen'}}</v-btn>
          <v-btn v-if="artwork.position_vector" class="ma-1" small color="primary" @click="resetPosition">Abhängen</v-btn>
          <v-btn class="ma-1" small color="primary" @click="editing = true">Bearbeiten</v-btn>
          <v-btn class="ma-1" small color="primary" @click="deleting = true">Löschen</v-btn>
        </v-row>
      <v-row v-if="editing">
          <v-btn class="ma-1" small color="primary" @click="saveArtwork">Speichern</v-btn>
          <v-btn class="ma-1" small color="red" @click="abortEditing">Abbrechen</v-btn>
      </v-row>
      <v-row v-if="deleting">
        <p class = "ma-2">Löschen?</p>
        <v-btn class="ma-1" small color="red" @click="deleteArtwork">Ja</v-btn>
        <v-btn class="ma-1" small color="grey" @click="deleting = false">Nein</v-btn>
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
          image_url: "",
          hyperlink_url:"",
        }
      }else{
        this.artwork = await this.fetchArtworkInfo({id: this.artwork_id})
      }
   },
  methods: {
    parseArtwork: function (response) {
      const artwork = response.data.artwork
      artwork.height = parseInt(artwork.height)
      artwork.width = parseInt(artwork.width)
      if (artwork.year){
        artwork.year = parseInt(artwork.year)
      }
      if (!artwork.image_url) {
        artwork.image_url = ""
      }
      if(!artwork.hyperlink_url){
        artwork.hyperlink_url = ""
      }
      return artwork;
    },
    fetchArtworkInfo: async function(artwork){
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${artwork.id}`)
      artwork = this.parseArtwork(response);
      return artwork
    },
    abortEditing: async function(){
      if (this.artwork_id){
        this.artwork = await this.fetchArtworkInfo({id: this.artwork_id})
        this.editing = false
      }else {
        this.$emit('editing-aborted')
      }
    },
    deleteArtwork: async function(){
      if(this.artwork.id){
        await axios.delete(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.artwork.id}`)
      }
      this.$emit('artwork-deleted', this.artwork)
    },
    saveArtwork: async function(){
      const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.artwork.id !== undefined ? this.artwork.id : ''}`, this.artwork)
      this.artwork = this.parseArtwork(response)
      this.editing = false
      this.$emit('artwork-updated', this.artwork)
    },
    resetPosition: async function(){
      this.artwork.position_vector = null
      this.artwork.orientation_quaternion = null
      await this.saveArtwork()
    },
    selectFile: async function(){
      let fileInputElement = this.$refs.file;
      await fileInputElement.click();
    },
    uploadFileAWS: async function(){
      let fileInputElement = this.$refs.file
      let file = fileInputElement.files[0]
      this.uploading = true
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/image/s3_request`, {params: {
          file_name: file.name
        }})
      const put_url = response.data.url
      await axios.put(put_url, file, {headers: {'Content-Type': ''}})
      this.artwork.image_url = put_url.split("?")[0]
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