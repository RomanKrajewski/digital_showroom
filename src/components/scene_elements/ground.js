import * as BABYLON from "babylonjs";

class Ground{
    constructor(scene, teleporting_camera) {

        const move_indicator = BABYLON.MeshBuilder.CreateCylinder("move_indicator", {diameter: 0.2, height: 0.05}, scene);
        move_indicator.setEnabled(false);
        move_indicator.position.y = 0.025;
        move_indicator.isPickable = false;
        const move_indicator_material = new BABYLON.StandardMaterial("move_indicator_material", scene)
        move_indicator_material.alpha = 0.7
        move_indicator.material = move_indicator_material
        // Our built-in 'ground' shape.

        const ground = scene.getMeshByName('Floor')

        const invisible_mat = new BABYLON.StandardMaterial("mat", scene);
        invisible_mat.alpha = 0;
        ground.material = invisible_mat;



        ground.actionManager = new BABYLON.ActionManager(scene)

        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                function () {
                move_indicator.setEnabled(true)
                scene.hoverCursor = 'none'
            }))

        scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                if(pointerInfo.pickInfo.pickedPoint){
                    move_indicator.position = pointerInfo.pickInfo.pickedPoint;
                }
            }

            if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP && pointerInfo.pickInfo.pickedMesh.id === ground.id){
                    console.log("teleporting")
                    teleporting_camera.teleport(pointerInfo);
            }
        })
        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                function () {
                    move_indicator.setEnabled(false)
                    scene.hoverCursor = 'default'
                }))
    }

}
export {Ground}