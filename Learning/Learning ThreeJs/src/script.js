import * as THREE from 'three'
import classes from './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import BasicCharacterController from './controls'
import ThirdPersonCamera from './camera'

let renderer, scene, camera, orbControls, previousRAF, controls, thirdPersonCamera
let mixers = []

const main = () => {
    Ammo().then(lib => {
        Ammo = lib
        initializeWorld()
        initializeGround()
        //initializeOrbitControls()
        //loadStaticModel('./models/car/car.gltf', 15)
        //loadAnimatedModel('./models/xbot/', 'xbot.fbx', 0.1, 'walking.fbx')
        //loadAnimatedModelWithControls()
        loadAnimatedModelWithControlsAndThirdPersonCamera()
        RAF() //request animation frame --updates
    })
}

const initializeWorld = () => {
    //initializing the renderer
    const canvas = document.querySelector('canvas.webgl')
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas})
    renderer.shadowMap.enabled = true //enabling shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap //type of shadow enabled
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight)

    //initializing the camera
    const fov = 75
    const aspect = window.innerWidth / window.innerHeight
    const near = 1.0
    const far = 1000.0
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(25, 100, 25)

    //adding eventListner on resizing to matain the aspect ratio
    window.addEventListener('resize', () => {
        onWindowResize()
    }, false)

    //initializing the scene
    scene = new THREE.Scene()

    //adding lighting to the scene
    const ambientLight = new THREE.AmbientLight(0x101010, 0.5)
    scene.add(ambientLight)

    const hemisphereLight = new THREE.HemisphereLight(0x101010, 0x444444, 1.5)
    hemisphereLight.position.set(75, 100, 0)
    scene.add(hemisphereLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(20, 100, 10)
    directionalLight.target.position.set(0, 0, 0)
    directionalLight.castShadow = true
    directionalLight.shadow.bias = -0.001
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 500.0
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 500.0
    directionalLight.shadow.camera.left = 100
    directionalLight.shadow.camera.right = -100
    directionalLight.shadow.camera.top = 100
    directionalLight.shadow.camera.bottom = -100
    scene.add(directionalLight)

    /*
    //adding helper to one light
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 10)
    hemisphereLight.position.set( 0, 10, 0 )
    let cameraHelper = new THREE.HemisphereLightHelper(hemisphereLight, 2)
    hemisphereLight.add(cameraHelper)
    scene.add(hemisphereLight)
    */
    
    //loading texture and adding it to the background
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
        './background/posx.bmp',
        './background/negx.bmp',
        './background/posy.bmp',
        './background/negy.bmp',
        './background/posz.bmp',
        './background/negz.bmp'
    ])
    texture.encoding = THREE.sRGBEncoding;
    scene.background = texture
}

const initializeOrbitControls = () => {
    orbControls = new OrbitControls(camera, renderer.domElement)
    orbControls.target.set(0, 20, 0)
    orbControls.update()
}

const initializeGround = () => {
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({color: 0xFFFFFF})
    )
    ground.castShadow = false
    ground.receiveShadow = true
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
}

const loadStaticModel = (modelPath, scale) => {
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(modelPath, gltf => {
        gltf.scene.traverse(c => {
            c.receiveShadow = true
            c.castShadow = true
            if (c.isMesh) {
                if (c.material.map) c.material.map.anisotropy = 16
            }
        })
        gltf.scene.scale.setScalar(scale)
        scene.add(gltf.scene)
    })
}   

const loadAnimatedModel = (modelPath, model, scale, animation) => {
    //initializing the loader
    const fbxLoader = new FBXLoader()
    fbxLoader.setPath(modelPath)

    //loading the model
    fbxLoader.load(model, fbx => {
        fbx.traverse(c => {
            c.castShadow = true
            c.receiveShadow = true
            if (c.isMesh) {
                if (c.material.map) c.material.map.anisotropy = 16
            }
        })
        fbx.scale.setScalar(scale);
        fbx.position.y = 1

        //loading the animation
        fbxLoader.load(animation, anim => {
            const mixer = new THREE.AnimationMixer(fbx)
            mixers.push(mixer)
            const idle = mixer.clipAction(anim.animations[0])
            idle.play()
        })
        scene.add(fbx)
    })

}

const loadAnimatedModelWithControls = () => {
    const params = {
        camera: camera,
        scene: scene
    }
    controls = new BasicCharacterController(params)
}

const loadAnimatedModelWithControlsAndThirdPersonCamera = () => {
    const params = {
        camera: camera,
        scene: scene
    }
    controls = new BasicCharacterController(params)

    thirdPersonCamera = new ThirdPersonCamera({
        camera: camera,
        target: controls
    })
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

    const step = timeElapsed => {

        const timeElapsedSeconds = timeElapsed / 1000

        if (mixers) mixers.map(m => m.update(timeElapsedSeconds))
    
        if (controls) controls.Update(timeElapsedSeconds)

        thirdPersonCamera.Update(timeElapsedSeconds)

    }
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('DOMContentLoaded', () => main())