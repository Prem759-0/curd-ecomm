import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Everything below is modelled in code, so the page ships no model files.
// To swap in a real Blender export later: const { scene } = useGLTF('/mango.glb') from drei.

// A mango is a lathe: we spin a hand-drawn outline around the Y axis, lean it a little,
// then paint each vertex (green shoulder, yellow belly, red blush on one side).
function useMangoGeometry() {
  return useMemo(() => {
    const knots = [[0, -1], [0.34, -0.97], [0.62, -0.86], [0.83, -0.64], [0.94, -0.32], [0.95, 0], [0.88, 0.32], [0.74, 0.62], [0.52, 0.86], [0.26, 0.99], [0, 1.03]].map(([x, y]) => new THREE.Vector2(x, y));
    const outline = new THREE.SplineCurve(knots).getPoints(56); // smooth curve through the knots
    let g = new THREE.LatheGeometry(outline, 96, 0, Math.PI * 2);
    g.deleteAttribute('uv');
    g.deleteAttribute('normal');
    g = mergeVertices(g); // joins the seam so the lighting has no visible line
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const low = new THREE.Color('#EC6A2C'), mid = new THREE.Color('#F3B52B'), top = new THREE.Color('#9CB43B'), blush = new THREE.Color('#C9352A');
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const t = (y + 1) / 2.03;
      if (t < 0.5) c.copy(low).lerp(mid, smooth(0, 0.5, t));
      else c.copy(mid).lerp(top, smooth(0.45, 1, t));
      c.lerp(blush, smooth(0.1, 0.95, x) * 0.4 * (1 - t * 0.7)); // blush on the +x side
      colors.set([c.r, c.g, c.b], i * 3);
      pos.setX(i, x + 0.1 * y); // shear: makes the fruit lean like a real mango
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
}

function useLeafGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.22, 0.2, 0.62, 0.2, 1, 0);
    s.bezierCurveTo(0.62, -0.2, 0.22, -0.2, 0, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2, curveSegments: 16 });
    // bend the leaf along its length so it catches light on one side
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + p.getX(i) * p.getX(i) * 0.18);
    g.computeVertexNormals();
    return g;
  }, []);
}

function Mango({ leaf }) {
  const geo = useMangoGeometry();
  return (
    <group rotation={[0.1, 0, -0.28]}>
      <mesh geometry={geo} scale={[1, 1, 0.86]}>
        <meshPhysicalMaterial vertexColors roughness={0.4} clearcoat={0.55} clearcoatRoughness={0.4} />
      </mesh>
      <mesh position={[0.08, 1.06, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.035, 0.06, 0.34, 10]} />
        <meshStandardMaterial color="#6A4A20" roughness={0.8} />
      </mesh>
      <mesh geometry={leaf} position={[0.12, 1.16, 0]} rotation={[0.2, 0.3, 0.55]} scale={1.15}>
        <meshStandardMaterial color="#3F7A2E" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={leaf} position={[0.1, 1.12, 0]} rotation={[-0.1, -0.5, 2.5]} scale={0.8}>
        <meshStandardMaterial color="#5C9A3C" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Jamun() {
  const berries = [[0, 0, 0, 1], [0.48, -0.1, 0.1, 0.92], [-0.42, -0.18, 0.05, 0.95], [0.12, -0.55, 0.25, 0.9], [0.05, 0.38, -0.2, 0.85]];
  return (
    <group>
      {berries.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s * 0.36, s * 0.46, s * 0.36]}>
          <sphereGeometry args={[1, 40, 40]} />
          <meshPhysicalMaterial color="#3A1450" roughness={0.18} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function Turmeric() {
  const fingers = [[0, 0, 0.5, 0.95], [0.32, -0.22, -0.35, 0.8], [-0.2, -0.36, 0.1, 0.7]];
  return (
    <group>
      {fingers.map(([x, y, r, len], i) => (
        <mesh key={i} position={[x, y, 0]} rotation={[0.3, 0, Math.PI / 2 + r]}>
          <capsuleGeometry args={[0.18, len, 8, 20]} />
          <meshStandardMaterial color={i === 0 ? '#C9860F' : '#B87A10'} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// Leaves drifting down behind the fruit. One InstancedMesh, so it is a single draw call.
function Drift({ leaf, count = 16 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 11, y: Math.random() * 7 - 3.5, z: -1.5 - Math.random() * 2.5, sp: 0.15 + Math.random() * 0.25, ph: Math.random() * 6.28, sc: 0.22 + Math.random() * 0.22 })),
    [count]
  );
  useFrame(({ clock }) => {
    const t = still ? 0 : clock.elapsedTime;
    seeds.forEach((s, i) => {
      const y = 4.2 - ((s.y + 4.2 + t * s.sp) % 8.4);
      dummy.position.set(s.x + Math.sin(t * 0.6 + s.ph) * 0.5, y, s.z);
      dummy.rotation.set(t * 0.5 + s.ph, t * 0.7, t * 0.4 + s.ph);
      dummy.scale.setScalar(s.sc);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[leaf, undefined, count]}>
      <meshStandardMaterial color="#5F9440" roughness={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Scene() {
  const leaf = useLeafGeometry();
  const group = useRef();
  const grow = useRef(still ? 1 : 0);

  useFrame(({ pointer }, dt) => {
    const g = group.current;
    grow.current = Math.min(1, grow.current + dt * 0.8);
    const e = grow.current;
    g.scale.setScalar(1 - Math.pow(1 - e, 4) * Math.cos(e * 9)); // settles with a small overshoot
    const k = Math.min(dt * 2.2, 1);
    g.rotation.y += (pointer.x * 0.7 - g.rotation.y) * k;
    g.rotation.x += (-pointer.y * 0.25 - g.rotation.x) * k;
  });

  return (
    <>
      <Drift leaf={leaf} />
      <group ref={group}>
        <Float speed={still ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.6}>
          <group scale={1.3}><Mango leaf={leaf} /></group>
        </Float>
        <Float speed={still ? 0 : 1.7} floatIntensity={1}>
          <group position={[-2.35, -1.1, 0.8]} rotation={[0.2, 0.5, 0.2]}><Jamun /></group>
        </Float>
        <Float speed={still ? 0 : 1.5} floatIntensity={0.8}>
          <group position={[2.3, -1.25, 0.6]} rotation={[0.1, -0.4, -0.3]} scale={1.15}><Turmeric /></group>
        </Float>
      </group>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={4.6} blur={3.2} far={4} color="#3A2400" />
    </>
  );
}

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0.3, 11.5], fov: 36 }} dpr={[1, 2]} aria-hidden="true">
      <hemisphereLight args={['#FFF3D2', '#B7C79A', 1.7]} />
      <pointLight position={[0, -3, 6]} intensity={40} color="#FFE7B8" />
      <directionalLight position={[3.5, 5, 4]} intensity={2.6} color="#FFF0D4" />
      <pointLight position={[-4, 1, -2]} intensity={28} color="#FFD98A" />
      <Scene />
    </Canvas>
  );
}
