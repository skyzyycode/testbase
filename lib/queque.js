const delay = (ms) =>
  typeof ms === "number" && !isNaN(ms) && new Promise((resolve) => setTimeout(resolve, ms));
  
class Queue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  add(item) {
    if (!this.queue.includes(item)) {
      this.queue.push(item);
    }
  }
  has(item) {
    return this.queue.includes(item);
  }
  delete(item) {
    const index = this.queue.indexOf(item);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }
  first() {
    return this.queue[0];
  }
  isEmpty() {
    return this.queue.length === 0;
  }
  async processQueue(callback) {
    if (this.processing || this.isEmpty()) return;
    this.processing = true;
    while (!this.isEmpty()) {
      const currentItem = this.first();
      try {
        await callback(currentItem);
        this.delete(currentItem);
      } catch (error) {
        console.error("Error processing queue item:", error);
        break;
      }
    }

    this.processing = false; 
  }
}

module.exports = Queue;