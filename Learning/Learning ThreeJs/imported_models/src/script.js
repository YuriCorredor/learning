import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debug = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Update All materials
const updateAllMaterials = (scene) => {
    scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = debug.envMapIntensity
            child.material.needsUpdate = true
        }
    })
}

debug.envMapIntensity = 5
gui.add(debug, 'envMapIntensity').min(0).max(15).step(0.01).onChange(() => {
    updateAllMaterials(scene)
})

// Loader

let mixer

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/3/px.jpg',
    '/3/nx.jpg',
    '/3/py.jpg',
    '/3/ny.jpg',
    '/3/pz.jpg',
    '/3/nz.jpg',
])

scene.background = environmentMap
scene.environment = environmentMap

const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/phi/scene.gltf', gltf => {
    gltf.scene.traverse(c => {
        c.castShadow = true
        c.receiveShadow = true
    })
    gltf.scene.scale.setScalar(0.5)

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])

    action.play()

    scene.add(gltf.scene)

    updateAllMaterials(scene)
})

/**
 * Lights
 */

const lightsFolder = gui.addFolder('Lights')

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
const dirLigthGui = lightsFolder.addFolder('Directional Light')
dirLigthGui.add(directionalLight, 'castShadow')
dirLigthGui.add(directionalLight, 'intensity').min(0).max(10).step(0.001)
dirLigthGui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001)
dirLigthGui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001)
dirLigthGui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001)
directionalLight.castShadow = true
directionalLight.shadow.normalBias = 0.05
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 4
directionalLight.shadow.camera.left = - 2
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 1
directionalLight.position.set(2, 2, 2)


const dirLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)

scene.add(directionalLight, dirLightHelper)

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
camera.position.set(2, 3, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
gui.add(renderer, 'toneMapping', {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials(scene)
})
renderer.toneMappingExposure = 1
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    
    // Update Mixer
    if (mixer) mixer.update(deltaTime * 5)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()