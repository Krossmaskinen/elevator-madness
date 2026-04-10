export class GameLoop {
  private updateInterval: number;
  private intervalRef: ReturnType<typeof setInterval> | null = null;

  constructor({updateInterval = 16}) {
    this.updateInterval = updateInterval;
  }

  public start(onTick: (deltaTime: number) => void) {
    this.intervalRef = setInterval(() => onTick(this.updateInterval), this.updateInterval);
  }

  public stop() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }
}