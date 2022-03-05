import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RigidBody } from './script'

export default class BasicCharacterController {
    constructor(params) {
        this._Init(params)
    }

    _Init(params) {

        this._params = params
        this._physicsWorld = params.physicsWorld
        this._rigidBodies = params.rigidBodies
        this._tmpTransform = params.tmpTransform
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
        this._acceleration = new THREE.Vector3(1.5, 0.5, 85.0)
        this._velocity = new THREE.Vector3(0, 0, 0)
        this._position = new THREE.Vector3();

        this._animations = {}
        this._input = new BasicCharacterControllerInput()
        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations)
        )

        this._LoadModels()
    }

    _GetFbxSize() {
        //size's x, y, z are width, height, depth.
        let box3 = new THREE.Box3().setFromObject(this._target)
        let fbxSize = new THREE.Vector3()
        return box3.getSize(fbxSize)
    }

    _LoadModels() {
        const loader = new FBXLoader()
        loader.setPath('./models/xbot/')
        loader.load('xbot.fbx', (fbx) => {
            fbx.name = 'xbot'
            fbx.scale.setScalar(0.1)
            fbx.position.set(0, 20, 0)
            fbx.traverse(c => {
                c.castShadow = true
                c.receiveShadow = true
                if (c.isMesh) {
                    if (c.material.map) c.material.map.anisotropy = 16
                }
            })
            this._target = fbx
            this._fbxSize = this._GetFbxSize()
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

            const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 10, 64), new THREE.MeshBasicMaterial({color: 0xffff00}))
            cylinder.position.set(this._target.position.x, this._target.position.y, this._target.position.z)
            cylinder.castShadow = true
            cylinder.name = 'xbot'
            cylinder.receiveShadow = true
            this._params.scene.add(cylinder)
            
            console.log(cylinder)

            const rbCylinder = new RigidBody()
            rbCylinder.createCylinder(1, cylinder.position, cylinder.quaternion, 4, 10)
            rbCylinder.setRestitution(0)
            rbCylinder.setFriction(3)
            rbCylinder.setRollingFriction(6)
            this._physicsWorld.addRigidBody(rbCylinder.body_)

            this._rigidBodies.push({ mesh: cylinder, rigidBody: rbCylinder })

            const loader = new FBXLoader(this._manager)
            loader.setPath('./models/xbot/')
            loader.load('walk.fbx', (a) => _OnLoad('walk', a))
            loader.load('run.fbx', (a) => _OnLoad('run', a))
            loader.load('idle.fbx', (a) => _OnLoad('idle', a))
            loader.load('dance.fbx', (a) => _OnLoad('dance', a))
            loader.load('walk-backwards.fbx', (a) => _OnLoad('walk-backwards', a))
        })
    }

    get Position() {
        return this._position;
    }
    
    get Rotation() {
        if (!this._target) {
            return new THREE.Quaternion();
        }
        return this._target.quaternion;
    }

    _updateControls(body, timeInSeconds) {

        if (!this._target || !this._stateMachine._currentState) {
            return
        }
        
        let resultantImpulse = new Ammo.btVector3()

        this._stateMachine.Update(timeInSeconds, this._input)

        let scalingFactor = 20

        if (this._stateMachine._currentState.Name == 'dance') {

        }

        if (this._input._keys.forward) {
            console.log(`frente`)
            resultantImpulse.setValue(0, 0, 1)
            resultantImpulse.op_mul(scalingFactor)
            body.body_.setLinearVelocity(resultantImpulse)
        }
    
        if (this._input._keys.forward && !this._input._keys.backward) {
            
        }
        if (this._input._keys.backward && !this._input._keys.forward) {
           
        }
        if (this._input._keys.backward && this._input._keys.forward) {
            
        }
        if (this._input._keys.left && !(this._stateMachine._currentState.Name == 'idle')) {
            if (!(this._stateMachine._currentState.Name == 'dance')) {
                if (!this._input._keys.forward)
                if (this._input._keys.shift && !this._input._keys.backward)
                if (this._input._keys.backward) {}
            }
        }
        if (this._input._keys.right && !(this._stateMachine._currentState.Name == 'idle')) {
            if (!(this._stateMachine._currentState.Name == 'dance')) {
                if (!this._input._keys.forward)
                if (this._input._keys.shift && !this._input._keys.backward)
                if (this._input._keys.backward) {}
            }
        }
    
        if (this._mixer) {
            this._mixer.update(timeInSeconds)
        }
    }

    Update(timeInSeconds) {
        for (let i = 0; i < this._rigidBodies.length; i++) {
            this._rigidBodies[i].rigidBody.motionState_.getWorldTransform(this._tmpTransform)
            const pos = this._tmpTransform.getOrigin()
            const quat = this._tmpTransform.getRotation()
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z())
            const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w())
            this._rigidBodies[i].mesh.position.copy(pos3)
            if (!(this._rigidBodies[i].mesh.name === 'xbot')) this._rigidBodies[i].mesh.quaternion.copy(quat3)
            if (this._rigidBodies[i].mesh.name === 'xbot') this._updateControls(this._rigidBodies[i].rigidBody, timeInSeconds)
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
        this._AddState('walk-backwards', WalkBackwardsState)
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
        if (input._keys.forward || input._keys.right || input._keys.left) this._parent.SetState('walk')
        else if (input._keys.backward) this._parent.SetState('walk-backwards')
        else if (input._keys.space) this._parent.SetState('dance')
    }
}

class WalkBackwardsState extends State {
    constructor(parent) {
        super(parent)
    }
  
    get Name() {
        return 'walk-backwards'
    }
  
    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk-backwards'].action
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action
            curAction.enabled = true
            if (prevState.Name == 'run' || prevState.Name == 'walk') {
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
        if (input._keys.backward) {
            return
        }
        this._parent.SetState('idle')
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
            if (prevState.Name == 'run' || prevState.Name == 'walk-backwards') {
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
        if (input._keys.forward || input._keys.right || input._keys.left) {
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
            if (prevState.Name == 'walk' || prevState.Name == 'walk-backwards') {
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
        if (input._keys.forward || input._keys.right || input._keys.left) {
            if (!input._keys.shift) {
                this._parent.SetState('walk')
            }
            return
        }
        if (input._keys.backward) {
            this._parent.SetState('walk-backwards')
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