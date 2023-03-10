import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()
gui.width = 400

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const lightsFolder = gui.addFolder('Lights')

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // Color, Intensity (Simulate light bouncing)
// scene.add(ambientLight)
// const ambientLightFolder = lightsFolder.addFolder('ambientLight')
// ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// ambientLightFolder.addColor(ambientLight, 'color')

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3) // simulate the sun
// directionalLight.position.set(0.5, 0.25, 0)
// scene.add(directionalLight)
// const directionalLightFolder = lightsFolder.addFolder('directionalLight')
// directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
// directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.01)
// directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.01)
// directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.01)

// // Works like ambient light
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3) // Color(skyColor), groundColor, intensity
// scene.add(hemisphereLight)

// const pointLight = new THREE.PointLight(0xff9000, 0.5) // Color, intensity, distance, decay
// pointLight.position.set(0, 5, 0)
// scene.add(pointLight)

// // Only works with MeshStanderdMaterial and MeshPhysicalMaterial
// const rectArea = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1) // Color, intensity, width, height
// rectArea.position.set(- 1.5, 0, 1.5)
// rectArea.lookAt(new THREE.Vector3())
// scene.add(rectArea)

// // Helpers - Lights helpers can help you position the ligths, function well with gui
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1) // light, width
// scene.add(directionalLightHelper)

// const rectAreaLightHelper = new RectAreaLightHelper(rectArea)
// scene.add(rectAreaLightHelper) // Needs manual updating of the position and quaternion

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const ambientLightFolder = lightsFolder.addFolder('ambientLight')
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
ambientLightFolder.addColor(ambientLight, 'color')

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(1, 3, 2)
scene.add(directionalLight)
const directionalLightFolder = lightsFolder.addFolder('directionalLight')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.01)
directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.01)
directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.01)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.far = 7

// const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightShadowHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5
sphere.castShadow = true

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
torus.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update lights
    // rectAreaLightHelper.position.copy(rectArea.position)
    // rectAreaLightHelper.quaternion.copy(rectArea.quaternion)
    // rectAreaLightHelper.update()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()