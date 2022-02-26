class BasicWorldDemo {
    constructor() {
        this._Initialize()
    }

    _Initialize() {

        const canvas = document.querySelector('canvas.webgl')
        this._threejs = new THREE.WebGLRenderer({ antialias: true, canvas: canvas})
        this._threejs.shadowMap.enabled = true
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight)

        window.addEventListener('resize', () => {
            this._OnWindowResize()
        }, false)

        const fov = 75
        const aspect = 1920 / 1080
        const near = 1.0
        const far = 1000.0
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this._camera.position.set(90, 20, 0)


        this._scene = new THREE.Scene()

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
        light.position.set(20, 100, 10)
        light.target.position.set(0, 0, 0)
        light.castShadow = true
        light.shadow.bias = -0.001
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
        light.shadow.camera.near = 0.1
        light.shadow.camera.far = 500.0
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 500.0
        light.shadow.camera.left = 100
        light.shadow.camera.right = -100
        light.shadow.camera.top = 100
        light.shadow.camera.bottom = -100

        this._scene.add(light)

        light = new THREE.AmbientLight(0x101010)
        this._scene.add(light)

        const controls = new OrbitControls(this._camera, this._threejs.domElement);
        controls.target.set(0, 20, 0);
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            '../static/posx.bmp',
            '../static/negx.bmp',
            '../static/posy.bmp',
            '../static/negy.bmp',
            '../static/posz.bmp',
            '../static/negz.bmp'
        ]);
        this._scene.background = texture;

        this._RAF();
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight
        this._camera.updateProjectionMatrix()
        this._threejs.setSize(window.innerWidth, window.innerHeight)
    }

    _RAF() {
        requestAnimationFrame(() => {
            this._threejs.render(this._scene, this._camera)
            this._RAF()
        });
    }

}

window.addEventListener('DOMContentLoaded', () => {
    _APP = new BasicWorldDemo();
});