import * as THREE from 'three'
import classes from './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let renderer, scene, camera, mixers, controls, previousRAF

const main = () => {
    initializeWorld()
    initializeOrbitControls()
    initializeGround()
    RAF() //request animation frame --updates
}

const initializeWorld = () => {
    //initializing the renderer
    const canvas = document.querySelector('canvas.webgl')
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas})
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight)

    //initializing the camera
    const fov = 60
    const aspect = window.innerWidth / window.innerHeight
    const near = 1.0
    const far = 1000.0
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(90, 20, 0)

    window.addEventListener('resize', () => {
        onWindowResize()
    }, false)

    //initializing the scene
    scene = new THREE.Scene()

    //adding lighting to the scene
    let hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x444444 )
    hemisphereLight.position.set( 0, 300, 0 )
    scene.add( hemisphereLight )

    let directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.position.set( 75, 300, -75 )
    scene.add( directionalLight )

    //loading texture and adding it to the background
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
        'posx.bmp',
        'negx.bmp',
        'posy.bmp',
        'negy.bmp',
        'posz.bmp',
        'negz.bmp'
    ])
    scene.background = texture
}

const initializeOrbitControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 20, 0)
    controls.update()
}

const initializeGround = () => {
    const ground = new THREE.Mesh(
        new THREE.BoxBufferGeometry(100, 100, 10),
        new THREE.MeshStandardMaterial()
    )
    ground.castShadow = false
    ground.receiveShadow = true
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
}

const RAF = () => {
    requestAnimationFrame(t => {
        if (previousRAF === null) {
            previousRAF = t
        }

        renderer.render(scene, camera)
        step(t - previousRAF)
        previousRAF = t
  
        RAF()
    })
}

const step = timeElapsed => {
    const timeElapsedSeconds = timeElapsed / 1000
    if (mixers) {
        mixers.map(m => m.update(timeElapsedSeconds))
    }

    if (controls) {
        controls.update(timeElapsedSeconds)
    }
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('DOMContentLoaded', () => main())