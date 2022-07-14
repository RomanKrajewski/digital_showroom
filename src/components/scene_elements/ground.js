import "@babylonjs/core/Meshes/Builders/cylinderBuilder";

import {PointerEventTypes} from "@babylonjs/core/Events/pointerEvents"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial"
import {ActionManager} from "@babylonjs/core/Actions/actionManager"
import {ExecuteCodeAction} from "@babylonjs/core/Actions/directActions"


class Ground{
    constructor(scene, teleporting_camera) {

        const move_indicator = MeshBuilder.CreateCylinder("move_indicator", {diameter: 0.2, height: 0.05}, scene);
        move_indicator.setEnabled(false);
        move_indicator.position.y = 0.025;
        move_indicator.isPickable = false;
        const move_indicator_material = new StandardMaterial("move_indicator_material", scene)
        move_indicator_material.alpha = 0.7
        move_indicator.material = move_indicator_material
        // Our built-in 'ground' shape.

        const ground = scene.getMeshByName('Floor')
        ground.isPickable = true
        ground.checkCollisions = true
        const invisible_mat = new StandardMaterial("mat", scene);
        invisible_mat.alpha = 0;
        ground.material = invisible_mat;



        ground.actionManager = new ActionManager(scene)

        ground.actionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOverTrigger},
                function () {
                move_indicator.setEnabled(true)
                scene.hoverCursor = 'none'
            }))

        scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                if(pointerInfo.pickInfo.pickedPoint){
                    move_indicator.position = pointerInfo.pickInfo.pickedPoint;
                }
            }

            if(pointerInfo.type === PointerEventTypes.POINTERTAP && pointerInfo.pickInfo.pickedMesh && pointerInfo.pickInfo.pickedMesh.id === ground.id){
                    teleporting_camera.teleport(pointerInfo);
            }
        })
        ground.actionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOutTrigger},
                function () {
                    move_indicator.setEnabled(false)
                    scene.hoverCursor = 'default'
                }))
    }

}
export {Ground}