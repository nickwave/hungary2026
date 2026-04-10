export default class LoaderData {
  isVisible: boolean;
  progress: number;
  incrementStep: number;

  constructor({incrementStep} : {incrementStep: number}) {
    this.isVisible = false;
    this.progress = 0;
    this.incrementStep = incrementStep;
  }

  reset() {
    this.progress = 0;
  }

  increment() {
    this.progress += this.incrementStep;
  }
}