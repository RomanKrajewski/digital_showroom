import * as BABYLON from "babylonjs";

import {SCALING_FACTOR} from "@/constants";
import {FreeCameraKeyboardRotateInput} from "@/components/scene_elements/FreeCameraRotateInput";
const CAMERA_DEFAULT_HEIGHT = 1.20 * SCALING_FACTOR
class TeleportingCamera {
    constructor(scene, canvas, canvasComponent) {

        this.scene = scene;
        this.canvas = canvas;
        this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, CAMERA_DEFAULT_HEIGHT, 0),this.scene);

        this.camera.attachControl(canvas, true);
        this.camera.minZ = 0.1
        // this.camera.fov = 1.3
        this.camera.fov = 1

        // scene.gravity = new BABYLON.Vector3(0, 0.15, 0);
        // this.camera.applyGravity = true;

        // const assumedFramesPerSecond = 60;
        // const earthGravity = -9.81;
        // scene.gravity = new BABYLON.Vector3(0, earthGravity / assumedFramesPerSecond, 0);
        //radius of the ellipsoid has to be half camera hight
        this.camera.ellipsoid = new BABYLON.Vector3(0.5, CAMERA_DEFAULT_HEIGHT/2, 0.5);
        scene.collisionsEnabled = true;
        this.camera.checkCollisions = true;
        scene.meshes.filter(mesh => mesh.name.includes("Wand") || mesh.name.includes("Raum")).forEach(mesh => {
            mesh.checkCollisions = true
        })
        this.camera.speed = 0.1
        this.camera.inputs.remove(this.camera.inputs.attached.keyboard)
        this.camera.inputs.add(new FreeCameraKeyboardRotateInput(this, canvasComponent))
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
        const distance_factor = 1.5

        const pick_boarder_x_pos = wall_pos_x.pickedPoint ? wall_pos_x.pickedPoint.x - distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.x
        const pick_boarder_x_neg = wall_neg_x.pickedPoint ? wall_neg_x.pickedPoint.x + distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.x
        const pick_boarder_z_pos = wall_pos_z.pickedPoint ? wall_pos_z.pickedPoint.z - distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.z
        const pick_boarder_z_neg = wall_neg_z.pickedPoint ? wall_neg_z.pickedPoint.z + distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.z

        const newCameraX= Math.max(Math.min(pick_boarder_x_pos, pointerInfo.pickInfo.pickedPoint.x), pick_boarder_x_neg)
        const newCameraZ = Math.max(Math.min(pick_boarder_z_pos, pointerInfo.pickInfo.pickedPoint.z), pick_boarder_z_neg)
        this.animateTo(new BABYLON.Vector3(newCameraX, this.camera.position.y, newCameraZ));
    }

    animateToDefaultHeight(){
        // this.animateTo(new BABYLON.Vector3(this.camera.position.x, CAMERA_DEFAULT_HEIGHT, this.camera.position.z))
        if (this.camera.position.y > CAMERA_DEFAULT_HEIGHT - 0.001 && this.camera.position.y < CAMERA_DEFAULT_HEIGHT + 0.001){
            return
        }
        const animation = new BABYLON.Animation(
            "camera",
            "position.y",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [];

        keys.push({
            frame: 0,
            value: this.camera.position.y
        });

        keys.push({
            frame: 75,
            value: CAMERA_DEFAULT_HEIGHT,
        });

        animation.setKeys(keys);
        // Creating an easing function
        let easingFunction = new BABYLON.QuadraticEase();

        // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

        // Adding the easing function to the animation
        animation.setEasingFunction(easingFunction);
        this.camera.animations = []
        this.camera.animations.push(animation);


        this.scene.beginAnimation(this.camera, 0, 75, false, 1);
    }

    animateTo(cameraPosition, cameraTarget = null) {
        const positionAnimation = new BABYLON.Animation(
            "camera",
            "position",
            60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [];

        keys.push({
            frame: 0,
            value: this.camera.position.clone()
        });

        keys.push({
            frame: 75,
            value: cameraPosition,
        });

        positionAnimation.setKeys(keys);
        this.camera.animations = [];
// Creating an easing function
        let easingFunction = new BABYLON.QuadraticEase();

// For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

// Adding the easing function to the animation
        positionAnimation.setEasingFunction(easingFunction);
        this.camera.animations.push(positionAnimation);

        if(cameraTarget){
            const targetAnimation = new BABYLON.Animation(
                "camera",
                "target",
                60,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            const keys = [];

            keys.push({
                frame: 0,
                value: this.camera.target.clone()
            });

            keys.push({
                frame: 75,
                value: cameraTarget,
            });

            targetAnimation.setKeys(keys);
            // Creating an easing function
            let easingFunction = new BABYLON.QuadraticEase();

            // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

            // Adding the easing function to the animation
            targetAnimation.setEasingFunction(easingFunction);
            this.camera.animations.push(targetAnimation);
        }

        this.scene.beginAnimation(this.camera, 0, 75, false, 1);
    }

    targetArtwork(artworkDetails){
        const half_h = artworkDetails.height*SCALING_FACTOR/200;
        const half_w = artworkDetails.width*SCALING_FACTOR/200;
        const canvasRatio = this.canvas.width/this.canvas.height;
        const l_height = half_h/Math.atan(this.camera.fov/2);
        const l_width = half_w/Math.atan(this.camera.fov*canvasRatio/2)
        const l = Math.max(l_width, l_height)
        const cameraPositioningVector = new BABYLON.Vector3(0,0,-l)
        // const yprQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(artworkDetails.orientation_vector.y, artworkDetails.orientation_vector.x, artworkDetails.orientation_vector.z)
        const yprQuaternion = new BABYLON.Quaternion(artworkDetails.orientation_quaternion.x, artworkDetails.orientation_quaternion.y, artworkDetails.orientation_quaternion.z, artworkDetails.orientation_quaternion.w)
        const rotationMatrix = new BABYLON.Matrix();
        yprQuaternion.toRotationMatrix(rotationMatrix);
        const rotatedPositioningVector = BABYLON.Vector3.TransformCoordinates(cameraPositioningVector, rotationMatrix);
        const imagePosition = new BABYLON.Vector3(artworkDetails.position_vector.x, artworkDetails.position_vector.y, artworkDetails.position_vector.z)

        this.animateTo(imagePosition.add(rotatedPositioningVector), imagePosition)

    }
}
export {TeleportingCamera}