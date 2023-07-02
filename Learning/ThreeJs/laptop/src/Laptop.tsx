import './App.css'
import { Environment, Html, PresentationControls, useGLTF } from '@react-three/drei'

export default function Laptop() {
  const laptop = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
  )

  return (
    <>
      <Environment preset='apartment' />

      <PresentationControls global polar={[-0.2, 0.2]} azimuth={[-1.2, 0.2]}>
        <primitive object={laptop.scene} position-y={-1.2}>
          <Html
            wrapperClass='laptop'
            position={[0, 1.5, -1.5]}
            distanceFactor={1.16}
            transform
            rotation-x={-0.25}
          >
            <iframe 
              src='https://yuricorredor.com.br/'
            />
          </Html>
        </primitive>
      </PresentationControls>
    </>
  )
}