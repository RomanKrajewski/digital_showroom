<template>
  <div >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="ma-0 pa-0">
           <div>
              <v-overlay :model-value="loading" contained class="align-center justify-center">
                <h1>Lade...</h1>
              </v-overlay>
              <canvas class="ma-0" ref = 'canvas' ></canvas>
            </div>
          </v-col>

          <v-col v-if="show_navigation || show_login" cols="12" sm="6" md="4" xl="2" id="right_pane_root" class="ma-0 pa-0">
            <artwork-list @artwork-updated="updateArtwork" @positioning="initPositioningArtwork" v-if="show_navigation"></artwork-list>
            <login-form v-if="show_login"></login-form>
          </v-col>
          <artwork-hover-info v-if="hoveringArtwork && !focusedArtwork " :artwork="hoveringArtwork" ></artwork-hover-info>
          <artwork-focus-info v-if="focusedArtwork" :artwork="focusedArtwork"></artwork-focus-info>
          <v-btn id="tutorialButton" icon variant="flat" color="transparent" v-on:click="show_tutorial=true">
            <v-icon>mdi-help</v-icon>
          </v-btn>
          <tutorial-dialogue v-if="show_tutorial" @close-tutorial="show_tutorial=false" id="tutorialDialogue" cols="10" sm="5" md="3" xl="2" class="ma-0 pa-0"></tutorial-dialogue>
        </v-row>
      </v-container>
  </div>

</template>

<script>
import ArtworkList from "./ArtworkList";
import LoginForm from "./LoginForm";
import ArtworkHoverInfo from "./ArtworkHoverInfo";
import ArtworkFocusInfo from "@/components/ArtworkFocusInfo";
import {TeleportingCamera} from "@/components/scene_elements/teleportingCamera";
import {Ground} from "@/components/scene_elements/ground";
import {Walls} from "@/components/scene_elements/walls";
import {MOVEMENT_KEYS} from "@/components/scene_elements/FreeCameraRotateInput";

import {Color3} from "@babylonjs/core/Maths/math.color"
import {Engine} from "@babylonjs/core/Engines/engine"
import {PointerEventTypes} from "@babylonjs/core/Events/pointerEvents"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader"

import "@babylonjs/loaders/glTF"
import TutorialDialogue from "@/components/TutorialDialogue";
export default {

  name: 'MainWindow',
  components: {TutorialDialogue, ArtworkHoverInfo, LoginForm, ArtworkList, ArtworkFocusInfo},
  props:['show_navigation', 'show_login'],
  data: function (){
    return {
      hoveringArtwork: null,
      focusedArtwork: null,
      scene: null,
      walls: null,
      teleportingCamera: null,
      pointerDown: false,
      loading: false,
      show_tutorial:true
    }
  },
  mounted() {
    this.loading = true
    const engine = new Engine(this.$refs.canvas, true);
    engine.resize()
    window.addEventListener('resize', () => engine.resize());
    const vm = this
    SceneLoader.ShowLoadingScreen = false;
    SceneLoader.Load(`${process.env.VUE_APP_BACKEND_URL}/static/`, 'model.glb', engine,
        function(scene){
          vm.debug_message = 'success'
          try{
            vm.scene = vm.setup_scene(scene)
            vm.loading = false
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

      scene.clearColor = new Color3(1, 1, 1);

      return scene;
    },
    setupArtworkFocusEventListeners: function (scene) {
      scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
          this.pointerDown = true
        }
        if (pointerInfo.type === PointerEventTypes.POINTERUP) {
          this.pointerDown = false
        }
        if (pointerInfo.type === PointerEventTypes.POINTERMOVE && this.pointerDown) {
          this.teleportingCamera.animateToDefaultHeight()
          this.focusedArtwork = null
        }
      })

      scene.getEngine().getInputElement().addEventListener("keydown", (evt) => {
            if (MOVEMENT_KEYS.indexOf(evt.keyCode) !== -1) this.focusedArtwork = null
          }
      )
    },
    initPositioningArtwork: function (artwork){
      if (artwork){
        this.loading=true
        this.walls.positionArtwork(artwork)
      }
    },
    updateArtwork: function(artwork){
      this.walls.updateArtwork(artwork)
    },
    cameraTargetArtwork: function(artwork){
      this.teleportingCamera.targetArtwork(artwork)
    },

  },
  watch:{
    focusedArtwork(newArtwork, oldArtwork){
      if(!newArtwork && oldArtwork !== newArtwork){
        this.walls.muteArtworks()

      }
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
#tutorialDialogue{
  position: fixed;
  background: white;
  bottom: 20px;
  right: 20px;
}
#tutorialButton{
  position: fixed;
  bottom: 20px;
  right: 20px;
}
canvas{
  width:100vw;
  height:100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>

