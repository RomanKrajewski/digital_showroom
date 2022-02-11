import * as BABYLON from "babylonjs";

class Walls{
    constructor(scene) {

        const positioning_indicator = BABYLON.MeshBuilder.CreateBox("positioning_indicator", {width: 0.5, height: 0.25, depth:0.2}, scene);
        positioning_indicator.setEnabled(false);
        // positioning_indicator.position.y = 0.025;
        console.log(positioning_indicator.rotation)
        const positioning_indicator_material = new BABYLON.StandardMaterial("positioning_indicator_material", scene)
        positioning_indicator_material.alpha = 0.3
        positioning_indicator_material.material = positioning_indicator_material
        // Our built-in 'ground' shape.

        // const ground = scene.getMeshByName('floor_Baked')
        scene.meshes.filter(mesh => mesh.name.includes("Wand") || mesh.name.includes("ROOM")).forEach(mesh => {
            mesh.actionManager = new BABYLON.ActionManager(scene)
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                    function () {positioning_indicator.setEnabled(true)}))
            scene.onPointerObservable.add((pointerInfo) => {
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                    if(pointerInfo.pickInfo.pickedPoint){
                        positioning_indicator.position = pointerInfo.pickInfo.pickedPoint;
                        const v1 = pointerInfo.pickInfo.getNormal()
                        const v2 = new BABYLON.Vector3(0,0,1)
                        const angle = Math.acos(BABYLON.Vector3.Dot(v1, v2));
                        const axis = BABYLON.Vector3.Cross(v1,v2) ;
                        positioning_indicator.rotation = new BABYLON.Vector3(0,0,0)
                        positioning_indicator.rotate(axis, angle)

                    }
                }
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP && positioning_indicator.isEnabled()){
                    // teleporting_camera.teleport(pointerInfo);
                }
            })
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                    function () {positioning_indicator.setEnabled(false)}))

        })
    }

}
export {Walls}