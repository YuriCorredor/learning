import { Canvas } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Laptop from './Laptop'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 2000,
      position: [-3, 1.5, 4]
    }}
  >
    <Laptop />
  </Canvas>
)
