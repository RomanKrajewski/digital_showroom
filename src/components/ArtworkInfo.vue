<template>
<div id="artwork_details_pane">
  <p>{{title}}</p>
  <p>{{width}} cm X {{height}} cm</p>
  <a :href="contactLink">Kontaktanfrage</a>
</div>
</template>

<script>
export default {
  name: "ArtworkInfo",
  data: function (){
    return {
      title: "Kunstwerkstitel",
      height: 56,
      width: 24
    }
  },
  computed:{
    contactLink: function (){
      return "mailto:name@bla.de?subject=Anfrage zu " + this.title
    }
  }
}
</script>

<style scoped>

#artwork_details_pane{
  position: fixed;
  top: 10px;
  right: 10px;
  width: 20%;
  background: antiquewhite;
  opacity: 70%;
  padding: 20px;
}


</style>