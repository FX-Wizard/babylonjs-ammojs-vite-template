import * as BABYLON from '@babylonjs/core'
import ammo from 'ammo.js'


window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas')
    const engine = new BABYLON.Engine(canvas, true)
    const scene = new Scene(engine, canvas)

    engine.runRenderLoop(() => {
        scene.render()
    })

    window.addEventListener('resize', () => {
        engine.resize()
    })
})


class Scene extends BABYLON.Scene {
    constructor(engine, canvas) {
        super(engine)
        this.scene = this
        this.canvas = canvas

        // add camera
        let camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene)
        camera.setTarget(BABYLON.Vector3.Zero())
        camera.attachControl(canvas, true)

        let light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene)
        light.intensity = 0.7

        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 1, segments: 32}, this.scene)
        sphere.position.y = 5
        
        let ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 6, height: 6}, this.scene)
        
        // set up physics
        this.setupPhysics().then(_ => {
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1}, this.scene)
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, this.scene)
        })
    }

    async setupPhysics() {
        // set up physics
        const gravity = new BABYLON.Vector3(0, -9.81, 0)
        const Ammo = await ammo.bind(window)()
        const physicsPlugin = new BABYLON.AmmoJSPlugin(undefined, Ammo)
        this.scene.enablePhysics(gravity, physicsPlugin)
    }
}