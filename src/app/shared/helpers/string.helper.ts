/**
 * Created by Malte Bucksch on 02/12/2016.
 */

export abstract class StringHelper {
  static NumberPlaceHolder = '{d}';

  static format(rawString: string, numberReplacement: number): string {
    return rawString.replace(StringHelper.NumberPlaceHolder, String(numberReplacement));
  }

  static getStringBetween(rawString: string, firstSeparator: string, secondSeparator: string): string {
    return rawString.split(firstSeparator).pop().split(secondSeparator).shift();
  }
}
