export abstract class NationalityHelper {
  /** Converts an ISO 3166-1 alpha-2 country code to the matching flag emoji */
  static convertISOToEmojiFlag(alpha2: string): string {
    // convert both chars to unicode values, add magic constant (distance between 'A' and unicode region character 'A')
    const unicode_first = alpha2?.charCodeAt(0) + 0x1f1a5;
    const unicode_second = alpha2?.charCodeAt(1) + 0x1f1a5;
    return String.fromCodePoint(unicode_first, unicode_second);
  }

  static getFlagEmojiFromNationality(nationality: string): string {
    return NationalityHelper.convertISOToEmojiFlag(nationality);
  }
}
