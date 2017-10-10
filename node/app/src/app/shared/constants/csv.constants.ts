/**
 * Created by Malte Bucksch on 20/11/2016.
 */
import {SkillLevel} from '../models/skill';

export class CSVConstants {
  static readonly Person = {
    FirstName: 'firstname',
    LastName: 'lastname',
    Email: 'email',
    TumId: 'attribute_2',
    Gender: 'attribute_3',
    Major: 'major',
    MajorOther: 'major[other]',
    Semester: 'semester',
    GermanLanguageLevel: 'language[a1]',
    EnglishLanguageLevel: 'language[a2]',
    IosDevExperience: 'iOSDev',
    IosDevAppStoreLink: 'appStoreLink',
    IosDevExperienceExplained: 'iOSDevExplained',
    IntroAssessment: 'introAssessment[INTRO]',

    /* (devices) */
    /* (skills) */

    OtherSkills: 'otherSkills',

    /* (priorities) */

    StudentComments: 'Comments',
    SupervisorRating: 'supervisorRating',
    TutorComments: 'CommentsTutor',
  };

  static readonly Skills = {
    JustifyPrefix: 'justify',
    ExpInterPrefix: 'expinter',
    ExperiencePostfix: '[expinter][1]',
    InterestPostfix: '[expinter][2]',
    SkillNameAbbreviationPairs: [
      ['Web Frontend Development', 'WEBFE'],
      ['Server-side Development', 'SSDEV'],
      ['Embedded Development', 'EMBED'],
      ['Virtual & Augmented Reality', 'VRAR'],
      ['Machine Learning & Algorithms', 'MLALG'],
      ['UI / UX', 'UIUX']
    ],
    SkillLevelAnswers: ['no skills', 'beginner skills', 'average skills', 'advanced skills', 'expert skills'],
    InterestLevelAnswers: ['not interested at all', 'hardly interested', 'average interest', 'high interest', 'extremely interested'],
  };

  static readonly Devices = {
    Iphone: 'devices[iPhone]', Ipad: 'devices[iPad]', Ipod: 'devices[iPod]',
    Mac: 'devices[Mac]', Watch: 'devices[Watch]'
  };

  static readonly iOSDevExperienceLow = 'I have no experience in Apple platform development other than the intro course.';
  static readonly iOSDevExperienceMedium = 'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).';
  static readonly iOSDevExperienceHigh = 'I have been an active developer for a native Apple application.';
  static readonly iOSDevExperienceVeryHigh = 'I have submitted my own native Apple application(s) to the AppStore.';

  static readonly Team = { TeamName: 'teamName', Priority: 'Priorities[{d}]' };
  static readonly ArrayBraces = { Open: '[', Close: ']' };

  static readonly SkillLevelValue = {
    VeryHigh: 'Expert', High: 'Advanced', Medium: 'Normal', Low: 'Novice', None: 'No'
  };

  static readonly GenderValue = {Male: 'male', Female: 'female'};

  // static readonly LanguageLevelValue = { Native: 'Native', C: 'C1/C2', B: 'B1/B2', A: 'A1/A2' };

  static readonly DeviceAvailableBooleanValue = {Available: 'Yes', Unavailable: 'No'};
}

export const ExamplePersonPropertyCsvRemotePath = '/assets/persons_example.csv';
