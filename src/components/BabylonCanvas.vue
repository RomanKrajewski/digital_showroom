<template>
  <div>
    <canvas class="ma-0" ref = 'canvas' ></canvas>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import {TeleportingCamera} from '@/components/scene_elements/teleportingCamera'
import {Ground} from "@/components/scene_elements/ground";
import {Walls} from "@/components/scene_elements/walls";
export default {
  name: "BabylonCanvas",
  props:['positioningArtwork'],
  data: function () {
    return {
      engine: null,
      scene: null,
      walls: null,
    }
  },
  watch:{
    positioningArtwork(newArtwork){
      if (newArtwork){
        this.walls.positionArtwork(newArtwork)
      }
    }
  },
  methods: {
    resize: function (){
      this.engine.resize()
    },
    load_scene: function(engine, canvas) {
      const vm = this
      // This creates a basic Babylon Scene object (non-mesh)
      BABYLON.SceneLoader.Load(`${process.env.VUE_APP_BACKEND_URL}/static/`, 'model.glb', engine,
      function(scene){
        vm.debug_message = 'success'
        try{
          vm.scene = vm.setup_scene(scene, canvas, engine)
        }
        catch (e){
          console.log(e)
        }
      })
    },
    setup_scene: function(scene, canvas, engine){
      // canvas.toString()
      const teleportingCamera = new TeleportingCamera(scene, canvas)
      new Ground(scene, teleportingCamera)
      this.walls = new Walls(scene, this)
      this.walls.loadArtworks()
      scene.environmentTexture = new BABYLON.HDRCubeTexture(`${process.env.VUE_APP_BACKEND_URL}/static/quarry.hdr`, scene, 128, false, true, false, true);

      const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);

      engine.runRenderLoop(function (){
        scene.render();
      });

      return scene;
    },
    artworkPositioned: function() {
      this.$emit('artwork-positioned')
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize);

    this.engine =  new BABYLON.Engine(this.$refs.canvas, true);
    this.load_scene(this.engine, this.$refs.canvas);

  }
}
</script>

<style scoped>
canvas{
  width:100vw;
  height:100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>