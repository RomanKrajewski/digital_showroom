import * as BABYLON from "babylonjs";

class Walls{
    positioningIndicator
    currentArtwork = null
    scene
    constructor(scene) {
        this.scene = scene
        this.positioningIndicator = BABYLON.MeshBuilder.CreateBox("positioningIndicator", {width: 0.5, height: 0.25, depth:0.2}, scene);
        this.positioningIndicator.setEnabled(false);
        // positioningIndicator.position.y = 0.025;
        // console.log(this.positioningIndicator.rotation)
        const positioningIndicator_material = new BABYLON.StandardMaterial("positioningIndicator_material", scene)
        positioningIndicator_material.alpha = 0.3
        positioningIndicator_material.material = positioningIndicator_material
        // Our built-in 'ground' shape.

        // const ground = scene.getMeshByName('floor_Baked')
        scene.meshes.filter(mesh => mesh.name.includes("Wand") || mesh.name.includes("ROOM")).forEach(mesh => {
            mesh.actionManager = new BABYLON.ActionManager(scene)
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                     () => {if (this.currentArtwork) this.positioningIndicator.setEnabled(true)}))
            scene.onPointerObservable.add((pointerInfo) => {
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                    if(pointerInfo.pickInfo.pickedPoint){
                        this.positioningIndicator.position = pointerInfo.pickInfo.pickedPoint;
                        const v1 = pointerInfo.pickInfo.getNormal()
                        const v2 = new BABYLON.Vector3(0,0,1)
                        const angle = Math.acos(BABYLON.Vector3.Dot(v1, v2));
                        const axis = BABYLON.Vector3.Cross(v1,v2) ;
                        this.positioningIndicator.rotation = new BABYLON.Vector3(0,0,0)
                        this.positioningIndicator.rotate(axis, angle)

                    }
                }
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP && this.positioningIndicator.isEnabled()){
                    // teleporting_camera.teleport(pointerInfo);
                }
            })
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                    () => { this.positioningIndicator.setEnabled(false)}))

        })
    }

    positionArtwork = (artworkToPosition) => {
        this.currentArtwork = artworkToPosition
        let faceUV = []
        for (let i = 0; i < 6; i++) {
            if (i === 0 ){
                faceUV[i] = new BABYLON.Vector4(1, 1, 0, 0);
            }
            else if(i===1){
                faceUV[i] = new BABYLON.Vector4(0,0,1,1)
            }
            else{
                faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
            }
        }
        const options = {
            width: this.currentArtwork.width / 100,
            height: this.currentArtwork.height / 100,
            depth: 0.1,
            faceUV:faceUV
        };

        this.positioningIndicator = BABYLON.MeshBuilder.CreateBox('box', options, this.scene);

        const mat = new BABYLON.StandardMaterial("mat", this.scene);
        console.log(this.currentArtwork.image_id)
        mat.diffuseTexture = new BABYLON.Texture(`${process.env.VUE_APP_BACKEND_URL}/api/image/${this.currentArtwork.image_id}`, this.scene);
        // mat.diffuseTexture = new BABYLON.Texture(`textures/fire.png`, this.scene);

        mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
        mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

        this.positioningIndicator.material = mat;
    }

}
export {Walls}