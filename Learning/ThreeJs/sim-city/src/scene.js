import * as THREE from 'three'
import { createCamera } from './camera.js'
import { createAsset } from './assets.js'

export function createScene() {
  const gameWindow = document.getElementById('render-target')
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x777777)

  const camera = createCamera(gameWindow)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(gameWindow.clientWidth, gameWindow.clientHeight)
  gameWindow.appendChild(renderer.domElement)

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let selectedObject = undefined

  let terrain = []
  let buildings = []

  let onObjectSelected = undefined

  function initialize(city) { 
    scene.clear()
    terrain = []
    buildings = []
    for (let x = 0; x < city.size; x++) {
      const column = []
      for (let y = 0; y < city.size; y++) {
        const terrainId = city.data[x][y].terrainId
        const mesh = createAsset(terrainId, x, y)
        scene.add(mesh)
        terrain.push(mesh)
      }
      terrain.push(column)
      buildings.push([...Array(city.size)])
    }

    setupLigths()
  }

  function update(city) {
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const currentBuildingId = buildings[x][y]?.userData.id
        const newBuildingId = city.data[x][y].buildingId

        // If the player removed a building, remove it from the scene
        if (!newBuildingId && currentBuildingId) {
          scene.remove(buildings[x][y])
          buildings[x][y] = undefined
        }

        // If the data model has changed, update the scene
        if (newBuildingId && currentBuildingId !== newBuildingId) {
          scene.remove(buildings[x][y])
          buildings[x][y] = createAsset(newBuildingId, x, y)
          scene.add(buildings[x][y])
        }
      }
    }
  }

  function setupLigths() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
    ]

    lights.forEach(light => {
      light.castShadow = true
      if (light instanceof THREE.DirectionalLight) {
        light.position.set(0, 1, 0)
      }
    })

    scene.add(...lights)
  }

  function draw () {
    renderer.render(scene, camera.camera)
  }

  function start () {
    renderer.setAnimationLoop(draw)
  }

  function stop () {
    renderer.setAnimationLoop(null)
  }

  function onMouseDown (event) {
    camera.onMouseDown(event)

    const isLeftMouseClick = event.button === 0

    if (!isLeftMouseClick) {
      return
    }

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera.camera)

    const intersects = raycaster.intersectObjects(scene.children, false)

    if (intersects && intersects.length > 0) {
      if (selectedObject) {
        selectedObject.material.emissive.setHex(0x000000)
      }
      selectedObject = intersects[0].object
      selectedObject.material.emissive.setHex(0x555555)

      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject)
      }
    }
  }

  function onMouseUp (event) {
    camera.onMouseUp(event)
  }

  function onMouseMove (event) {
    camera.onMouseMove(event)
  }

  return {
    initialize,
    start,
    stop,
    update,
    onObjectSelected,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp,
    onMouseMove: onMouseMove,
  }
}