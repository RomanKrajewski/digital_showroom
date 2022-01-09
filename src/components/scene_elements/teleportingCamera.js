import * as BABYLON from "babylonjs";


class TeleportingCamera {
    constructor(scene, canvas) {

        this.scene = scene;
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.75, 0),this.scene);

        this.camera.attachControl(canvas, true);

    }
    
    teleport(pointerInfo){
        const wall_pos_x =this.scene.pickWithRay(
            new BABYLON.Ray(
                new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new BABYLON.Vector3(1,0,0)))
        const wall_neg_x =this.scene.pickWithRay(
            new BABYLON.Ray(
                new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new BABYLON.Vector3(-1,0,0)))
        const wall_pos_z =this.scene.pickWithRay(
            new BABYLON.Ray(
                new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new BABYLON.Vector3(0,0,1)))
        const wall_neg_z =this.scene.pickWithRay(
            new BABYLON.Ray(
                new BABYLON.Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new BABYLON.Vector3(0,0,-1)))

        const newCameraX= Math.max(Math.min(wall_pos_x.pickedPoint.x - 1.5 *this.camera.minZ, pointerInfo.pickInfo.pickedPoint.x), wall_neg_x.pickedPoint.x + 1.5 *this.camera.minZ)
        const newCameraZ = Math.max(Math.min(wall_pos_z.pickedPoint.z - 1.5 *this.camera.minZ, pointerInfo.pickInfo.pickedPoint.z), wall_neg_z.pickedPoint.z + 1.5 *this.camera.minZ)

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
            value:this.camera.position.clone()
        });

        keys.push({
            frame: 20,
            value: new BABYLON.Vector3(newCameraX,this.camera.position.y, newCameraZ),
        });

        animationcamera.setKeys(keys);
       this.camera.animations = [];

       this.camera.animations.push(animationcamera);

       this.scene.beginAnimation(this.camera, 0, 20, false, 1);
    }
}
export {TeleportingCamera}