import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// Texture
const loadingManager = new THREE.LoadingManager()

// Now we can manage the loadings
// loadingManager.onStart = () => {
//     console.log("started loading")
// }
// loadingManager.onLoad = () => {
//     console.log("ended loading")
// }
// loadingManager.onProgress = () => {
//     console.log("loading")
// }
// loadingManager.onError = e => {
//     console.log({error: e})
// }

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load("/minecraft.png")
// const alphaTexture = textureLoader.load("/door/alpha.jpg")
// const heightTexture = textureLoader.load("/door/height.jpg")
// const normalTexture = textureLoader.load("/door/normal.jpg")
// const ambientOcclusionTexture = textureLoader.load("/door/ambientOcclusion.jpg")
// const metalnessTexture = textureLoader.load("/door/metalness.jpg")
// const roughnessTexture = textureLoader.load("/door/roughness.jpg")

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 8
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter // used when the pixels of texture are smaller than the pixels of render
colorTexture.magFilter = THREE.NearestFilter // used when the pixels of texture are bigger than the pixels of render

// Debug
const gui = new dat.GUI({ closed: true, width: 400 })
gui.hide() // PRESS "H" for it to appear

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object

const parameters = {
    color: 0xffffff,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
        gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI })
        gsap.to(mesh.rotation, { duration: 1, z: mesh.rotation.z + Math.PI / 2 })
    }
}

const box = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)
const material = new THREE.MeshBasicMaterial({ 
    //color: parameters.color,
    map: colorTexture,

})
const mesh = new THREE.Mesh(box, material)
scene.add(mesh)

// Debug
//gui.add(mesh.position, 'y', -3, 3, 0.01) // OBJECT, PROPERTY, MIN, MAX, STEP(PRECISION)
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name("CUBE y")
gui.add(mesh, "visible").name("CUBE visible")
gui.add(material, "wireframe").name("CUBE wireframe")
gui.addColor(parameters, "color").name("CUBE color").onChange(() => {
    material.color.set(parameters.color)
})
gui.add(parameters, "spin")

// // Geometry
// const geometry = new THREE.Geometry()

// const vertex1 = new THREE.Vector3(0, 0, 0)
// geometry.vertices.push(vertex1)
// const vertex2 = new THREE.Vector3(0, 1, 0)
// geometry.vertices.push(vertex2)
// const vertex3 = new THREE.Vector3(1, 0, 0)
// geometry.vertices.push(vertex3)

// const face = new THREE.Face3(0, 1, 2)
// geometry.faces.push(face)

// const material1 = new THREE.MeshBasicMaterial({ 
//     color: 0x00ff00,
//     wireframe: true
// })
// const mesh1 = new THREE.Mesh(geometry, material1)

// scene.add(mesh1)

// const randomGeometry = new THREE.Geometry()

// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 3; j++) {
//         randomGeometry.vertices.push(new THREE.Vector3(
//             (Math.random() - 0.5) * 8,
//             (Math.random() - 0.5) * 8,
//             (Math.random() - 0.5) * 8
//         ))
//     }

//     const verticesIndex = i * 3
//     randomGeometry.faces.push(new THREE.Face3(
//         verticesIndex,
//         verticesIndex + 1,
//         verticesIndex + 2
//     ))

// }

// const material2 = new THREE.MeshBasicMaterial({ 
//     color: 0x00ff00,
//     wireframe: true
// })
// const mesh2 = new THREE.Mesh(randomGeometry, material2)

// scene.add(mesh2)


// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
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