<template>
  <div>
    <canvas ref = 'canvas' ></canvas>
    <p>{{debug_message}}</p>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import {TeleportingCamera} from '@/components/scene_elements/teleportingCamera'
import {Ground} from "@/components/scene_elements/ground";
export default {
  name: "BabylonCanvas",
  data: function () {
    return {
      engine: null,
      debug_message: 'hello'
    }
  },
  methods: {
    resize: function (){
      this.engine.resize()
    },
    create_scene: function(engine, canvas){
      // const vm = this
      // This creates a basic Babylon Scene object (non-mesh)
      const scene = new BABYLON.Scene(engine);

      const teleportingCamera = new TeleportingCamera(scene, canvas)
      new Ground(scene, teleportingCamera)
      // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      // const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
      const point_light_a = new BABYLON.PointLight('point_light_a', new BABYLON.Vector3(0, 3.5, 2.7), scene);
      point_light_a.diffuse = new BABYLON.Color3(1,1,1);
      const point_light_b = new BABYLON.PointLight('point_light_b', new BABYLON.Vector3(0, 3.5, -2.7), scene);
      point_light_a.intensity = 0.7
      point_light_b.intensity = 0.7
      // Default intensity is 1. Let's dim the light a small amount
      // light.intensity = 0.0;

      const wall_a = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 4.6, depth: 0.1});
      const wall_b = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 4.6, depth: 0.1});
      const wall_c = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 0.1, depth: 10});
      const wall_d = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 0.1, depth: 10});

      wall_a.position.z =  5.0;
      wall_b.position.z = -5.0;
      wall_c.position.x =  2.3;
      wall_d.position.x = -2.3;

      wall_a.position.y = 2;
      wall_b.position.y = 2;
      wall_c.position.y = 2;
      wall_d.position.y = 2;

      return scene;
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize);

    this.engine =  new BABYLON.Engine(this.$refs.canvas, true);
    const scene = this.create_scene(this.engine, this.$refs.canvas);
    this.engine.runRenderLoop(function (){
      scene.render();
    });

  }
}
</script>

<style scoped>
canvas{
  width:100%;
  height:100%;
}
</style>