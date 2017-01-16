/**
 * Created by Malte Bucksch on 16/01/2017.
 */

export abstract class ArrayHelper {
  static NumberPlaceHolder = "{d}";

  static createNumberRange(maxValue: number): number[] {
    return Array.from(Array(maxValue).keys());
  }
}
