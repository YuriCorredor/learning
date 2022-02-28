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
        loadAnimatedModel('./models/xbot/', 'xbot.fbx', 0.1, 'walking.fbx')
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
        controls = initializeCharacterController(
            params,
            './models/xbot/',
            'xbot.fbx',
            ['dancing.fbx', 'running.fbx', 'walking.fbx']
        )
    }

    const initializeCharacterController = (params, modelPath, model, animationsNames) => {

        let decceleration, acceleration, velocity, animations, input, stateMachine, target, mixer, manager

        decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
        acceleration = new THREE.Vector3(1, 0.25, 50.0)
        velocity = new THREE.Vector3(0, 0, 0)

        animations = {}
        input = basicCharacterControllerInput()
        stateMachine = BasicCharacterControllerProxy(animations)

        //loading models
        const loader = new FBXLoader()
        loader.setPath(modelPath)
        loader.load(model, fbx => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true
                c.receiveShadow = true
                if (c.isMesh) {
                    if (c.material.map) c.material.map.anisotropy = 16
                }
            })

            target = fbx
            params.scene.add(target)

            mixer = new THREE.AnimationMixer(target)

            manager = new THREE.LoadingManager()
            manager.onLoad = () => {
                stateMachine.SetState('idle')
            }

            const onLoad = (animationName, anim) => {
                const clip = anim.animations[0]
                const action = mixer.clipAction(clip)
          
                animations[animationName] = {
                    clip: clip,
                    action: action,
                }
            }

            const loader = new FBXLoader(manager);
            loader.setPath(modelPath)
            animationsNames.forEach(animationName => {
                loader.load(animationName, anim => onLoad(animationName, anim))
            })

        })
        
    }

    const basicCharacterControllerInput = () => {
        let keys

        keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false
        }

        document.addEventListener('keydown', event => {
            if (event.code === 'KeyW') keys.forward = true
            if (event.code === 'KeyA') keys.left = true
            if (event.code === 'KeyD') keys.right = true
            if (event.code === 'KeyS') keys.backward = true
            if (event.code === 'Space') keys.space = true
            if (event.code === 'ShiftLeft') keys.shift = true
        }, false)

        document.addEventListener('keyup', event => {
            if (event.code === 'KeyW') keys.forward = false
            if (event.code === 'KeyA') keys.left = false
            if (event.code === 'KeyD') keys.right = false
            if (event.code === 'KeyS') keys.backward = false
            if (event.code === 'Space') keys.space = false
            if (event.code === 'ShiftLeft') keys.shift = false
        }, false)
    }

    const BasicCharacterControllerProxy = () => {

    }

    const RAF = () => {
        requestAnimationFrame(t => {
            if (previousRAF === null) {
                previousRAF = t
            }

            renderer.render(scene, camera)

            RAF()

            step(t - previousRAF)
            previousRAF = t
        })

        const step = timeElapsed => {
            const timeElapsedSeconds = timeElapsed / 1000
            if (mixers) {
                mixers.map(m => m.update(timeElapsedSeconds))
            }
        
            if (controls) {
                controls.update(timeElapsedSeconds)
            }
        }
    }

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('DOMContentLoaded', () => main())