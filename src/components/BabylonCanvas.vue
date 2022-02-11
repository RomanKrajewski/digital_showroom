<template>
  <div>
    <canvas ref = 'canvas' ></canvas>
    <p>{{debugMessage}}</p>
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
  props:['debugMessage', 'positioningArtwork'],
  data: function () {
    return {
      engine: null,
      scene: null,
    }
  },
  watch:{
    positioningArtwork(oldArtwork, newArtwork){
      if(oldArtwork === newArtwork){
        return
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
          vm.debug_message = e.toString()
        }
      })
    },
    setup_scene: function(scene, canvas, engine){
      // canvas.toString()
      const teleportingCamera = new TeleportingCamera(scene, canvas)
      new Ground(scene, teleportingCamera)
      new Walls(scene)
      scene.environmentTexture = new BABYLON.HDRCubeTexture(`${process.env.VUE_APP_BACKEND_URL}/static/quarry.hdr`, scene, 128, false, true, false, true);

      const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);

      // canvas.addEventListener(onmousemove())

      engine.runRenderLoop(function (){
        scene.render();
      });

      return scene;
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
  width:100%;
  height:100%;
}
</style>