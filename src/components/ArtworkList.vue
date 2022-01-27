<template>
  <div id="info_wrapper">
    <artwork-info v-for="artwork in artworks" :key="artwork.id" :artwork_id="artwork.id">
    </artwork-info>
  </div>
</template>

<script>
import ArtworkInfo from "@/components/ArtworkInfo";
export default {
  name: "ArtworkList",
  components: {ArtworkInfo},
  data: function (){
    return {
      artworks: [{id:1},{id:2},{id:3}]
    }
  }
}
</script>

<style scoped>
#info_wrapper{
  position: fixed;
  top: 10px;
  right: 10px;
  width: 20%;
  background: antiquewhite;
  opacity: 70%;
  padding: 20px;
}
</style>