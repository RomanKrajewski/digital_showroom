import * as BABYLON from "babylonjs";

class Ground{
    constructor(scene, teleporting_camera) {

        const move_indicator = BABYLON.MeshBuilder.CreateCylinder("move_indicator", {diameter: 0.2, height: 0.05}, scene);
        move_indicator.setEnabled(false);
        move_indicator.position.y = 0.025;
        const move_indicator_material = new BABYLON.StandardMaterial("move_indicator_material", scene)
        move_indicator_material.alpha = 0.7
        move_indicator.material = move_indicator_material
        // Our built-in 'ground' shape.

        const ground = scene.getMeshByName('floor_Baked')
        ground.actionManager = new BABYLON.ActionManager(scene)

        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                function () {move_indicator.setEnabled(true)}))
        scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                if(pointerInfo.pickInfo.pickedPoint){
                    move_indicator.position = pointerInfo.pickInfo.pickedPoint;
                }
            }
            if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP && move_indicator.isEnabled()){
                teleporting_camera.teleport(pointerInfo);
            }
        })
        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                function () {move_indicator.setEnabled(false)}))
    }

}
export {Ground}