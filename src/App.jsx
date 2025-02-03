import { useEffect, useRef, useState } from "react";
import HDR from "./studio_country_hall_1k.hdr"
import { Canvas, useFrame } from "@react-three/fiber";
import CustomShaderMaterial from 'three-custom-shader-material'
import Frag from "./shaders/fragment.glsl?raw"
import Vertex from "./shaders/vertex.glsl?raw"
import {
  useGLTF,
  MeshPortalMaterial,
  Environment,
  Stats,
} from "@react-three/drei";
import * as THREE from "three"
import { useControls } from "leva";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { useSpring } from "motion/react";

export const App = () => {
  console.log(HDR)

  return (
    <>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
        {/* <CameraControls makeDefault /> */}
      </Canvas>
    </>
  )
}

function Scene({}) {
  const { nodes } = useGLTF("/test_logo.glb");

  const [isSideOne, setIsSideOne] = useState(true)
  const [geometryIndex, setGeometryIndex] = useState(0)

  const group = useRef();
  const rotationGroup = useRef();

  const mergedGeometry = mergeGeometries([
    nodes.Curve001.geometry,
    nodes.Curve003.geometry,
  ]);

  const interval = useRef()

  const rotation = useSpring(0, {stiffness: 100, damping: 12})

  useEffect(() => {
    interval.current = setInterval(() => {
      rotation.set(rotation.get() + Math.PI)
    }, 2000)
  }, [])

  useFrame(({clock}, delta) => {

    group.current.rotation.y = rotation.get();

    const index = Math.floor(((group.current.rotation.y - Math.PI/2) / Math.PI) + 1) % 4

    setGeometryIndex(Math.max(0, index))
  });
  
  return (<>
    <Environment files={[HDR]} />
    <group ref={rotationGroup}>
      <group ref={group}>
        <group position={[-.25,0,0]}>

          <mesh position={[0,0,0]} scale={25} rotation={[Math.PI/2, 0, 0]}>
            <bufferGeometry attach="geometry" {...nodes.Curve002.geometry} />
            <meshStandardMaterial metalness={.6} roughness={.35} color="#065B5B" />
          </mesh>

          <mesh  scale={25} rotation-x={Math.PI/2} visible={geometryIndex == 0}>
            <bufferGeometry attach="geometry" {...mergedGeometry} />
            <CustomShaderMaterial baseMaterial={THREE.MeshStandardMaterial} fragmentShader={Frag} vertexShader={Vertex} />
          </mesh>

          <ModelTwo position={[-1.15, -1.35, 0]} rotation={[Math.PI/2,0,0]} scale={[20, 10, 20]} visible={geometryIndex == 1} />
          <Model rotation={[Math.PI/2,0,0]} scale={[25, 90, 25]} opacity={1} position={[-1, -1.25, 0]} visible={geometryIndex == 2} >
          </Model >
          <group rotation={[0,Math.PI,0]}>
            <ModelThree rotation={[Math.PI/2, 0, 0]} scale={[19, 19, 19]} position={[-2, -1.45, 0]} visible={geometryIndex == 3} /> 
          </group>
        </group>
        </group>
      </group>
  <Stats />
  </>)
}


function Side({
  rotation = [0, 0, 0],
  bg = "#f0f0f0",
  children,
  index,
  scale = [1, 1, 1],
}) {
  const mesh = useRef();
  const { worldUnits } = useControls({ worldUnits: false });
  const { nodes } = useGLTF("/aobox-transformed.glb");
  return (
    <MeshPortalMaterial worldUnits={worldUnits} attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/** A box with baked AO */}

        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
        />

      {/** The shape */}
      <mesh ref={mesh} scale={scale} rotation-x={Math.PI/2}>
        {children}
        <meshStandardMaterial metalness={.9} />
      </mesh>
    </MeshPortalMaterial>
  );
}

function LogoGeometry({children}) {
  const { nodes } = useGLTF("/test_logo.glb");

  const mergedGeometry = mergeGeometries([
    nodes.Curve001.geometry,
    nodes.Curve002.geometry,
    nodes.Curve003.geometry,
  ]);

  return <bufferGeometry attach="geometry" {...mergedGeometry} />;
}

export function Model({opacity, ...props}) {
  const { nodes } = useGLTF('/logo-2.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Curve001.geometry} >
        <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35} />
      </mesh>
      <mesh geometry={nodes.Curve002.geometry} >
        <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve003.geometry} >
        <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35} />
      </mesh>
      <mesh geometry={nodes.Curve004.geometry} >
        <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35} />
      </mesh>
    </group>
  )
}

export function ModelTwo(props) {
  const { nodes, materials } = useGLTF('/logo-3.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Curve001.geometry} >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve002.geometry} >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve003.geometry} >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve004.geometry} >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve005.geometry} >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve006.geometry} >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
    </group>
  )
}

export function ModelThree(props) {
  const { nodes, materials } = useGLTF('/logo-4.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Curve001.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve002.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve003.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve004.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve005.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve006.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
      <mesh geometry={nodes.Curve007.geometry}  >
      <meshStandardMaterial color="#065B5B" metalness={.6} roughness={.35}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('/logo-4.glb')

useGLTF.preload('/logo-2.glb')

useGLTF.preload("test_logo.glb");
