import { useRef, useState } from 'react'
import './App.css'
import { Environment, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Material, Mesh } from 'three'

function App() {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.x += delta
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <Environment preset='forest' />

      <OrbitControls />

      <ambientLight intensity={0.5} />

      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

      <pointLight position={[-10, -10, -10]} />

      <mesh
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    </>
  )
}

export default App
