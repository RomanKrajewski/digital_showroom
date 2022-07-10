import * as BABYLON from "babylonjs";

export class FreeCameraKeyboardRotateInput{
    constructor(camera, canvasComponent) {
        this.keys = []
        this.keysLeft = [37, 65]
        this.keysRight= [39, 68]
        this.keysUp=[38,87]
        this.keysDown=[40, 83]
        this.keysAll=[]
        this.keysAll = this.keysAll.concat(this.keysUp, this.keysDown, this.keysLeft, this.keysRight)
        this.sensibility = 0.04
        this.teleportingCamera = camera
        this.canvasComponent = canvasComponent
    }
    getSimpleName = function(){
        return "keyboardRotate"
    }
    attachControl = function (noPreventDefault) {
        this.noPreventDefault = noPreventDefault
        const engine = this.teleportingCamera.camera.getEngine();
        const element = engine.getInputElement();
        element.addEventListener("keydown", this.onKeyDown.bind(this), false);
        element.addEventListener("keyup", this.onKeyUp.bind(this), false);
            // BABYLON.Tools.RegisterTopRootEvents(canvas, [{ name: "blur", handler: this._onLostFocus }]);
    };

    checkInputs = function () {
        const camera = this.teleportingCamera.camera;
        // Keyboard
        // console.log(this.keys)
        for (let index = 0; index < this.keys.length; index++) {
            const keyCode = this.keys[index];
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                // console.log("rotating left")
                camera.rotation.y -= this.sensibility;
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                // console.log("rotating right")
                camera.rotation.y += this.sensibility;
            } else if (this.keysUp.indexOf(keyCode) !== -1){
                const forward = camera.getDirection(BABYLON.Vector3.Forward())
                forward.y = 0
                camera.cameraDirection.addInPlace(forward.scale(this.sensibility/3));
            } else if (this.keysDown.indexOf(keyCode) !== -1){
                const backward = camera.getDirection(BABYLON.Vector3.Backward())
                backward.y = 0
                camera.cameraDirection.addInPlace(backward.scale(this.sensibility/3));
            }
        }

    };

    onKeyUp = function (evt) {
        if (this.keysAll.indexOf(evt.keyCode) !== -1) {
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
        // this.teleportingCamera.animateToDefaultHeight()
        // this.teleportingCamera.animateToDefaultTargetHeight()
        this.canvasComponent.artworkFocused(null)
        if (this.keysAll.indexOf(evt.keyCode) !== -1) {
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