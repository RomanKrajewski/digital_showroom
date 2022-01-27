<template>
  <div class="hello">
    <h4>{{ msg }}</h4>
    <div id="view_wrapper">
      <artwork-list></artwork-list>
      <babylon-canvas></babylon-canvas>
    </div>
  </div>
</template>

<script>
import
  BabylonCanvas from "@/components/BabylonCanvas";
  import ArtworkList from "@/components/ArtworkList";

export default {
  name: 'HelloWorld',
  components: {ArtworkList, BabylonCanvas},
  props: {
    msg: String
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
babylon-canvas{
  width: 100%;
  height: 100%;
}
#view_wrapper{
  contain: content
}
</style>
