import * as THREE from 'three'
import classes from './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import BasicCharacterController from './controls'
import ThirdPersonCamera from './camera'

let renderer, scene, camera, orbControls, controls, thirdPersonCamera, physicsWorld, tmpTransform
let previousRAF = null
let mixers = []
let rigidBodies = []

export class RigidBody {

    constructor() {}

    setRestitution(val) {
        this.body_.setRestitution(val);
    }
  
    setFriction(val) {
        this.body_.setFriction(val);
    }
  
    setRollingFriction(val) {
        this.body_.setRollingFriction(val);
    }
  
    createBox(mass, pos, quat, size) {
        this.transform_ = new Ammo.btTransform()
        this.transform_.setIdentity()
        this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
        this.transform_.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
        this.motionState_ = new Ammo.btDefaultMotionState(this.transform_)
    
        const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5)
        this.shape_ = new Ammo.btBoxShape(btSize)
        this.shape_.setMargin(0.05)
    
        this.inertia_ = new Ammo.btVector3(0, 0, 0)
        if (mass > 0) {
            this.shape_.calculateLocalInertia(mass, this.inertia_)
        }
    
        this.info_ = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState_, this.shape_, this.inertia_)
        this.body_ = new Ammo.btRigidBody(this.info_)
    
        Ammo.destroy(btSize)
    }

    createCylinder(mass, pos, quat, radius, height) {
        this.transform_ = new Ammo.btTransform()
        this.transform_.setIdentity()
        this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
        this.transform_.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
        this.motionState_ = new Ammo.btDefaultMotionState(this.transform_)

        const btSize = new Ammo.btVector3(radius, height * 0.5, radius)
        this.shape_ = new Ammo.btCylinderShape(btSize)
        this.shape_.setMargin(0.05)
    
        this.inertia_ = new Ammo.btVector3(0, 0, 0)
        if (mass > 0) {
            this.shape_.calculateLocalInertia(mass, this.inertia_)
        }
    
        this.info_ = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState_, this.shape_, this.inertia_)
        this.body_ = new Ammo.btRigidBody(this.info_)
    
        Ammo.destroy(btSize)
    }
}

const main = () => {
    Ammo().then(lib => {
        Ammo = lib
        initializePhysics()
        initializeWorld()
        //initializeGround()
        initializeGroundWithPhysics()
        //initializeBoxWithPhysics()
        initializeCylinderWithPhysics()
        //initializeOrbitControls()
        //loadStaticModel('./models/car/car.gltf', 15)
        //loadAnimatedModel('./models/xbot/', 'xbot.fbx', 0.1, 'walking.fbx')
        //loadAnimatedModelWithControls()
        //loadAnimatedModelWithControlsAndThirdPersonCamera()
        loadAnimatedModelWithControlsAndThirdPersonCameraAndPhysics()
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
    const ambientLight = new THREE.AmbientLight(0x101010, 0.8)
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

const initializePhysics = () => {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
    const broadphase = new Ammo.btDbvtBroadphase()
    const solver = new Ammo.btSequentialImpulseConstraintSolver()
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration)
    physicsWorld.setGravity(new Ammo.btVector3(0, -100, 0))

    tmpTransform = new Ammo.btTransform()
}

const initializeGroundWithPhysics = () => {
    const ground = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshStandardMaterial({color: 0x404040}))
    ground.castShadow = false
    ground.receiveShadow = true
    scene.add(ground)

    const rbGround = new RigidBody()
    rbGround.createBox(0, ground.position, ground.quaternion, new THREE.Vector3(100, 1, 100))
    rbGround.setRestitution(0.99)
    physicsWorld.addRigidBody(rbGround.body_)
}

const initializeBoxWithPhysics = () => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({color: 0x808080}))
    box.position.set(0, 40, 0)
    box.castShadow = true
    box.receiveShadow = true
    scene.add(box)

    const rbBox = new RigidBody()
    rbBox.createBox(1, box.position, box.quaternion, new THREE.Vector3(4, 4, 4))
    rbBox.setRestitution(0.25)
    rbBox.setFriction(1)
    rbBox.setRollingFriction(5)
    physicsWorld.addRigidBody(rbBox.body_)

    rigidBodies.push({ mesh: box, rigidBody: rbBox })
}

const initializeCylinderWithPhysics = () => {
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 10, 64), new THREE.MeshBasicMaterial({color: 0xffff00}))
    cylinder.position.set(25, 30, 20)
    cylinder.castShadow = true
    cylinder.receiveShadow = true
    scene.add(cylinder)

    const rbCylinder = new RigidBody()
    rbCylinder.createCylinder(1, cylinder.position, cylinder.quaternion, 10, 10 )
    rbCylinder.setRestitution(0.25)
    rbCylinder.setFriction(1)
    rbCylinder.setRollingFriction(5)
    physicsWorld.addRigidBody(rbCylinder.body_)

    rigidBodies.push({ mesh: cylinder, rigidBody: rbCylinder })
}

const initializeOrbitControls = () => {
    orbControls = new OrbitControls(camera, renderer.domElement)
    orbControls.target.set(0, 0, 0)
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

const loadAnimatedModelWithControlsAndThirdPersonCameraAndPhysics = () => {
    const params = {
        camera: camera,
        scene: scene,
        physicsWorld,
        rigidBodies
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

        step(t - previousRAF)
        renderer.render(scene, camera)
        RAF()
        previousRAF = t
    })

    const step = timeElapsed => {

        const timeElapsedSeconds = timeElapsed / 1000

        if (mixers) mixers.map(m => m.update(timeElapsedSeconds))
    
        if (controls) controls.Update(timeElapsedSeconds)

        if (thirdPersonCamera) thirdPersonCamera.Update(timeElapsedSeconds)

        if (physicsWorld) physicsWorld.stepSimulation(timeElapsedSeconds, 10)

        for (let i = 0; i < rigidBodies.length; i++) {
            rigidBodies[i].rigidBody.motionState_.getWorldTransform(tmpTransform)
            const pos = tmpTransform.getOrigin()
            const quat = tmpTransform.getRotation()
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z())
            const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w())
            rigidBodies[i].mesh.position.copy(pos3)
            rigidBodies[i].mesh.quaternion.copy(quat3)
        }

    }
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('DOMContentLoaded', () => main())