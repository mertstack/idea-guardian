import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Lightformer } from "@react-three/drei";
import type { Mesh } from "three";

function Orb() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15;
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.6}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#FF5A5F"
          distort={0.45}
          speed={1.4}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
    </Float>
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
  }, []);
  if (!supported) return null;
  return (
    <SceneBoundary>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 4, 6]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#FF5A5F" />
          <Suspense fallback={null}>
            <Orb />
            {/* Local studio lighting (similar to the "city" look) — no outside download that can fail. */}
            <Environment resolution={256}>
              <Lightformer intensity={2} position={[0, 5, -3]} scale={[10, 5, 1]} />
              <Lightformer intensity={1.2} position={[5, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
              <Lightformer intensity={1.2} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
              <Lightformer intensity={0.8} position={[0, -4, 2]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
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
