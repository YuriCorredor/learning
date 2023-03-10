import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const donutTexture = textureLoader.load('/textures/matcaps/6.png')

// Fonts
const fontLoader = new THREE.FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
    const textGeometry = new THREE.TextBufferGeometry('Yuri Developer', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelSize: 0.02,
        bevelThickness: 0.03,
        bevelOffset: 0,
        bevelSegments: 5
    })
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02) / 2,
    //     - (textGeometry.boundingBox.max.y - 0.02) / 2,
    //     - (textGeometry.boundingBox.max.z - 0.03) / 2
    // )
    textGeometry.center()
    const textMaterial = new THREE.MeshMatcapMaterial()
    textMaterial.matcap = matcapTexture
    textMaterial.wireframe = false
    gui.add(textMaterial, 'wireframe')
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)
})

// Load shapes
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
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial()

loadShapes(starsGeometry, starsMaterial, 1000, 100, matcapTexture)
loadShapes(donutGeometry, donutMaterial, 100, 10, donutTexture)

/**
 * Object
 */

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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()