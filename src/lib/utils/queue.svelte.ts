export class Queue<T> {
  private queueList: T[] = $state([])

  constructor() {
  }

  add(item: T) {
    this.queueList.push(item);
  }

  getNext(): T | undefined {
    return this.queueList.shift();
  }

  hasItem(item: T): boolean {
    return this.queueList.includes(item);
  }

  peek(): T[] {
    return [...this.queueList];
  }
}