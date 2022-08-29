<template>
<v-card id="artworkFocusInfoCard" v-if="artwork">
  <v-card-title class="text-subtitle-1">{{artwork.name}}</v-card-title>
  <v-card-subtitle>{{artwork.height}} x {{artwork.width}} cm</v-card-subtitle>
  <v-card-subtitle >{{artwork.technique}}</v-card-subtitle>
  <v-card-subtitle class="mb-2">{{artwork.year}}</v-card-subtitle>
  <v-btn class="ma-1" variant="text" small color="primary" :href="contactLink">Kontakt</v-btn>
</v-card>
</template>

<script>
export default {
  name: "ArtworkHoverInfo",
  props:['artwork'],
  computed:{
    contactLink: function (){
      return "mailto:post@kevin-luedicke.de?subject=Anfrage zu " + this.artwork.name
    }
  },
}
</script>

<style scoped>
#artworkFocusInfoCard{
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>