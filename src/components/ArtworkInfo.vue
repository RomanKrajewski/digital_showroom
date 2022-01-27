<template>
<div id="artwork_details_pane">
  <p>{{artwork.name}}</p>
  <p>{{artwork.width}} cm X {{artwork.height}} cm</p>
  <a :href="contactLink">Kontaktanfrage</a>
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
        width: 24
      }
    }
  },
  computed:{
    contactLink: function (){
      return "mailto:name@bla.de?subject=Anfrage zu " + this.title
    }
  },
  mounted () {
    const vm = this
    axios
        .get(`http://localhost:5000/api/artwork/${vm.artwork_id}`)
        .then(response => (this.artwork = response.data.artwork))
  }
}
</script>

<style scoped>




</style>