<template>
  <div>
    <canvas ref = 'canvas' ></canvas>
    <p>{{debug_message}}</p>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
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

      // This creates and positions a free camera (non-mesh)
      const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.75, 0), scene);

      // This targets the camera to scene origin

      // This attaches the camera to the canvas
      camera.attachControl(canvas, true);

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

      const move_indicator = BABYLON.MeshBuilder.CreateCylinder("move_indicator", {diameter: 0.2, height: 0.05}, scene);
      move_indicator.setEnabled(false);
      move_indicator.position.y = 0.025;
      const move_indicator_material = new BABYLON.StandardMaterial("move_indicator_material", scene)
      move_indicator_material.alpha = 0.7
      move_indicator.material = move_indicator_material
      // Our built-in 'ground' shape.
      const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 4.6, height: 10.0}, scene);
      ground.actionManager = new BABYLON.ActionManager(scene);
      ground.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
              function () {move_indicator.setEnabled(true)}))
      scene.onPointerObservable.add((pointerInfo) => {
        if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
          move_indicator.position = pointerInfo.pickInfo.pickedPoint;
        }
        if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP && move_indicator.isEnabled()){
          const wall_pos_x = scene.pickWithRay(
              new BABYLON.Ray(
                  new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x, camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                  new BABYLON.Vector3(1,0,0)))
          const wall_neg_x = scene.pickWithRay(
              new BABYLON.Ray(
                  new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x, camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                  new BABYLON.Vector3(-1,0,0)))
          const wall_pos_z = scene.pickWithRay(
              new BABYLON.Ray(
                  new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x, camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                  new BABYLON.Vector3(0,0,1)))
          const wall_neg_z = scene.pickWithRay(
              new BABYLON.Ray(
                  new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x, camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                  new BABYLON.Vector3(0,0,-1)))

          const newCameraX= Math.max(Math.min(wall_pos_x.pickedPoint.x - 1.5 * camera.minZ, pointerInfo.pickInfo.pickedPoint.x), wall_neg_x.pickedPoint.x + 1.5 * camera.minZ)
          const newCameraZ = Math.max(Math.min(wall_pos_z.pickedPoint.z - 1.5 * camera.minZ, pointerInfo.pickInfo.pickedPoint.z), wall_neg_z.pickedPoint.z + 1.5 * camera.minZ)

          const animationcamera = new BABYLON.Animation(
              "camera",
              "position",
              60,
              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
          );

          const keys = [];

          keys.push({
            frame: 0,
            value: camera.position.clone()
          });

          keys.push({
            frame: 20,
            value: new BABYLON.Vector3(newCameraX, camera.position.y, newCameraZ),
          });

          animationcamera.setKeys(keys);
          camera.animations = [];

          camera.animations.push(animationcamera);

          scene.beginAnimation(camera, 0, 20, false, 1);
        }
      })
      ground.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
              function () {move_indicator.setEnabled(false)}))
      const ground_material = new BABYLON.StandardMaterial("ground_material", scene)
      ground_material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5)
      ground.material = ground_material

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