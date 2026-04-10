export class Queue<T> {
  private queueList: T[] = $state([]);

  constructor() {}

  add(item: T) {
    this.queueList.push(item);
  }

  getNext(): T | undefined {
    return this.queueList.shift();
  }

  hasItem(item: T): boolean {
    return this.queueList.includes(item);
  }

  isEmpty(): boolean {
    return this.queueList.length === 0;
  }

  items(): T[] {
    return [...this.queueList];
  }
}
