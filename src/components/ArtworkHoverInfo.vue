<template>
<v-card id="artworkHoverInfoCard" v-if="artwork">
  <v-card-title class="text-subtitle-1">{{artwork.name}}</v-card-title>
  <v-card-subtitle>{{artwork.height}} x {{artwork.width}} cm</v-card-subtitle>
</v-card>
</template>

<script>
export default {
  name: "ArtworkHoverInfo",
  props:['artwork']
}
</script>

<style scoped>
  #artworkHoverInfoCard{
    position: fixed;
    top: 20px;
    right: 20px;
  }
</style>