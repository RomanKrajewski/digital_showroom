<template>
  <div>
    <v-overlay :model-value="overlay" contained class="align-center justify-center">
      <h1>Lade...</h1>
    </v-overlay>
    <canvas class="ma-0" ref = 'canvas' ></canvas>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import {TeleportingCamera} from './scene_elements/teleportingCamera'
import {Ground} from "./scene_elements/ground";
import {Walls} from "./scene_elements/walls";
import {MOVEMENT_KEYS} from "@/components/scene_elements/FreeCameraRotateInput";
export default {
  name: "BabylonCanvas",
  props:['positioningArtwork', 'updatingArtwork'],
  data: function () {
    return {
      scene: null,
      engine: null,
      walls: null,
      teleportingCamera: null,
      pointerDown: false,
      overlay: false,
    }
  },
  watch:{
    positioningArtwork(newArtwork){
      if (newArtwork){
        this.overlay=true
        this.walls.positionArtwork(newArtwork)
      }
    },
    updatingArtwork(newArtwork){
      this.walls.updateArtwork(newArtwork)
    }

  },
  mounted() {
    window.addEventListener('resize', this.resize);
    const engine = new BABYLON.Engine(this.$refs.canvas, true);
    const vm = this
    BABYLON.SceneLoader.Load(`${process.env.VUE_APP_BACKEND_URL}/static/`, 'model.glb', engine,
        function(scene){
          vm.debug_message = 'success'
          try{
            vm.scene = vm.setup_scene(scene)
          }
          catch (e){
            console.log(e)
          }
        })
  },
  methods: {
    resize: function (){
      this.scene.getEngine().resize()
    },

    setup_scene: function(scene){
      scene.meshes.forEach((mesh) => mesh.isPickable = false)
      scene.hoverCursor = "default"

      this.teleportingCamera = new TeleportingCamera(scene)
      new Ground(scene, this.teleportingCamera)
      this.walls = new Walls(scene, this)
      this.walls.loadArtworks()

      scene.getEngine().runRenderLoop(function (){
        scene.render();
      });
      this.setupArtworkFocusEventListeners(scene);

      scene.clearColor = new BABYLON.Color3(1, 1, 1);

      return scene;
    },
    setupArtworkFocusEventListeners: function (scene) {
      scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          this.pointerDown = true
        }
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP) {
          this.pointerDown = false
        }
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE && this.pointerDown) {
          this.teleportingCamera.animateToDefaultHeight()
          this.artworkFocused(null)
        }
      })

      scene.getEngine().getInputElement().addEventListener("keydown", (evt) => {
            if (MOVEMENT_KEYS.indexOf(evt.keyCode) !== -1) this.artworkFocused(null)
          }
      )
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
    },
    positioningInitialized: function(){
      this.overlay = false
    }
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