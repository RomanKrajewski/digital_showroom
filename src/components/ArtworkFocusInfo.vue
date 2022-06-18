<template>
<v-card v-if="artwork">
  <v-card-title>{{artwork.name}}</v-card-title>
  <v-card-subtitle>{{artwork.height}} x {{artwork.width}} cm</v-card-subtitle>
  <v-btn class="ma-1" small color="primary" :href="contactLink">Kontakt</v-btn>
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

</style>