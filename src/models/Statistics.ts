export default class Statistics {
  x: number; // single value
  n: number; // array length which from statistics being calculated
  min: number;
  max: number;
  mean: number;
  standartDeviation: number;
  zScore: number;

  get xAsString(): string {
    return `${this.x.toFixed(2)}%`;
  }

  get minAsString(): string {
    return `${this.min.toFixed(2)}%`;
  }

  get meanAsString(): string {
    return `${this.mean.toFixed(2)}%`;
  }

  get maxAsString(): string {
    return `${this.max.toFixed(2)}%`;
  }

  get standartDeviationAsString(): string {
    return `${this.standartDeviation.toFixed(2)}`;
  }

  get zScoreAsString(): string {
    return `${this.zScore.toFixed(2)}`;
  }

  get deltaFromMeanAsString(): string {
    return `${(this.x - this.mean).toFixed(2)}%`;
  }
}
