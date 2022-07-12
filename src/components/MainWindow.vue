<template>
  <div >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="ma-0 pa-0">
           <div>
              <v-overlay :model-value="overlay" contained class="align-center justify-center">
                <h1>Lade...</h1>
              </v-overlay>
              <canvas class="ma-0" ref = 'canvas' ></canvas>
            </div>
          </v-col>

          <v-col v-if="show_navigation || show_login" cols="12" sm="6" md="4" xl="2" id="right_pane_root" class="ma-0 pa-0">
            <artwork-list @artwork-updated="updateArtwork" @positioning="initPositioningArtwork" v-if="show_navigation"></artwork-list>
            <login-form v-if="show_login"></login-form>
          </v-col>
          <artwork-hover-info cols="12" sm="6" md="4" xl="2" v-if="showHoverInfo &! focusedArtwork" :artwork="hoveringArtwork" ></artwork-hover-info>
          <artwork-focus-info cols="12" sm="6" md="4" xl="2" v-if="showFocusInfo" :artwork="focusedArtwork"></artwork-focus-info>
        </v-row>
      </v-container>
  </div>

</template>

<script>
import ArtworkList from "./ArtworkList";
import LoginForm from "./LoginForm";
import ArtworkHoverInfo from "./ArtworkHoverInfo";
import ArtworkFocusInfo from "@/components/ArtworkFocusInfo";
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import {TeleportingCamera} from "@/components/scene_elements/teleportingCamera";
import {Ground} from "@/components/scene_elements/ground";
import {Walls} from "@/components/scene_elements/walls";
import {MOVEMENT_KEYS} from "@/components/scene_elements/FreeCameraRotateInput";

export default {

  name: 'MainWindow',
  components: {ArtworkHoverInfo, LoginForm, ArtworkList, ArtworkFocusInfo},
  props:['show_navigation', 'show_login'],
  data: function (){
    return {
      positioningArtwork: {prop: true },
      updatingArtwork:{prop:true},
      showHoverInfo: false,
      hoveringArtwork: null,
      showFocusInfo: false,
      focusedArtwork: null,
      scene: null,
      walls: null,
      teleportingCamera: null,
      pointerDown: false,
      overlay: false,
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
    initPositioningArtwork: function (artwork){
      if (artwork){
        this.overlay=true
        this.walls.positionArtwork(artwork)
      }
    },
    artworkPositioned: function (){
      this.initPositioningArtwork(null)
    },
    updateArtwork: function(artwork){
      this.walls.updateArtwork(artwork)
    },
    artworkHoverEnter: function(artwork){
      if (artwork) {
        this.showHoverInfo = true
        this.hoveringArtwork = artwork
      } else{
        this.showHoverInfo = false
      }
    },
    artworkFocused: function(artwork){
      if(artwork){
        this.showFocusInfo = true
        this.focusedArtwork = artwork
      }else{
        this.showFocusInfo = false
        this.focusedArtwork = null
      }
    },
    cameraTargetArtwork: function(artwork){
      this.teleportingCamera.targetArtwork(artwork)
    },
    positioningInitialized: function(){
      this.overlay = false
    },
    resize: function (){
      this.scene.getEngine().resize()
    }

  }

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#right_pane_root{
  transform: translateX(0);
  position: fixed;
  left: 0;
  top: 0;
  background: white;
  height: 100vh;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
canvas{
  width:100vw;
  height:100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>

