import { Queue } from "./queue.svelte.ts";

describe("Queue", () => {
  it("should add items to the queue", () => {
    const queue = new Queue();

    queue.add(1);
    queue.add(2);

    expect(queue.items()).toHaveLength(2);
  });

  it("should remove items from the queue", () => {
    const queue = new Queue();

    queue.add(1);
    queue.add(2);

    expect(queue.hasItem(1)).toBeTruthy();

    const nextItem = queue.getNext();

    expect(nextItem).toBe(1);
    expect(queue.hasItem(1)).toBeFalsy();
  });
});
