<template>
  <div>
    <canvas class="ma-0" ref = 'canvas' ></canvas>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import {TeleportingCamera} from './scene_elements/teleportingCamera'
import {Ground} from "./scene_elements/ground";
import {Walls} from "./scene_elements/walls";
export default {
  name: "BabylonCanvas",
  props:['positioningArtwork', 'updatingArtwork'],
  data: function () {
    return {
      engine: null,
      scene: null,
      walls: null,
      teleportingCamera: null,
      pointerDown: false,
    }
  },
  watch:{
    positioningArtwork(newArtwork){
      if (newArtwork){
        this.walls.positionArtwork(newArtwork)
      }
    },
    updatingArtwork(newArtwork){
      this.walls.updateArtwork(newArtwork)
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

      scene.hoverCursor = "default"
      this.teleportingCamera = new TeleportingCamera(scene, canvas)
      new Ground(scene, this.teleportingCamera)
      this.walls = new Walls(scene, this)
      this.walls.loadArtworks()
      // scene.environmentTexture = new BABYLON.HDRCubeTexture(`${process.env.VUE_APP_BACKEND_URL}/static/quarry.hdr`, scene, 128, false, true, false, true);

      engine.runRenderLoop(function (){
        scene.render();
      });

      scene.onPointerObservable.add((pointerInfo)=>{
        if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN){
          this.pointerDown = true
        }
        if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP){
          this.pointerDown = false
        }
        if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE && this.pointerDown){
          this.teleportingCamera.animateToDefaultHeight()
          this.artworkFocused(null)
        }
      }
      )
      scene.clearColor = new BABYLON.Color3(1, 1, 1);

      return scene;
    },
    artworkPositioned: function() {
      this.$emit('artwork-positioned')
    },
    artworkHoverEnter: function(artwork){
      this.$emit('artwork-hover-enter', artwork)
    },
    artworkFocused: function(artwork){
      this.$emit('artwork-focused', artwork)
    },
    cameraTargetArtwork: function(artwork){
      this.teleportingCamera.targetArtwork(artwork)
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