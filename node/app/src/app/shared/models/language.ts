/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Language {
  private languageLevel: LanguageLevel;
  private language: string;

  constructor(language: string, languageLevel: LanguageLevel) {
    this.language = language;
    this.languageLevel = languageLevel;
  }
}

enum LanguageLevel {
  Native,
  C,
  B,
  A
}


