import * as THREE from 'three'

const DEGREES_TO_RADIANS = Math.PI / 180

export function createCamera(gameWindow) {
  const LEFT_MOUSE_BUTTON = 0
  const RIGHT_MOUSE_BUTTON = 2
  const MIDDLE_MOUSE_BUTTON = 1

  const MIN_CAMERA_RADIUS = 10
  const MAX_CAMERA_RADIUS = 20
  const MIN_CAMERA_ELEVATION = 30
  const MAX_CAMERA_ELEVATION = 80

  const ROTATION_SPEED = 0.3
  const ZOOM_SPEED = 0.02
  const PAN_SPEED = 0.01

  const Y_AXIS = new THREE.Vector3(0, 1, 0)

  const camera = new THREE.PerspectiveCamera(75, gameWindow.clientWidth / gameWindow.clientHeight, 0.1, 1000)
  let cameraOrigin = new THREE.Vector3()
  let cameraRadius = (MAX_CAMERA_RADIUS + MIN_CAMERA_RADIUS) / 2
  let cameraAzimuth = 225
  let cameraElevation = MIN_CAMERA_ELEVATION
  let isLeftMouseDown = false
  let isRightMouseDown = false
  let isMiddleMouseDown = false
  let prevMouseX = 0
  let prevMouseY = 0
  updateCameraPosition()

  function onMouseDown (event) {
    if (event.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = true
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = true
    } else if (event.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = true
    }
  }

  function onMouseUp (event) {
    if (event.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = false
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = false
    } else if (event.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = false
    }
  }

  function onMouseMove (event) {
    const deltaX = event.clientX - prevMouseX
    const deltaY = event.clientY - prevMouseY

    // handles the rotation of the camera
    if (isLeftMouseDown) {
      cameraAzimuth += -(deltaX * ROTATION_SPEED)
      cameraElevation += deltaY * ROTATION_SPEED
      cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation))
      updateCameraPosition()
    }

    // handles the panning of the camera
    if (isRightMouseDown) {
      const foward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEGREES_TO_RADIANS)
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEGREES_TO_RADIANS)
      cameraOrigin.add(foward.multiplyScalar(-deltaY * PAN_SPEED))
      cameraOrigin.add(left.multiplyScalar(-deltaX * PAN_SPEED))
      updateCameraPosition()
    }

    // handles the zooming of the camera
    if (isMiddleMouseDown) {
      cameraRadius += (deltaY) * ZOOM_SPEED
      cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius))
      updateCameraPosition()
    }


    prevMouseX = event.clientX
    prevMouseY = event.clientY
  }

  function updateCameraPosition () {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEGREES_TO_RADIANS) * Math.cos(cameraElevation * DEGREES_TO_RADIANS)
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEGREES_TO_RADIANS)
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEGREES_TO_RADIANS) * Math.cos(cameraElevation * DEGREES_TO_RADIANS)
    camera.position.add(cameraOrigin)
    camera.lookAt(cameraOrigin)
    camera.updateMatrix()
  }

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  }
}