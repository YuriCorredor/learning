import * as THREE from 'three'
import classes from './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let renderer, scene, camera, orbControls, previousRAF, controls
let mixers = []

const main = () => {
    initializeWorld()
    initializeGround()
    initializeOrbitControls()
    //loadStaticModel('./models/car/car.gltf', 15)
    //loadAnimatedModel('./models/xbot/', 'xbot.fbx', 0.1, 'walking.fbx')
    loadAnimatedModelWithControls()
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
    const fov = 75
    const aspect = window.innerWidth / window.innerHeight
    const near = 1.0
    const far = 1000.0
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 20, 85)

    //adding eventListner on resizing to matain the aspect ratio
    window.addEventListener('resize', () => {
        onWindowResize()
    }, false)

    //initializing the scene
    scene = new THREE.Scene()

    //adding lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
    scene.add(ambientLight)

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
    hemisphereLight.position.set( 75, 300, 0 )
    scene.add(hemisphereLight)


    //adding helper to one light
    /*
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 10)
    hemisphereLight.position.set( 0, 10, 0 )
    let cameraHelper = new THREE.HemisphereLightHelper(hemisphereLight, 2)
    hemisphereLight.add(cameraHelper)
    scene.add(hemisphereLight)
    */

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(75, 300, 0)
    scene.add(directionalLight)
    
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
        new THREE.BoxBufferGeometry(100, 100, 1),
        new THREE.MeshStandardMaterial({ color: 121111 })
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

class BasicCharacterController {
    constructor(params) {
        this._Init(params)
    }

    _Init(params) {

        this._params = params
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0)
        this._velocity = new THREE.Vector3(0, 0, 0)

        this._animations = {}
        this._input = new BasicCharacterControllerInput()
        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations)
        )

        this._LoadModels()
    }

    _LoadModels() {
        const loader = new FBXLoader()
        loader.setPath('./models/xbot/')
        loader.load('xbot.fbx', (fbx) => {
            fbx.scale.setScalar(0.1)
            fbx.traverse(c => {
                c.castShadow = true
                c.receiveShadow = true
                if (c.isMesh) {
                    if (c.material.map) c.material.map.anisotropy = 16
                }
            })
            this._target = fbx
            this._params.scene.add(this._target)
            this._mixer = new THREE.AnimationMixer(this._target)
            this._manager = new THREE.LoadingManager()
            this._manager.onLoad = () => {
                this._stateMachine.SetState('idle')
            }

            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0]
                const action = this._mixer.clipAction(clip)
        
                this._animations[animName] = {
                    clip: clip,
                    action: action,
                }
            }
            const loader = new FBXLoader(this._manager)
            loader.setPath('./models/xbot/')
            loader.load('walk.fbx', (a) => _OnLoad('walk', a))
            loader.load('run.fbx', (a) => _OnLoad('run', a))
            loader.load('idle.fbx', (a) => _OnLoad('idle', a))
            loader.load('dance.fbx', (a) => _OnLoad('dance', a))
        })
    }

    Update(timeInSeconds) {
        if (!this._target || !this._stateMachine._currentState) {
            return;
          }
          this._stateMachine.Update(timeInSeconds, this._input);
          const velocity = this._velocity;
          const frameDecceleration = new THREE.Vector3(
              velocity.x * this._decceleration.x,
              velocity.y * this._decceleration.y,
              velocity.z * this._decceleration.z
          );
          frameDecceleration.multiplyScalar(timeInSeconds);
          frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
              Math.abs(frameDecceleration.z), Math.abs(velocity.z));
      
          velocity.add(frameDecceleration);
      
          const controlObject = this._target;
          const _Q = new THREE.Quaternion();
          const _A = new THREE.Vector3();
          const _R = controlObject.quaternion.clone();
      
          const acc = this._acceleration.clone();
          if (this._input._keys.shift) {
            acc.multiplyScalar(2.0);
          }
      
          if (this._stateMachine._currentState.Name == 'dance') {
            acc.multiplyScalar(0.0);
          }
      
          if (this._input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
          }
          if (this._input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
          }
          if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
          }
          if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
          }
      
          controlObject.quaternion.copy(_R);
      
          const oldPosition = new THREE.Vector3();
          oldPosition.copy(controlObject.position);
      
          const forward = new THREE.Vector3(0, 0, 1);
          forward.applyQuaternion(controlObject.quaternion);
          forward.normalize();
      
          const sideways = new THREE.Vector3(1, 0, 0);
          sideways.applyQuaternion(controlObject.quaternion);
          sideways.normalize();
      
          sideways.multiplyScalar(velocity.x * timeInSeconds);
          forward.multiplyScalar(velocity.z * timeInSeconds);
      
          controlObject.position.add(forward);
          controlObject.position.add(sideways);
      
          oldPosition.copy(controlObject.position);
      
          if (this._mixer) {
            this._mixer.update(timeInSeconds);
          }
    }
}

//An proxy to CharacterFSM
class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations
    }
    
    get animations() {
        return this._animations
    }
}

//A normal FiniteStateMachine. Can be used in many projects.
class FiniteStateMachine {
    constructor() {
        this._states = {}
        this._currentState = null
    }

    _AddState(name, type) {
        this._states[name] = type;
    }

    SetState(name) {
        const prevState = this._currentState;

        if (prevState) {
            if (prevState.Name == name) return
            prevState.Exit()
        }

        const state = new this._states[name](this)
        this._currentState = state
        state.Enter(prevState)
    }

    Update(timeElapsed, input) {
        if (this._currentState) this._currentState.Update(timeElapsed, input)
    }
}

//An extension of the FinateStateMachine personalized for our needs(adding the states with AddState)
class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
        super()
        this._proxy = proxy
        this._Init()
    }

    _Init() {
        //adding states related to character. Each state is a class
        this._AddState('idle', IdleState)
        this._AddState('walk', WalkState)
        this._AddState('run', RunState)
        this._AddState('dance', DanceState)
    }
}

class BasicCharacterControllerInput {
    constructor() {
        this._Init()
    }

    _Init() {
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false
        }

        document.addEventListener('keydown', event => this._onKeyDown(event), false)
        document.addEventListener('keyup', event => this._onKeyUp(event), false)
    }

    _onKeyDown(event) {
        switch(event.code) {
            case 'KeyW': this._keys.forward = true
            break
            case 'KeyA': this._keys.left = true
            break
            case 'KeyD': this._keys.right = true
            break
            case 'KeyS': this._keys.backward = true
            break
            case 'Space': this._keys.space = true
            break
            case 'ShiftLeft': this._keys.shift = true
            break
        }
    
    }

    _onKeyUp(event) {
        switch(event.code) {
            case 'KeyW': this._keys.forward = false
            break
            case 'KeyA': this._keys.left = false
            break
            case 'KeyD': this._keys.right = false
            break
            case 'KeyS': this._keys.backward = false
            break
            case 'Space': this._keys.space = false
            break
            case 'ShiftLeft': this._keys.shift = false
            break
        }
    }
}

//A Class to represent the State, with functions to enter, exit and update the STATES(animations)
class State {
    constructor(parent) {
        this._parent = parent
    }

    Enter() {}
    Exit() {}
    Update() {}
}

class IdleState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'idle'
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['idle'].action
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action
            idleAction.time = 0.0
            idleAction.enabled = true
            idleAction.setEffectiveTimeScale(1.0)
            idleAction.setEffectiveWeight(1.0)
            idleAction.crossFadeFrom(prevAction, 0.5, true)
            idleAction.play()
        } else {
            idleAction.play()
        }
    }

    Update(_, input) {
        if (input._keys.forward || input._keys.backward) this._parent.SetState('walk')
        else if (input._keys.space) this._parent.SetState('dance')
    }
}

class WalkState extends State {
    constructor(parent) {
        super(parent)
    }
  
    get Name() {
        return 'walk'
    }
  
    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk'].action
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action
            curAction.enabled = true
            if (prevState.Name == 'run') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration
                curAction.time = prevAction.time * ratio
            } else {
                curAction.time = 0.0
                curAction.setEffectiveTimeScale(1.0)
                curAction.setEffectiveWeight(1.0)
            }
            curAction.crossFadeFrom(prevAction, 0.5, true)
            curAction.play()
        } else {
            curAction.play()
        }
    }
  
    Update(_, input) {
        if (input._keys.forward || input._keys.backward) {
            if (input._keys.shift) {
                this._parent.SetState('run')
            }
            return
        }
        this._parent.SetState('idle')
    }
}

class RunState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'run'
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['run'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action
            curAction.enabled = true
            if (prevState.Name == 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration
                curAction.time = prevAction.time * ratio
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0)
                curAction.setEffectiveWeight(1.0)
            }
            curAction.crossFadeFrom(prevAction, 0.5, true)
            curAction.play()
        } else {
            curAction.play()
        }
    }

    Update(_, input) {
        if (input._keys.forward || input._keys.backward) {
            if (!input._keys.shift) {
                this._parent.SetState('walk')
            }
            return
        }
        this._parent.SetState('idle')
    }
}

class DanceState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'dance'
    }

    Enter(prevState) {
        const finishedCallback = () => {
            this._Cleanup()
            this._parent.SetState('idle')
        }
        const curAction = this._parent._proxy._animations['dance'].action
        const mixer = curAction.getMixer()
        mixer.addEventListener('finished', finishedCallback)

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action
            curAction.reset()
            curAction.setLoop(THREE.LoopOnce, 1)
            curAction.clampWhenFinished = true
            curAction.crossFadeFrom(prevAction, 0.2, true)
            curAction.play()
        } else {
            curAction.play()
        }
    }

    Exit() {
        this._Cleanup()
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['dance'].action
        action.getMixer().removeEventListener('finished')
    }
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
        if (mixers) {
            mixers.map(m => m.update(timeElapsedSeconds))
        }
    
        if (controls) {
            controls.Update(timeElapsedSeconds)
        }
    }
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('DOMContentLoaded', () => main())