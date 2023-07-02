import * as THREE from 'three';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const assets = {
  'grass': (x, y) => {
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 })
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.userData = { id: 'grass', x, y }
    mesh.position.set(x, -0.5, y)
    return mesh
  },
  'building-1': (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    const buildingMesh = new THREE.Mesh(boxGeometry, buildingMaterial)
    buildingMesh.userData = { id: 'building-1', x, y }
    buildingMesh.position.set(x, 0.5, y)
    return buildingMesh
  },
  'building-2': (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    const buildingMesh = new THREE.Mesh(boxGeometry, buildingMaterial)
    buildingMesh.userData = { id: 'building-2', x, y }
    buildingMesh.scale.set(1, 2, 1)
    buildingMesh.position.set(x, 1, y)
    return buildingMesh
  },
  'building-3': (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    const buildingMesh = new THREE.Mesh(boxGeometry, buildingMaterial)
    buildingMesh.userData = { id: 'building-3', x, y }
    buildingMesh.scale.set(1, 3, 1)
    buildingMesh.position.set(x, 1.5, y)
    return buildingMesh
  },
}

export function createAsset(assetId, x, y) {
  if (!assets[assetId]) {
    console.warning(`Asset ${assetId} not found`)
    return undefined
  }

  return assets[assetId](x, y)
}
