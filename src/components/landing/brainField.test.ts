import { describe, expect, it } from "vitest";
import { generateBrainField } from "./brainField";

describe("generateBrainField", () => {
  it("produces cortex + cerebellum points with matching buffer lengths", () => {
    const field = generateBrainField({ cortexPoints: 1000 });
    // 1000 cortex + round(1000 * 0.18) cerebellum
    expect(field.count).toBe(1180);
    expect(field.positions.length).toBe(field.count * 3);
    expect(field.sizes.length).toBe(field.count);
    expect(field.colors.length).toBe(field.count);
    expect(field.phases.length).toBe(field.count);
  });

  it("is deterministic for a given seed", () => {
    const a = generateBrainField({ cortexPoints: 500, seed: 42 });
    const b = generateBrainField({ cortexPoints: 500, seed: 42 });
    expect(Array.from(a.positions.slice(0, 30))).toEqual(
      Array.from(b.positions.slice(0, 30)),
    );
  });

  it("keeps all points within a sane bounding box", () => {
    const field = generateBrainField({ cortexPoints: 1500 });
    for (let i = 0; i < field.count; i += 1) {
      expect(Math.abs(field.positions[i * 3])).toBeLessThan(2);
      expect(Math.abs(field.positions[i * 3 + 1])).toBeLessThan(2);
      expect(Math.abs(field.positions[i * 3 + 2])).toBeLessThan(2);
    }
  });

  it("wires neurons together with valid, even-length link pairs", () => {
    const field = generateBrainField({ cortexPoints: 1200 });
    expect(field.neurons.length).toBeGreaterThan(0);
    expect(field.links.length % 2).toBe(0);
    for (let i = 0; i < field.links.length; i += 1) {
      expect(field.links[i]).toBeLessThan(field.count);
    }
  });
});
