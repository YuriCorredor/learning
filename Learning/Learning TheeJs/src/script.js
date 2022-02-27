    import * as THREE from 'three'
    import classes from './style.css'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

    let renderer, scene, camera, controls, previousRAF
    let mixers = []

    const main = () => {
        initializeWorld()
        initializeGround()
        initializeOrbitControls()
        //loadStaticModel('./models/car/car.gltf', 15)
        loadAnimatedModel('./models/xbot/', 'xbot.fbx', 0.5, 'dancing.fbx')
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
        scene.background = texture
    }

    const initializeOrbitControls = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 20, 0)
        controls.update()
    }

    const initializeGround = () => {
        const ground = new THREE.Mesh(
            new THREE.BoxBufferGeometry(100, 100, 1),
            new THREE.MeshStandardMaterial()
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
            fbx.position.y = 4 

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