export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(seedInputs: Array<string | number>): () => number {
  const seed = hashString(seedInputs.map(String).join("::"));
  return mulberry32(seed);
}

export function seededPick<T>(items: T[], seedInputs: Array<string | number>): T {
  if (items.length === 0) {
    throw new Error("seededPick: items array is empty");
  }
  const random = seededRandom(seedInputs);
  const index = Math.floor(random() * items.length);
  return items[Math.min(index, items.length - 1)];
}

export function seededPickMany<T>(items: T[], count: number, seedInputs: Array<string | number>): T[] {
  const pool = [...items];
  const random = seededRandom(seedInputs);
  const result: T[] = [];
  const target = Math.min(count, pool.length);
  for (let i = 0; i < target; i++) {
    const index = Math.floor(random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

export function seededShuffle<T>(items: T[], seedInputs: Array<string | number>): T[] {
  const arr = [...items];
  const random = seededRandom(seedInputs);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
