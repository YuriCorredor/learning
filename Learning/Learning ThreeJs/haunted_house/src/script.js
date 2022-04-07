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

// FOG
const fog = new THREE.Fog('#262837', 1, 15) // Color, near, far
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')

grassColorTexture.repeat.set(16, 16)
grassNormalTexture.repeat.set(16, 16)
grassRoughnessTexture.repeat.set(16, 16)
grassAmbientOcclusionTexture.repeat.set(16, 16)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughness: grassRoughnessTexture
    })
)
const floorWidth = floor.geometry.parameters.width
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
) // For AmbientOcclusinTexture to function
scene.add(floor)

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.75, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughness: bricksRoughnessTexture
    })
)
walls.castShadow = true
walls.receiveShadow = true
const wallsHeight = walls.geometry.parameters.height
const wallsDepth = walls.geometry.parameters.depth
const wallsWidth = walls.geometry.parameters.width
walls.position.y = wallsHeight / 2
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
) // For AmbientOcclusinTexture to function
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.castShadow = true
roof.receiveShadow = true
const roofHeight = roof.geometry.parameters.height
roof.rotation.y = Math.PI / 4
roof.position.y = wallsHeight + (roofHeight / 2)
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2, 100, 100), // More vertices to displacementMap to work
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
const doorHeight = door.geometry.parameters.height
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
) // For AmbientOcclusinTexture to function
door.position.z = (wallsDepth / 2) - 0.025
door.position.y = (doorHeight - 0.2 ) / 2 
house.add(door)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })


const addShapesInZone = (geometry, material, texture, radiusInnerLimit, radiusOuterLimit, quantity) => {
    if (texture) material.matcap = texture
    for (let i = 0; i <= quantity; i++) {
        const shape = new THREE.Mesh(geometry, material)
        shape.castShadow = true
        shape.receiveShadow = true
        const angle = Math.random() * Math.PI * 2
        const radius = radiusInnerLimit + 0.5 + (Math.random() * (radiusOuterLimit - radiusInnerLimit - 0.5))
        const x = Math.sin(angle) * radius
        const y = Math.cos(angle) * radius
        
        shape.position.set(x, 0.4, y)
        shape.rotation.y = (Math.random() - 0.5) * 0.4
        shape.rotation.z = (Math.random() - 0.5) * 0.4

        graves.add(shape)
    }
}

const houseRadius = Math.sqrt(wallsWidth ** 2 + wallsDepth ** 2) / 2
const floorRadius = floorWidth / 2
addShapesInZone(graveGeometry, graveMaterial, undefined, houseRadius, floorRadius, 200)

/**
 * Lights
 */
const lightsFolder = gui.addFolder('lights')
// Ambient light
const ambientLight = new THREE.AmbientLight('#b2b6b1', 0.2)
const ambientLightFolder = lightsFolder.addFolder('AmbientLight')
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b2b6b1', 0.2)
moonLight.position.set(4, 5, - 2)
const moonLightFolder = lightsFolder.addFolder('DirectionalLight')
moonLightFolder.add(moonLight, 'intensity').min(0).max(1).step(0.001)
moonLightFolder.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
moonLightFolder.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
moonLightFolder.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


// Ghosts
const ghost = new THREE.PointLight(0xff1122, 2, 3)
scene.add(ghost)
const ghost1 = new THREE.PointLight(0x1122ff, 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight(0x11ff22, 2, 3)
scene.add(ghost2)



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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837')

// Shadows
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Ghost
    const ghostAngle = elapsedTime * 0.5
    ghost.position.x = Math.cos(ghostAngle) * 4
    ghost.position.z = Math.sin(ghostAngle) * 4
    ghost.position.y = Math.sin(elapsedTime * 4)
    const ghost1Angle = elapsedTime * 0.22
    ghost1.position.x = Math.cos(ghost1Angle) * 5.5
    ghost1.position.z = Math.sin(ghost1Angle) * 5.5
    ghost1.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    const ghost2Angle = - elapsedTime * 0.18
    ghost2.position.x = Math.cos(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost2.position.z = Math.cos(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 3.2)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()