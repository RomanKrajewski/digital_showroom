import {Vector3} from "@babylonjs/core/Maths/math.vector";

const MOVEMENT_SPEED = 6/10000
const ROTATION_SPEED = 3/1000

const KEYS_LEFT = [37, 65]
const KEYS_RIGHT = [39, 68]
const KEYS_UP =[38,87]
const KEYS_DOWN =[40, 83]
export const MOVEMENT_KEYS = Array.prototype.concat(KEYS_UP, KEYS_DOWN, KEYS_LEFT, KEYS_RIGHT)

export class FreeCameraKeyboardRotateInput{
    constructor(teleportingCamera) {
        this.keys = []

        this.teleportingCamera = teleportingCamera
        this.engine = teleportingCamera.camera.getEngine()
    }
    getSimpleName = function(){
        return "keyboardRotate"
    }
    attachControl = function (noPreventDefault) {
        this.noPreventDefault = noPreventDefault
        const element = this.engine.getInputElement();
        element.addEventListener("keydown", this.onKeyDown.bind(this), false);
        element.addEventListener("keyup", this.onKeyUp.bind(this), false);
    };

    checkInputs = function () {
        const camera = this.teleportingCamera.camera;
        // Keyboard
        // console.log(this.keys)
        for (let index = 0; index < this.keys.length; index++) {
            const keyCode = this.keys[index];
            if (KEYS_LEFT.indexOf(keyCode) !== -1) {
                camera.rotation.y -= ROTATION_SPEED * this.engine.getDeltaTime();
            } else if (KEYS_RIGHT.indexOf(keyCode) !== -1) {
                camera.rotation.y += ROTATION_SPEED * this.engine.getDeltaTime();
            } else if (KEYS_UP.indexOf(keyCode) !== -1){
                const forward = camera.getDirection(Vector3.Forward())
                forward.y = 0
                camera.cameraDirection.addInPlace(forward.scale(MOVEMENT_SPEED * this.engine.getDeltaTime()));
            } else if (KEYS_DOWN.indexOf(keyCode) !== -1){
                const backward = camera.getDirection(Vector3.Backward())
                backward.y = 0
                camera.cameraDirection.addInPlace(backward.scale(MOVEMENT_SPEED * this.engine.getDeltaTime()));
            }
        }

    };

    onKeyUp = function (evt) {
        if (MOVEMENT_KEYS.indexOf(evt.keyCode) !== -1) {
            const index = this.keys.indexOf(evt.keyCode);
            if (index >= 0) {
                this.keys.splice(index, 1);
            }
            if (!this.noPreventDefault) {
                evt.preventDefault();
            }
        }
    };

    onKeyDown = function (evt) {
        if (MOVEMENT_KEYS.indexOf(evt.keyCode) !== -1) {
            const index = this.keys.indexOf(evt.keyCode);
            if (index === -1) {
                this.keys.push(evt.keyCode);
            }
            if (!this.noPreventDefault) {
                evt.preventDefault();
            }
        }
    };
}