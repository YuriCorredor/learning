// scene
const scene = new THREE.Scene()

// Red Box
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// camera
const fov = 60
const sizes = {
    width: 800,
    height: 600
}
// Sizes are used for the aspect ratio of the screen and to size the renderer
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height)
camera.position.z = 3 // in THREE.js Y is "up", X is "right" and the Z is "toward us"
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

