import {SCALING_FACTOR} from "@/constants";
import {FreeCameraKeyboardRotateInput, MOVEMENT_KEYS} from "@/components/scene_elements/FreeCameraRotateInput";
import {ROOM_MESH_NAME} from "@/components/scene_elements/walls";

import {Matrix, Vector3, Quaternion} from "@babylonjs/core/Maths/math.vector"
import {EasingFunction, QuadraticEase} from "@babylonjs/core/Animations/easing"
import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera"
import {Animation} from "@babylonjs/core/Animations/animation"
import "@babylonjs/core/Animations/animatable"
import {Ray} from "@babylonjs/core/Culling/ray"
import "@babylonjs/core/Collisions/collisionCoordinator"

const CAMERA_DEFAULT_HEIGHT = 1.20 * SCALING_FACTOR
const FOV = 0.8 //horizontal fov in radians
class TeleportingCamera {
    constructor(scene) {

        this.scene = scene;
        this.canvas = scene.getEngine().getRenderingCanvas();
        this.camera = new FreeCamera("camera", new Vector3(0, CAMERA_DEFAULT_HEIGHT, 0),this.scene);

        this.camera.attachControl(this.canvas, true);
        this.camera.minZ = 0.1
        this.camera.fov = FOV
        this.camera.rotation.y = Math.PI
        this.cameraHeightAnimationRunning = false;
        this.cameraTargetHeightAnimationRunning = false;

        this.camera.ellipsoid = new Vector3(0.5, CAMERA_DEFAULT_HEIGHT/2, 0.5);
        scene.collisionsEnabled = true;
        this.camera.checkCollisions = true;
        scene.getMeshByName(ROOM_MESH_NAME).checkCollisions = true

        this.camera.inputs.remove(this.camera.inputs.attached.keyboard)
        this.keyboardRotateInput = new FreeCameraKeyboardRotateInput(this)
        // noinspection JSCheckFunctionSignatures
        this.camera.inputs.add(this.keyboardRotateInput)
        this.camera.getEngine().getInputElement().addEventListener("keydown", (evt) => this.resetCameraOnMovement(evt))
    }

    resetCameraOnMovement(evt){
        if (MOVEMENT_KEYS.indexOf(evt.keyCode) !== -1) {
            this.animateToDefaultTargetHeight()
            this.animateToDefaultHeight()
        }
    }
    
    teleport(pointerInfo){
        const wall_pos_x =this.scene.pickWithRay(
            new Ray(
                new Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new Vector3(1,0,0)))
        const wall_neg_x =this.scene.pickWithRay(
            new Ray(
                new Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new Vector3(-1,0,0)))
        const wall_pos_z =this.scene.pickWithRay(
            new Ray(
                new Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new Vector3(0,0,1)))
        const wall_neg_z =this.scene.pickWithRay(
            new Ray(
                new Vector3(pointerInfo.pickInfo.pickedPoint.x,this.camera.position.y, pointerInfo.pickInfo.pickedPoint.z),
                new Vector3(0,0,-1)))
        const distance_factor = 1.5

        const pick_boarder_x_pos = wall_pos_x.pickedPoint ? wall_pos_x.pickedPoint.x - distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.x
        const pick_boarder_x_neg = wall_neg_x.pickedPoint ? wall_neg_x.pickedPoint.x + distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.x
        const pick_boarder_z_pos = wall_pos_z.pickedPoint ? wall_pos_z.pickedPoint.z - distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.z
        const pick_boarder_z_neg = wall_neg_z.pickedPoint ? wall_neg_z.pickedPoint.z + distance_factor * this.camera.minZ : pointerInfo.pickInfo.pickedPoint.z

        const newCameraX= Math.max(Math.min(pick_boarder_x_pos, pointerInfo.pickInfo.pickedPoint.x), pick_boarder_x_neg)
        const newCameraZ = Math.max(Math.min(pick_boarder_z_pos, pointerInfo.pickInfo.pickedPoint.z), pick_boarder_z_neg)
        this.animateTo(new Vector3(newCameraX, this.camera.position.y, newCameraZ));
    }

    animateToDefaultHeight(){
        if (this.cameraHeightAnimationRunning || this.camera.position.y > CAMERA_DEFAULT_HEIGHT - 0.1 && this.camera.position.y < CAMERA_DEFAULT_HEIGHT + 0.1){
            return
        }

        this.camera.animations = []

        const animation = new Animation(
            "camera",
            "position.y",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [];

        keys.push({frame: 0, value: this.camera.position.y });
        keys.push({frame: 75, value: CAMERA_DEFAULT_HEIGHT});
        animation.setKeys(keys);

        animation.setEasingFunction(this.getQuadraticEaseOut());

        this.camera.animations.push(animation);

        this.cameraHeightAnimationRunning = true
        this.scene.beginAnimation(this.camera, 0, 75, false, 1, () => this.cameraHeightAnimationRunning = false);
    }

    animateToDefaultTargetHeight(){
        if (this.cameraTargetHeightAnimationRunning || this.camera.rotation.x > - 0.05 && this.camera.rotation.x < 0.05){
            return
        }

        this.camera.animations = []
        const animation = new Animation(
            "camera",
            "rotation.x",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [];
        keys.push({frame: 0, value: this.camera.rotation.x});
        keys.push({frame: 45, value: 0});
        animation.setKeys(keys);

        animation.setEasingFunction(this.getQuadraticEaseOut());

        this.camera.animations.push(animation);
        this.cameraTargetHeightAnimationRunning = true
        this.scene.beginAnimation(this.camera, 0, 45, false, 1, () => this.cameraTargetHeightAnimationRunning = false);
    }

    animateTo(cameraPosition, cameraTarget = null) {
        this.camera.animations = [];

        const positionAnimation = new Animation(
            "camera",
            "position",
            60,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [];
        keys.push({frame: 0, value: this.camera.position.clone()});
        keys.push({frame: 75, value: cameraPosition});
        positionAnimation.setKeys(keys);

        positionAnimation.setEasingFunction(this.getQuadraticEaseOut());

        this.camera.animations.push(positionAnimation);

        if(cameraTarget){
            const targetAnimation = new Animation(
                "camera",
                "target",
                60,
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            const keys = [];
            keys.push({frame: 0, value: this.camera.target.clone()});
            keys.push({frame: 75, value: cameraTarget,});
            targetAnimation.setKeys(keys);

            targetAnimation.setEasingFunction(this.getQuadraticEaseOut());

            this.camera.animations.push(targetAnimation);
        }

        this.scene.beginAnimation(this.camera, 0, 75, false, 1);
    }

    getQuadraticEaseOut(){
        let easingFunction = new QuadraticEase();
        easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
        return easingFunction
    }
    targetArtwork(artworkDetails){
        const half_h = artworkDetails.height*SCALING_FACTOR/200;
        const half_w = artworkDetails.width*SCALING_FACTOR/200;
        const canvasRatio = this.canvas.width/this.canvas.height;
        const l_height = half_h/Math.atan(this.camera.fov/2);
        const l_width = half_w/Math.atan(this.camera.fov*canvasRatio/2)
        const l = Math.max(l_width, l_height)
        const cameraPositioningVector = new Vector3(0,0,-l)

        const yprQuaternion = new Quaternion(artworkDetails.orientation_quaternion.x, artworkDetails.orientation_quaternion.y, artworkDetails.orientation_quaternion.z, artworkDetails.orientation_quaternion.w)
        const rotationMatrix = new Matrix();
        yprQuaternion.toRotationMatrix(rotationMatrix);
        const rotatedPositioningVector = Vector3.TransformCoordinates(cameraPositioningVector, rotationMatrix);
        const imagePosition = new Vector3(artworkDetails.position_vector.x, artworkDetails.position_vector.y, artworkDetails.position_vector.z)

        this.animateTo(imagePosition.add(rotatedPositioningVector), imagePosition)

    }
}
export {TeleportingCamera}