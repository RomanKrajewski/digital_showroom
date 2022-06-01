<template>
<v-card v-if="artwork">
  <v-card-title>{{artwork.name}}</v-card-title>
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

</style>