<template>
<canvas ref = 'canvas' ></canvas>
</template>

<script>
import * as BABYLON from 'babylonjs';
export default {
  name: "BabylonCanvas",
  data: function () {
    return {
      engine: null,
    }
  },
  methods: {
    resize: function (){
      this.engine.resize()
    },
    create_scene: function(engine, canvas){
      // This creates a basic Babylon Scene object (non-mesh)
      const scene = new BABYLON.Scene(engine);

      // This creates and positions a free camera (non-mesh)
      const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.75, 0), scene);

      // This targets the camera to scene origin

      // This attaches the camera to the canvas
      camera.attachControl(canvas, true);

      // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
      const point_light_a = new BABYLON.PointLight('point_light_a', new BABYLON.Vector3(0, 3.5, 2.7), scene);
      const point_light_b = new BABYLON.PointLight('point_light_b', new BABYLON.Vector3(0, 3.5, -2.7), scene);
      point_light_a.intensity = 0.3
      point_light_b.intensity = 0.3
      // Default intensity is 1. Let's dim the light a small amount
      light.intensity = 0.0;
      const human = BABYLON.MeshBuilder.CreateCylinder('human', {diameter: 0.5, height: 1.8}, scene);
      human.position.x = 2;
      human.position.z = 1.5;
      human.position.y = 0.9;

      camera.setTarget(human.position);
      const wall_a = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 4.6, depth: 0.1});
      const wall_b = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 4.6, depth: 0.1});
      const wall_c = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 0.1, depth: 10});
      const wall_d = BABYLON.MeshBuilder.CreateBox('walls', {height: 4.0, width: 0.1, depth: 10});
      wall_a.position.z = 5.0;
      wall_b.position.z = -5.0;
      wall_c.position.x = 2.3;
      wall_d.position.x = -2.3

      wall_a.position.y = 2;
      wall_b.position.y = 2;
      wall_c.position.y = 2;
      wall_d.position.y = 2;

      // Our built-in 'ground' shape.
      BABYLON.MeshBuilder.CreateGround("ground", {width: 4.6, height: 10.0}, scene);
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