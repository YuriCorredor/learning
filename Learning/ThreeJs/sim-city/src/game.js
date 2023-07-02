import { createScene } from './scene.js'
import { createCity } from './city.js'

export function createGame() {
  const scene = createScene()
  const city = createCity(16)

  scene.initialize(city)
  scene.onObjectSelected = (object) => {
    console.log(object)

    let {x, y} = object.userData
    const tile = city.data[x][y]
    console.log(tile)
  }

  document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false)
  document.addEventListener('mouseup', scene.onMouseUp.bind(scene), false)
  document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false)
  document.addEventListener('contextmenu', (event) => event.preventDefault(), false)

  const game = {
    update() {
      city.update()
      scene.update(city)
    }
  }

  setInterval(() => {
    game.update()
  }, 1000)

  scene.start()

  return game
}