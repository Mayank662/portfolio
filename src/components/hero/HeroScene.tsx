"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* ---------- pointer target shared across the scene ---------- */
const pointer = { x: 0, y: 0 };

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame((_, dt) => {
    if (!group.current) return;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent lerp
    group.current.rotation.y += (pointer.x * 0.35 - group.current.rotation.y) * k;
    group.current.rotation.x += (-pointer.y * 0.25 - group.current.rotation.x) * k;
    group.current.position.x += (pointer.x * viewport.width * 0.02 - group.current.position.x) * k;
  });
  return <group ref={group}>{children}</group>;
}

function LiquidForm({ mobile }: { mobile: boolean }) {
  const mat = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);
  useFrame(({ clock }) => {
    if (!mat.current) return;
    mat.current.distort = 0.38 + Math.sin(clock.elapsedTime * 0.6) * 0.06;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh castShadow receiveShadow scale={mobile ? 1.3 : 1.45}>
        <icosahedronGeometry args={[1, mobile ? 24 : 48]} />
        <MeshDistortMaterial
          ref={mat}
          color="#2a2340"
          metalness={1}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2.4}
          distort={0.4}
          speed={1.6}
          radius={1}
        />
      </mesh>
    </Float>
  );
}

function Shards({ count }: { count: number }) {
  const items = useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    };
    const r = rng(7);
    return Array.from({ length: count }, (_, i) => ({
      pos: [(r() - 0.5) * 6, (r() - 0.5) * 4, (r() - 0.5) * 3 - 0.5] as [number, number, number],
      rot: [r() * Math.PI, r() * Math.PI, 0] as [number, number, number],
      scale: 0.08 + r() * 0.18,
      kind: i % 3,
      speed: 0.8 + r() * 1.4,
    }));
  }, [count]);
  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={it.speed} rotationIntensity={1.2} floatIntensity={1.5}>
          <mesh position={it.pos} rotation={it.rot} scale={it.scale}>
            {it.kind === 0 ? (
              <torusGeometry args={[1, 0.32, 16, 48]} />
            ) : it.kind === 1 ? (
              <octahedronGeometry args={[1, 0]} />
            ) : (
              <capsuleGeometry args={[0.5, 1.2, 8, 16]} />
            )}
            <meshPhysicalMaterial
              color={i % 2 ? "#c4b5fd" : "#2a2438"}
              metalness={1}
              roughness={0.15}
              clearcoat={1}
              envMapIntensity={1.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // Deterministic LCG so the cloud is identical across renders.
    let s = 1337;
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + rnd() * 4;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi) - 1;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#c4b5fd" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene({ mobile }: { mobile: boolean }) {
  return (
    <>
      <color attach="background" args={["#09090d"]} />
      <fog attach="fog" args={["#09090d", 6, 14]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[4, 6, 4]} angle={0.5} penumbra={1} intensity={30} color="#c4b5fd" castShadow />
      <pointLight position={[-5, -3, -2]} intensity={14} color="#a855f7" />
      <pointLight position={[0, -4, 3]} intensity={6} color="#6d28d9" />

      <Rig>
        <LiquidForm mobile={mobile} />
        <Shards count={mobile ? 6 : 11} />
        <Particles count={mobile ? 180 : 420} />
      </Rig>

      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={6} color="#c4b5fd" position={[0, 5, -9]} scale={2} />
          <Lightformer form="ring" intensity={4} color="#a855f7" position={[-5, 2, 1]} scale={[3, 3, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[6, -1, 2]} scale={[1.5, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.2} color="#7c3aed" position={[0, -5, 4]} scale={[8, 1, 1]} />
        </group>
      </Environment>
      <Preload all />
    </>
  );
}

/* ---------- Public component ---------- */
export default function HeroScene({ mobile = false }: { mobile?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }}
      onPointerLeave={() => {
        pointer.x = 0;
        pointer.y = 0;
      }}
    >
      <Canvas
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0, 6], fov: 38 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        shadows
        frameloop={reduced ? "demand" : "always"}
        eventSource={wrap as React.RefObject<HTMLElement>}
        eventPrefix="client"
        className="!pointer-events-none"
      >
        <Scene mobile={mobile} />
      </Canvas>
    </div>
  );
}
