<template>
  <div class="hello">
    <h4>{{ msg }}</h4>
    <babylon-canvas></babylon-canvas>
  </div>
</template>

<script>
import BabylonCanvas from "@/components/BabylonCanvas";
export default {
  name: 'HelloWorld',
  components: {BabylonCanvas},
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
</style>
