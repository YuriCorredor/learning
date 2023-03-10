import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Base
 */
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let mixer, model

const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/test/scene.gltf', gltf => {
    model = gltf.scene
    gltf.scene.traverse(c => {
        c.frustumCulled = false
    })
    gltf.scene.scale.setScalar(0.3)

    gltf.scene.position.y = 0.8

    gui.add(gltf.scene.rotation, 'x').min(0).max(10)
    gui.add(gltf.scene.rotation, 'y').min(0).max(10)
    gui.add(gltf.scene.rotation, 'z').min(0).max(10)

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])

    action.timeScale = 1/25

    action.play()

    scene.add(gltf.scene)
})

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/texture.png')

const loadShapes = (geometry, material, quantity, width, texture) => {
    material.matcap = texture
    for (let i = 0; i < quantity; i++) {
        const shape = new THREE.Mesh(geometry, material)

        shape.position.set(
            (Math.random() - 0.5) * width,
            (Math.random() - 0.5) * width,
            (Math.random() - 0.5) * width
        )

        shape.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0
        )

        const scale = Math.random()
        shape.scale.set(scale, scale, scale)

        scene.add(shape)
    }
}

const starsGeometry = new THREE.OctahedronBufferGeometry(0.1, 0)
const starsMaterial = new THREE.MeshMatcapMaterial()

loadShapes(starsGeometry, starsMaterial, 1000, 100, matcapTexture)


/**
 * Lights
 */

const lightsFolder = gui.addFolder('Lights')

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
const dirLigthGui = lightsFolder.addFolder('Directional Light')
dirLigthGui.add(directionalLight, 'intensity').min(0).max(10).step(0.001)
dirLigthGui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001)
dirLigthGui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001)
dirLigthGui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001)
directionalLight.position.set(10, -5, 7)

scene.add(directionalLight)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.set(0, 0, 0)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const moveCamera = () => {
    const t = window.pageYOffset
    camera.position.y = -(t * 0.004)
    if (t >= 700) {
        model.position.z = (t-700) / 75
    } else {
        model.position.z = 0
    }
}

document.addEventListener('scroll', moveCamera)

const updateModel = (model, t) => {
    model.rotation.y += t / 25
}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    if (mixer) mixer.update(deltaTime * 10)
    if (model) updateModel(model, deltaTime * 10)

    camera.lookAt(new THREE.Vector3(0, 1.5, 0))

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()