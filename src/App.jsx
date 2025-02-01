import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Edges,
  MeshPortalMaterial,
  CameraControls,
  Environment,
  PivotControls,
  Stats,
} from "@react-three/drei";
import { useControls } from "leva";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const App = () => {

  return (<Canvas camera={{ position: [0, 0, 5] }}>
    <Scene />
    {/* <CameraControls makeDefault /> */}
  </Canvas>)
}

function Scene({}) {
  const { nodes } = useGLTF("/test_logo.glb");

  const mesh = useRef();

  const mergedGeometry = mergeGeometries([
    nodes.Curve001.geometry,
    nodes.Curve003.geometry,
  ]);

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta;
  });
  
  return (<>
  <Environment preset="city" />
  <mesh position={[0,0,1.5]} scale={[20,20,20]} rotation={[Math.PI/2, 0, 0]}>
    <bufferGeometry attach="geometry" {...nodes.Curve002.geometry} />
    <meshStandardMaterial metalness={.9} />
  </mesh>
    <mesh ref={mesh}>
      
      <boxGeometry args={[2, 2, 2]} />
      <Edges />
      <Side rotation={[0, 0, 0]} bg="orange" index={0}>
        <torusGeometry args={[0.65, 0.3, 64]} />
      </Side>
      <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
        <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
      </Side>
      <Side
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        bg="lightgreen"
        index={2}
      >
        <boxGeometry args={[1.15, 1.15, 1.15]} />
      </Side>
      <Side
        rotation={[0, Math.PI / 2, -Math.PI / 2]}
        bg="aquamarine"
        index={3}
      >
        <octahedronGeometry />
      </Side>
      <Side
        rotation={[Math.PI, Math.PI, 0]}
        bg="indianred"
        index={4}
        scale={[20, 20, 20]}
      >
        <bufferGeometry attach="geometry" {...mergedGeometry} />
      </Side>
      <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
        <dodecahedronGeometry />
      </Side>
    </mesh>
  <Stats /></>)
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
      <mesh castShadow receiveShadow ref={mesh} scale={scale} rotation-x={Math.PI/2}>
        {children}
        <meshStandardMaterial metalness={.9} />
      </mesh>
    </MeshPortalMaterial>
  );
}

function LogoGeometry() {
  const { nodes } = useGLTF("/test_logo.glb");

  const mergedGeometry = mergeGeometries([
    nodes.Curve001.geometry,
    nodes.Curve002.geometry,
    nodes.Curve003.geometry,
  ]);

  return <bufferGeometry attach="geometry" {...mergedGeometry} />;
}

useGLTF.preload("test_logo.glb");
