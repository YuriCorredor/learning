import './style.css'
import * as THREE from "three"
import gsap from 'gsap'

// scene
const scene = new THREE.Scene()

// Red Box
const geometry = new THREE.BoxGeometry(1, 1, 1) // width, height, depth
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Position
/*
mesh.position.x = 2
mesh.position.y = 1
mesh.position.z = - 2
*/
mesh.position.set(5 , 5, -5)
console.log(mesh.position.length()) // distance between the center of the scene and the object

// Scale
/*
mesh.scale.x = 0.5
mesh.scale.y = 1
mesh.scale.z = 0.5
*/
mesh.scale.set(0.5, 1, 0.5)

// Rotation
/*
This number is measured in radians, thus 2 PI is a full rotation
Math.PI can be used as a helper and it is half the rotation length
*/
mesh.rotation.reorder("YXZ")
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25


// Axes helper
const axesHelper = new THREE.AxesHelper(/* length of the stroke */)
scene.add(axesHelper)

// Group
const group = new THREE.Group()
scene.add(group)
group.position.set(12, -5, -10)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = 1.5
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = -1.5
group.add(cube1)
group.add(cube2)
group.add(cube3)

// camera
const fov = 60
const sizes = {
    width: 800,
    height: 600
}
// Sizes are used for the aspect ratio of the screen and to size the renderer
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height)
camera.position.z = 10 // In THREE.js Y is "up", X is "right" and the Z is "toward us" but this is arbitrary
scene.add(camera)
//camera.lookAt(mesh.position)


console.log(mesh.position.distanceTo(camera.position)) // distance between two objects

// renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Clock
//const clock = new THREE.Clock()
gsap.to(mesh.position, ({ duration: 1, delay: 1, x: 0 }))
gsap.to(mesh.position, ({ duration: 1, delay: 2, x: 5 }))
gsap.to(mesh.position, ({ duration: 1, delay: 3, x: 0 }))

// Animation
const RAF = () => {
    // Clock
    //const elapsedTime = clock.getElapsedTime()

    // Updates objects
    //mesh.rotation.x += 0.05
    //mesh.rotation.z += 0.05
    //mesh.rotation.y += 0.05
    //group.rotation.x += 0.05

    // Renderer
    renderer.render(scene, camera)

    window.requestAnimationFrame(RAF)
}

RAF()