export class FixedRingBuffer<T> {
  readonly capacity: number;
  private values: Array<T | undefined>;
  private cursor = 0;
  private length = 0;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1)
      throw new RangeError("capacity must be a positive integer");
    this.capacity = capacity;
    this.values = new Array<T | undefined>(capacity);
  }

  get size(): number {
    return this.length;
  }

  push(value: T): void {
    this.values[this.cursor] = value;
    this.cursor = (this.cursor + 1) % this.capacity;
    this.length = Math.min(this.length + 1, this.capacity);
  }

  clear(): void {
    this.values.fill(undefined);
    this.cursor = 0;
    this.length = 0;
  }

  toArray(): T[] {
    const result = new Array<T>(this.length);
    const start = (this.cursor - this.length + this.capacity) % this.capacity;
    for (let index = 0; index < this.length; index += 1) {
      result[index] = this.values[(start + index) % this.capacity] as T;
    }
    return result;
  }
}
