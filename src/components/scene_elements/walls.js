import {SCALING_FACTOR} from "@/constants";
import {getRotationBetweenVectors} from "@/utils";
import axios from "axios";
import ArtworkInfo from "../ArtworkInfo";
export const ROOM_MESH_NAME = 'Raum_primitive0'

import {Color3} from "@babylonjs/core/Maths/math.color"
import {PointerEventTypes} from "@babylonjs/core/Events/pointerEvents"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial"
import {Vector3, Vector4, Quaternion} from "@babylonjs/core/Maths/math.vector"
import {Angle} from "@babylonjs/core/Maths/math"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight"
import {ActionManager} from "@babylonjs/core/Actions/actionManager"
import {ExecuteCodeAction} from "@babylonjs/core/Actions/directActions"
import {VideoTexture} from "@babylonjs/core/Materials/Textures/videoTexture"
import {Texture} from "@babylonjs/core/Materials/Textures/texture"



import "@babylonjs/core/Meshes/Builders/boxBuilder";

class Walls{
    positioningIndicator
    currentArtwork = null
    scene
    loadedArtworks = []
    parentComponent
    wasLastOverWall=false
    constructor(scene, parentComponent) {
        this.parentComponent = parentComponent
        this.scene = scene
        this.positioningIndicator = MeshBuilder.CreateBox("positioningIndicator", {
            width: 0.5,
            height: 0.25,
            depth: 0.1
        }, scene);
        this.positioningIndicator.setEnabled(false);
        this.scene.getMeshByName(ROOM_MESH_NAME).isPickable = true

        const positioningIndicator_material = new StandardMaterial("positioningIndicator_material", scene)
        positioningIndicator_material.alpha = 0.3
        positioningIndicator_material.material = positioningIndicator_material

        const hemi1 = new HemisphericLight("HemiLight", new Vector3(0, -1, 0), scene);
        hemi1.intensity = 1;
        hemi1.groundColor = new Color3(1, 1, 1);
        hemi1.specular = Color3.Black();

        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                if (this.positioningIndicator.isEnabled()) {
                    this.positioningIndicator.position = pointerInfo.pickInfo.pickedPoint;
                    const v1 = pointerInfo.pickInfo.getNormal(true)
                    const v2 = new Vector3(0, 0, -1)
                    const axisAngle = getRotationBetweenVectors(v1, v2)

                    this.positioningIndicator.rotation = new Vector3(0, 0, 0)
                    this.positioningIndicator.rotate(axisAngle[0], axisAngle[1])
                }

            }
            if (pointerInfo.type === PointerEventTypes.POINTERTAP && this.positioningIndicator.isEnabled()) {
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
                if (JSON.stringify(newOrientationQuaternion) !== JSON.stringify(this.currentArtwork.orientation_quaternion) || JSON.stringify(newPositionVector) !== JSON.stringify(this.currentArtwork.position_vector)) {
                    this.currentArtwork.orientation_quaternion = newOrientationQuaternion
                    this.currentArtwork.position_vector = newPositionVector
                    axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/artwork/${this.currentArtwork.id}`, this.currentArtwork).then(
                        () => {
                            this.positioningIndicator.setEnabled(false)
                            this.updateArtwork(this.currentArtwork)
                            this.currentArtwork = null
                            this.positioningIndicator.dispose()
                            this.parentComponent.initPositioningArtwork(null)
                        }
                    )
                }
            }
        })

        let mesh = scene.getMeshByName(ROOM_MESH_NAME)
        mesh.actionManager = new ActionManager(scene)

        mesh.actionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOverTrigger},
                () => {
                    this.wasLastOverWall = true
                    if (this.currentArtwork) {
                        scene.hoverCursor = 'none'
                        this.positioningIndicator.setEnabled(true)
                    }
                }))

        mesh.actionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOutTrigger},
                () => {
                    this.wasLastOverWall = false
                    this.positioningIndicator.setEnabled(false)
                    scene.hoverCursor = 'default'
            }))

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

            artworkMesh.position = new Vector3(artworkDetails.position_vector.x, artworkDetails.position_vector.y, artworkDetails.position_vector.z)

            artworkMesh.rotationQuaternion = new Quaternion(artworkDetails.orientation_quaternion.x, artworkDetails.orientation_quaternion.y, artworkDetails.orientation_quaternion.z, artworkDetails.orientation_quaternion.w)

            artworkMesh.actionManager = new ActionManager(this.scene);
            if (artworkMesh.videoTexture){
                artworkMesh.actionManager.registerAction(new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger}, () => {
                    if(artworkMesh.videoTexture.video.paused){
                        artworkMesh.videoTexture.video.play()
                    }else{
                        artworkMesh.videoTexture.video.muted = !artworkMesh.videoTexture.video.muted
                    }
                }))
            }

            artworkMesh.actionManager.registerAction(
                new ExecuteCodeAction({trigger: ActionManager.OnPointerOverTrigger},
                    () => {
                    this.scene.hoverCursor = 'pointer'
                    this.parentComponent.hoveringArtwork = artworkDetails;
                    }))
            artworkMesh.actionManager.registerAction(
                new ExecuteCodeAction({trigger: ActionManager.OnPointerOutTrigger},
                    () => {
                        this.scene.hoverCursor = 'default'
                        this.parentComponent.hoveringArtwork = null;
                    })
            )
            artworkMesh.actionManager.registerAction(
                new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger},
                    () => {
                        this.parentComponent.cameraTargetArtwork(artworkDetails)
                        this.parentComponent.focusedArtwork = artworkDetails
                    })
            )
            artworkMeshes.push({mesh: artworkMesh, artwork: artworkDetails} )
        }
        this.loadedArtworks = this.loadedArtworks.concat(artworkMeshes)
    }

    updateArtwork = (artwork) => {
        this.loadArtworks([artwork.id])
    }

    positionArtwork = (artworkToPosition) =>  {
        this.positioningIndicator.dispose()
        this.currentArtwork = artworkToPosition
        this.positioningIndicator = this.createArtworkMesh(artworkToPosition)

        this.positioningIndicator.position.x = 1000
        this.positioningIndicator.position.y = 1000
        this.positioningIndicator.setEnabled(this.wasLastOverWall)
        this.scene.hoverCursor = this.wasLastOverWall?'none':'default';

    }

    createArtworkMesh = (artwork) => {
        let faceUV = []
        for (let i = 0; i < 6; i++) {
            if (i === 0 ){
                faceUV[i] = new Vector4(0, 0, 0, 0);
            }
            else if(i===1){
                faceUV[i] = new Vector4(0,0,1,1)
            }
            else{
                faceUV[i] = new Vector4(0, 0, 0, 0);
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

        let artworkMesh = MeshBuilder.CreateBox('box', options, this.scene);
        const mat = new StandardMaterial("mat", this.scene);
        if(artwork.image_url.endsWith(".mp4")){
            const videoTexture = new VideoTexture("video", artwork.image_url, this.scene, false, false, Texture.NEAREST_NEAREST)
            videoTexture.onLoadObservable.add(()=> {this.parentComponent.loading = false})
            mat.diffuseTexture = videoTexture
            artworkMesh.videoTexture = videoTexture
        }else{
            mat.diffuseTexture = new Texture(artwork.image_url + "?cacheblock=true", this.scene, false, true, Texture.CUBIC_MODE,()=> {this.parentComponent.loading = false});
        }
        mat.diffuseColor = new Color3(1, 0, 1);
        mat.specularColor = new Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new Color3(1, 1, 1);
        mat.ambientColor = new Color3(0.23, 0.98, 0.53);
        artworkMesh.material = mat;

        const artworkShadow = MeshBuilder.CreatePlane('meshShadow', {width: meshWidth * 1.1, height: meshHeight*1.1})
        // artworkShadow.position.x += 0.05
        // artworkShadow.position.y -=0.05
        artworkShadow.position.z -=0.001
        artworkShadow.setParent(artworkMesh)
        const black = new Color3(0,0,0)
        const shadowMat = new StandardMaterial('shadowMat', this.scene);
        shadowMat.diffuseColor = black
        shadowMat.specularColor = black;
        shadowMat.emissiveColor = black;
        shadowMat.ambientColor = black;
        if (artwork.width < 99 || artwork.height < 99){
            shadowMat.opacityTexture = new Texture(`${process.env.VUE_APP_BACKEND_URL}/static/shadow_small.png`, this.scene)
        }else{
            shadowMat.opacityTexture = new Texture(`${process.env.VUE_APP_BACKEND_URL}/static/shadow.png`, this.scene)
        }
        artworkShadow.material = shadowMat
        if (artwork.sold){
            const red_dot = this.createRedDot()
            red_dot.position = new Vector3(artworkMesh.position.x + (artwork.width/2 + 5) * SCALING_FACTOR / 100, artworkMesh.position.y - (artwork.height /2 - 2.5) * SCALING_FACTOR /100, artworkMesh.position.z )
            red_dot.setParent(artworkMesh)
        }
        return artworkMesh
    }

    createRedDot = () => {
        const red_dot = MeshBuilder.CreateCylinder("red_dot", {diameter: 0.02 * SCALING_FACTOR, height: 0.02 *SCALING_FACTOR}, this.scene);
        red_dot.rotate(new Vector3(1,0,0), Angle.FromDegrees(90).radians())
        const red = new Color3(0.6, 0.1, 0.1);
        const red_dot_material = new StandardMaterial("red_dot_material", this.scene)
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