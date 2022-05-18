<template>
<v-card v-if="artwork">
  <v-card-title>{{artwork.name}}</v-card-title>
  <v-card-subtitle>{{artwork.width}} cm X {{artwork.height}} cm</v-card-subtitle>
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