import * as BABYLON from "babylonjs";

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function getRotationBetweenVectors(v1, v2){
    const yAxis = new BABYLON.Vector3(0,-1,0)
    const xAxis = new BABYLON.Vector3(-1,0,0)
    const dot = BABYLON.Vector3.Dot(v1, v2)
    let axis = BABYLON.Vector3.Cross(v1,v2)
    let angle = Math.acos(dot);
    // console.log(dot)
    if(dot < -0.999){
        angle = BABYLON.Angle.FromDegrees(180).radians()
        axis = BABYLON.Vector3.Cross(v1, xAxis)
        if (axis.length() < 0.001){
            axis = BABYLON.Vector3.Cross(v1, yAxis)
        }
        // console.log(axis)
    }else{
        axis = axis.multiplyByFloats(-1, -1, -1)
    }
    return [axis, angle]
}