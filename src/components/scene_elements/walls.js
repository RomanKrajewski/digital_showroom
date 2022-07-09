import * as BABYLON from "babylonjs";
import {SCALING_FACTOR} from "@/constants";
import {getRotationBetweenVectors} from "@/utils";
import axios from "axios";
import ArtworkInfo from "../ArtworkInfo";
class Walls{
    positioningIndicator
    currentArtwork = null
    scene
    loadedArtworks = []
    parentComponent
    constructor(scene, parentComponent) {
        this.parentComponent = parentComponent
        this.scene = scene
        this.positioningIndicator = BABYLON.MeshBuilder.CreateBox("positioningIndicator", {width: 0.5, height: 0.25, depth:0.1}, scene);
        this.positioningIndicator.setEnabled(false);
//kommentar
        const positioningIndicator_material = new BABYLON.StandardMaterial("positioningIndicator_material", scene)
        positioningIndicator_material.alpha = 0.3
        positioningIndicator_material.material = positioningIndicator_material

        const hemi1 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), scene);
        hemi1.intensity = 1;
        hemi1.groundColor = new BABYLON.Color3(1,1,1);
        hemi1.specular = BABYLON.Color3.Black();



        scene.meshes.filter(mesh => mesh.name.includes("Wand") || mesh.name.includes("Raum")).forEach(mesh => {
            mesh.actionManager = new BABYLON.ActionManager(scene)
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                     () => {if (this.currentArtwork) this.positioningIndicator.setEnabled(true)}))
            scene.onPointerObservable.add((pointerInfo) => {
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                    if(pointerInfo.pickInfo.pickedPoint){
                        this.positioningIndicator.position = pointerInfo.pickInfo.pickedPoint;
                        const v1 = pointerInfo.pickInfo.getNormal(true)
                        const v2 = new BABYLON.Vector3(0,0,-1)
                        const axisAngle = getRotationBetweenVectors(v1, v2)

                        this.positioningIndicator.rotation = new BABYLON.Vector3(0,0,0)
                        this.positioningIndicator.rotate(axisAngle[0], axisAngle[1])

                    }
                }
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP && this.positioningIndicator.isEnabled()){
                    const rotation_vector = this.positioningIndicator.rotationQuaternion
                    let newOrientationQuaternion = {
                        x: rotation_vector.x,
                        y: rotation_vector.y,
                        z: rotation_vector.z,
                        w: rotation_vector.w
                    }
                    let newPositionVector = {
                        x: this.positioningIndicator.position.x,
                        y: this.positioningIndicator.position.y,
                        z: this.positioningIndicator.position.z,
                    }
                    if(JSON.stringify(newOrientationQuaternion) !== JSON.stringify(this.currentArtwork.orientation_quaternion) || JSON.stringify(newPositionVector) !== JSON.stringify(this.currentArtwork.position_vector)){
                        this.currentArtwork.orientation_quaternion = newOrientationQuaternion
                        this.currentArtwork.position_vector = newPositionVector
                        axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.currentArtwork.id}`, this.currentArtwork).then(
                            () => {
                                this.positioningIndicator.setEnabled(false)
                                this.updateArtwork(this.currentArtwork)
                                this.currentArtwork = null
                                this.positioningIndicator.dispose()
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

    loadArtworks = async (filter_by_ids) => {
        this.loadedArtworks.filter((artwork => filter_by_ids.includes(artwork.artwork.id))).forEach(artwork => {
            artwork.mesh.getChildren().forEach(child => child.dispose())
            artwork.mesh.dispose()
        })
        const artworkMeshes = []
        const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/positioned`)
        let artworks = JSON.parse(response.data.artwork)
        if (filter_by_ids){
            artworks = artworks.filter((artwork_id) => filter_by_ids.includes(artwork_id))
        }
        const artworkList = artworks.map((artwork_id) => {return {id:artwork_id}})
        for await (const artworkDetails of artworkList.map(artwork => ArtworkInfo.methods.fetchArtworkInfo(artwork))){
            if(!artworkDetails.position_vector||!artworkDetails.orientation_quaternion){
                continue
            }
            const artworkMesh = this.createArtworkMesh(artworkDetails)

            artworkMesh.position = new BABYLON.Vector3(artworkDetails.position_vector.x, artworkDetails.position_vector.y, artworkDetails.position_vector.z)
            // artworkMesh.rotation = new BABYLON.Vector3(artworkDetails.orientation_vector.x, artworkDetails.orientation_vector.y, artworkDetails.orientation_vector.z)
            artworkMesh.rotationQuaternion = new BABYLON.Quaternion(artworkDetails.orientation_quaternion.x, artworkDetails.orientation_quaternion.y, artworkDetails.orientation_quaternion.z, artworkDetails.orientation_quaternion.w)
            artworkMesh.actionManager = new BABYLON.ActionManager(this.scene)
            artworkMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                    () => {
                    this.scene.hoverCursor = 'pointer'
                    this.parentComponent.artworkHoverEnter(artworkDetails);
                    }))
            artworkMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                    () => {
                        this.scene.hoverCursor = 'default'
                        this.parentComponent.artworkHoverEnter(null);
                    })
            )
            artworkMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPickTrigger},
                    () => {
                        this.parentComponent.cameraTargetArtwork(artworkDetails)
                        this.parentComponent.artworkFocused(artworkDetails)
                    })
            )
            artworkMeshes.push({mesh: artworkMesh, artwork: artworkDetails} )
        }
        this.loadedArtworks = artworkMeshes
    }

    updateArtwork = (artwork) => {
        this.loadArtworks([artwork.id])
    }

    positionArtwork = (artworkToPosition) => {
        this.positioningIndicator.dispose()
        this.currentArtwork = artworkToPosition
        this.positioningIndicator = this.createArtworkMesh(artworkToPosition)
        this.positioningIndicator.setEnabled(false)
    }

    createArtworkMesh = (artwork) => {
        let faceUV = []
        for (let i = 0; i < 6; i++) {
            if (i === 0 ){
                faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
            }
            else if(i===1){
                faceUV[i] = new BABYLON.Vector4(0,0,1,1)
            }
            else{
                faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
            }
        }
        const meshWidth = SCALING_FACTOR * artwork.width / 100;
        const meshHeight =SCALING_FACTOR * artwork.height / 100;
        const options = {
            width:  meshWidth,
            height: meshHeight,
            depth: 0.06,
            faceUV:faceUV
        };

        let artworkMesh = BABYLON.MeshBuilder.CreateBox('box', options, this.scene);

        const mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseTexture = new BABYLON.Texture(artwork.image_url, this.scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
        mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        artworkMesh.material = mat;

        const artworkShadow = BABYLON.MeshBuilder.CreatePlane('meshShadow', {width: meshWidth * 1.07, height: meshHeight*1.07})
        // artworkShadow.position.x += 0.05
        // artworkShadow.position.y -=0.05
        artworkShadow.position.z -=0.001
        artworkShadow.setParent(artworkMesh)
        const black = new BABYLON.Color3(0,0,0)
        const shadowMat = new BABYLON.StandardMaterial('shadowMat', this.scene);
        shadowMat.diffuseColor = black
        shadowMat.specularColor = black;
        shadowMat.emissiveColor = black;
        shadowMat.ambientColor = black;
        shadowMat.opacityTexture = new BABYLON.Texture(`${process.env.VUE_APP_BACKEND_URL}/static/shadow.png`, this.scene),
        artworkShadow.material = shadowMat
        if (artwork.sold){
            const red_dot = this.createRedDot()
            red_dot.position = new BABYLON.Vector3(artworkMesh.position.x + (artwork.width/2 + 5) * SCALING_FACTOR / 100, artworkMesh.position.y - (artwork.height /2 - 2.5) * SCALING_FACTOR /100, artworkMesh.position.z )
            red_dot.setParent(artworkMesh)
        }
        return artworkMesh
    }

    createRedDot = () => {
        const red_dot = BABYLON.MeshBuilder.CreateCylinder("red_dot", {diameter: 0.02 * SCALING_FACTOR, height: 0.02 *SCALING_FACTOR}, this.scene);
        red_dot.rotate(new BABYLON.Vector3(1,0,0), BABYLON.Angle.FromDegrees(90).radians())
        const red = new BABYLON.Color3(0.6, 0.1, 0.1);
        const red_dot_material = new BABYLON.StandardMaterial("red_dot_material", this.scene)
        red_dot_material.emissiveColor = red;
        red_dot_material.diffuseColor = red;
        red_dot_material.specularColor = red;
        red_dot_material.emissiveColor = red;
        red_dot_material.ambientColor = red;
        red_dot_material.alpha = 1
        red_dot.material = red_dot_material

        return red_dot
    }
}
export {Walls}