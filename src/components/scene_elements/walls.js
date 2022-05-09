import * as BABYLON from "babylonjs";
import {SCALING_FACTOR} from "@/constants";
import axios from "axios";
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
        this.positioningIndicator = BABYLON.MeshBuilder.CreateBox("positioningIndicator", {width: 0.5, height: 0.25, depth:0.1}, scene);
        this.positioningIndicator.setEnabled(false);
//kommentar
        const positioningIndicator_material = new BABYLON.StandardMaterial("positioningIndicator_material", scene)
        positioningIndicator_material.alpha = 0.3
        positioningIndicator_material.material = positioningIndicator_material
        // let debugLineMesh = BABYLON.MeshBuilder.CreateLines("debug_line", {points: [new BABYLON.Vector3(0,0,0), new BABYLON.Vector3(0,0,0)]}, scene)
        scene.meshes.filter(mesh => mesh.name.includes("Wand") || mesh.name.includes("ROOM")).forEach(mesh => {
            if (mesh.name.includes("Wand")){
                mesh.flipFaces(true)
            }
            mesh.actionManager = new BABYLON.ActionManager(scene)
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                     () => {if (this.currentArtwork) this.positioningIndicator.setEnabled(true)}))
            scene.onPointerObservable.add((pointerInfo) => {
                if(pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                    if(pointerInfo.pickInfo.pickedPoint){
                        this.positioningIndicator.position = pointerInfo.pickInfo.pickedPoint;
                        const v1 = pointerInfo.pickInfo.getNormal(true)
                        // debugLineMesh.dispose()
                        // debugLineMesh = BABYLON.MeshBuilder.CreateLines("debug_line", {points: [pointerInfo.pickInfo.pickedPoint, pointerInfo.pickInfo.pickedPoint.add(v1)]}, scene)
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
            if(!artworkDetails.position_vector||!artworkDetails.orientation_vector){
                continue
            }
            const artworkMesh = this.createArtworkMesh(artworkDetails)

            artworkMesh.position = new BABYLON.Vector3(artworkDetails.position_vector.x, artworkDetails.position_vector.y, artworkDetails.position_vector.z)
            artworkMesh.rotation = new BABYLON.Vector3(artworkDetails.orientation_vector.x, artworkDetails.orientation_vector.y, artworkDetails.orientation_vector.z)
            artworkMesh.actionManager = new BABYLON.ActionManager(this.scene)
            artworkMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                    () => this.parentComponent.artworkHoverEnter(artworkDetails)))
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

        const move_indicator_material = new BABYLON.StandardMaterial("move_indicator_material", this.scene)
        move_indicator_material.emissiveColor = new BABYLON.Color3(0.8, 0.2, 0.2);
        move_indicator_material.alpha = 1
        red_dot.material = move_indicator_material

        return red_dot
    }
}
export {Walls}