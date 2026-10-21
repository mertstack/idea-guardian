import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const pointer = { x: 0, y: 0 };

function Orb() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.x += dt * 0.12;
      mesh.current.rotation.y += dt * 0.18;
      const s = 1.05 + Math.sin(t * 0.9) * 0.03;
      mesh.current.scale.setScalar(s);
    }
    if (group.current) {
      const k = 1 - Math.exp(-3 * dt);
      group.current.rotation.y += (pointer.x * 0.5 - group.current.rotation.y) * k;
      group.current.rotation.x += (-pointer.y * 0.3 - group.current.rotation.x) * k;
    }
    if (ring.current) ring.current.rotation.z += dt * 0.25;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1, 64]} />
          <MeshDistortMaterial
            color="#FF5A5F"
            distort={0.38}
            speed={1.6}
            roughness={0.18}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={0.9}
          />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.75, 0.01, 16, 200]} />
          <meshStandardMaterial color="#FF8A8D" emissive="#FF5A5F" emissiveIntensity={0.8} roughness={0.3} />
        </mesh>
      </Float>
      <Sparkles count={60} scale={[7, 5, 4]} size={2.2} speed={0.35} opacity={0.6} color="#FFB3B5" />
    </group>
  );
}

export function Hero3D() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) return;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setSupported(true);
    } catch { /* The core site must work without WebGL. */ }
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  if (!supported) return null;
  return (
    <SceneBoundary>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-75">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 5, 6]} intensity={1.6} color="#ffffff" />
          <pointLight position={[-4, -2, 3]} intensity={18} color="#FF5A5F" />
          <pointLight position={[3, -3, -2]} intensity={10} color="#ffd1d2" />
          <Suspense fallback={null}>
            <Orb />
            <Environment resolution={256}>
              <Lightformer intensity={1.6} position={[0, 5, -2]} scale={[10, 4, 1]} />
              <Lightformer intensity={1} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 6, 1]} />
              <Lightformer intensity={1.5} color="#FF5A5F" position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
              <Lightformer form="ring" intensity={1} position={[0, -3, 4]} scale={3} />
            </Environment>
          </Suspense>
        </Canvas>
      </div>
    </SceneBoundary>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
