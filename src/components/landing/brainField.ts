/**
 * Procedural 3D "brain" point cloud used by the rotating hero animation.
 *
 * Points are sampled evenly over a brain-shaped implicit surface: an elongated
 * ellipsoid warped by layered noise to create gyri-like folds, grooved along
 * the midline into two hemispheres, with a small cerebellum lobe at the back.
 * A subset of points are flagged as "neurons" and wired to nearby neurons so
 * the renderer can draw sparkling nodes and connective fibers.
 *
 * Everything is deterministic (seeded), so the shape is stable across renders
 * and unit-testable.
 */
export interface BrainField {
  /** Flat xyz triples, length = count * 3. */
  positions: Float32Array;
  /** Per-point base radius in world units. */
  sizes: Float32Array;
  /** Per-point palette index (0 core, 1 cyan, 2 violet). */
  colors: Uint8Array;
  /** Per-point animation phase in radians, for twinkle. */
  phases: Float32Array;
  /** Indices of points that are neurons (brighter, larger, pulsing). */
  neurons: Uint32Array;
  /** Flat index pairs (i, j) of connective fibers between neurons. */
  links: Uint32Array;
  count: number;
}

export interface BrainFieldOptions {
  /** Total cortex points (cerebellum adds ~18% more). */
  cortexPoints?: number;
  seed?: number;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cheap, smooth, deterministic 3D noise in roughly [-1, 1] from summed sines.
function noise3(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.7 + y * 1.3 + 0.5) * 0.5 +
    Math.sin(y * 2.1 - z * 1.6 + 1.7) * 0.3 +
    Math.sin(z * 2.7 + x * 1.1 - 2.3) * 0.2
  );
}

function fbm(x: number, y: number, z: number): number {
  return (
    noise3(x, y, z) * 0.7 + noise3(x * 2.1, y * 2.1, z * 2.1) * 0.3
  );
}

// Ellipsoid half-axes: x = front-back (longest), y = up-down, z = left-right.
const AX = 1.28;
const AY = 1.0;
const AZ = 1.12;

function shapeCortex(
  ux: number,
  uy: number,
  uz: number,
): [number, number, number] {
  // Gyri: push the radius in/out with noise so the surface folds.
  const fold = fbm(ux * 2.3, uy * 2.3, uz * 2.3);
  let r = 1 + 0.12 * fold;
  // Interhemispheric fissure: a groove along the midline (z≈0) on top (y>0).
  const groove = Math.exp(-(uz * uz) / 0.02) * Math.max(0, uy);
  r *= 1 - 0.14 * groove;
  return [ux * r * AX, uy * r * AY, uz * r * AZ];
}

export function generateBrainField(
  options: BrainFieldOptions = {},
): BrainField {
  const cortexPoints = options.cortexPoints ?? 2600;
  const cerebellumPoints = Math.round(cortexPoints * 0.18);
  const count = cortexPoints + cerebellumPoints;
  const rand = mulberry32(options.seed ?? 1337);

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Uint8Array(count);
  const phases = new Float32Array(count);

  const golden = Math.PI * (3 - Math.sqrt(5));

  const place = (i: number, x: number, y: number, z: number) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    sizes[i] = 0.6 + rand() * 0.5;
    const c = rand();
    colors[i] = c > 0.86 ? 2 : c > 0.62 ? 1 : 0;
    phases[i] = rand() * Math.PI * 2;
  };

  // Cortex: even coverage via a Fibonacci sphere, then warped to a brain.
  for (let i = 0; i < cortexPoints; i += 1) {
    const t = i / Math.max(1, cortexPoints - 1);
    const uy = 1 - t * 2;
    const rr = Math.sqrt(Math.max(0, 1 - uy * uy));
    const theta = i * golden;
    const ux = Math.cos(theta) * rr;
    const uz = Math.sin(theta) * rr;
    const jitter = 0.032;
    const [x, y, z] = shapeCortex(
      ux + (rand() - 0.5) * jitter,
      uy + (rand() - 0.5) * jitter,
      uz + (rand() - 0.5) * jitter,
    );
    place(i, x, y, z);
  }

  // Cerebellum: a smaller, finely-folded lobe at the lower back (−x, −y).
  const cbCenter = [-0.86, -0.62, 0];
  const cbAx = 0.46;
  const cbAy = 0.36;
  const cbAz = 0.6;
  for (let k = 0; k < cerebellumPoints; k += 1) {
    const i = cortexPoints + k;
    const t = k / Math.max(1, cerebellumPoints - 1);
    const uy = 1 - t * 2;
    const rr = Math.sqrt(Math.max(0, 1 - uy * uy));
    const theta = k * golden;
    const ux = Math.cos(theta) * rr;
    const uz = Math.sin(theta) * rr;
    const fold = fbm(ux * 6, uy * 6, uz * 6);
    const r = 1 + 0.1 * fold;
    place(
      i,
      cbCenter[0] + ux * r * cbAx,
      cbCenter[1] + uy * r * cbAy,
      cbCenter[2] + uz * r * cbAz,
    );
  }

  // Neurons: a sparse random subset, made brighter/larger.
  const neuronList: number[] = [];
  const neuronTarget = Math.round(count * 0.03);
  for (let n = 0; n < neuronTarget; n += 1) {
    const idx = Math.floor(rand() * count);
    neuronList.push(idx);
    sizes[idx] = 1.5 + rand() * 1.1;
  }
  const neurons = Uint32Array.from(neuronList);

  // Fibers: connect each neuron to its 2 nearest neurons (dedup pairs).
  const linkPairs: number[] = [];
  const seen = new Set<string>();
  for (let a = 0; a < neuronList.length; a += 1) {
    const ia = neuronList[a];
    const ax = positions[ia * 3];
    const ay = positions[ia * 3 + 1];
    const az = positions[ia * 3 + 2];
    const near: { j: number; d: number }[] = [];
    for (let b = 0; b < neuronList.length; b += 1) {
      if (b === a) continue;
      const ib = neuronList[b];
      const dx = positions[ib * 3] - ax;
      const dy = positions[ib * 3 + 1] - ay;
      const dz = positions[ib * 3 + 2] - az;
      near.push({ j: ib, d: dx * dx + dy * dy + dz * dz });
    }
    near.sort((p, q) => p.d - q.d);
    for (let m = 0; m < Math.min(2, near.length); m += 1) {
      const j = near[m].j;
      if (near[m].d > 0.5) continue; // only short fibers
      const key = ia < j ? `${ia}-${j}` : `${j}-${ia}`;
      if (seen.has(key)) continue;
      seen.add(key);
      linkPairs.push(ia, j);
    }
  }

  return {
    positions,
    sizes,
    colors,
    phases,
    neurons,
    links: Uint32Array.from(linkPairs),
    count,
  };
}
