import * as BABYLON from "babylonjs";
import {SCALING_FACTOR} from "@/components/scene_elements/constants";
import axios from "axios";
import ArtworkList from "@/components/ArtworkList";
import ArtworkInfo from "@/components/ArtworkInfo";
class Walls{
    positioningIndicator
    currentArtwork = null
    scene
    loadedArtworks = []
    parentComponent
    constructor(scene, parentComponent) {
        this.parentComponent = parentComponent
        this.scene = scene
        this.positioningIndicator = BABYLON.MeshBuilder.CreateBox("positioningIndicator", {width: 0.5, height: 0.25, depth:0.2}, scene);
        this.positioningIndicator.setEnabled(false);

        const positioningIndicator_material = new BABYLON.StandardMaterial("positioningIndicator_material", scene)
        positioningIndicator_material.alpha = 0.3
        positioningIndicator_material.material = positioningIndicator_material

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
                    const rotation_vector = this.positioningIndicator.rotationQuaternion.toEulerAngles()
                    let newOrientationVector = {
                        x: rotation_vector.x,
                        y: rotation_vector.y,
                        z: rotation_vector.z,
                    }
                    let newPositionVector = {
                        x: this.positioningIndicator.position.x,
                        y: this.positioningIndicator.position.y,
                        z: this.positioningIndicator.position.z,
                    }
                    if(JSON.stringify(newOrientationVector) !== JSON.stringify(this.currentArtwork.orientation_vector) || JSON.stringify(newPositionVector) !== JSON.stringify(this.currentArtwork.position_vector)){
                        this.currentArtwork.orientation_vector = newOrientationVector
                        this.currentArtwork.position_vector = newPositionVector
                        axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.currentArtwork.id}`, this.currentArtwork).then(
                            () => {
                                this.positioningIndicator.setEnabled(false)
                                this.currentArtwork = null
                                this.positioningIndicator.dispose()
                                this.loadArtworks()
                                this.parentComponent.artworkPositioned()
                            }
                        )
                    }
                }
            })
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                    () => { this.positioningIndicator.setEnabled(false)}))

        })
    }

    loadArtworks = async () => {
        this.loadedArtworks.forEach(mesh => mesh.dispose())
        const artworkMeshes = []
        const artworkList = await ArtworkList.methods.getArtworkArray()
            for await (const artworkDetails of artworkList.map(artwork => ArtworkInfo.methods.fetchArtworkInfo(artwork))){
                const artworkMesh = this.createArtworkMesh(artworkDetails)
                artworkMesh.position = new BABYLON.Vector3(artworkDetails.position_vector.x, artworkDetails.position_vector.y, artworkDetails.position_vector.z)
                artworkMesh.rotation = new BABYLON.Vector3(artworkDetails.orientation_vector.x, artworkDetails.orientation_vector.y, artworkDetails.orientation_vector.z)
                artworkMeshes.push(artworkMesh)
            }
        this.loadedArtworks = artworkMeshes
    }


    positionArtwork = (artworkToPosition) => {
        this.positioningIndicator.dispose()
        this.currentArtwork = artworkToPosition
        this.positioningIndicator = this.createArtworkMesh(artworkToPosition)
    }

    createArtworkMesh = (artwork) => {
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
            width: SCALING_FACTOR * artwork.width / 100 ,
            height: SCALING_FACTOR * artwork.height / 100,
            depth: 0.1,
            faceUV:faceUV
        };

        let artworkMesh = BABYLON.MeshBuilder.CreateBox('box', options, this.scene);

        const mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseTexture = new BABYLON.Texture(`${process.env.VUE_APP_BACKEND_URL}/api/image/${artwork.image_id}`, this.scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
        mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        artworkMesh.material = mat;
        return artworkMesh
    }

}
export {Walls}