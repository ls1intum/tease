/**
 * Created by Malte Bucksch on 20/11/2016.
 */
import { SkillLevel } from '../models/skill';

export class CSVConstants {
  static readonly Person = {
    FirstName: 'firstname',
    LastName: 'lastname',
    Email: 'email',
    TumId: 'tumID',
    Gender: 'gender',
    Nationality: 'nationality',
    StudyProgram: 'studyProgram',
    Semester: 'semester',
    GermanLanguageLevel: 'language[a1]',
    EnglishLanguageLevel: 'language[a2]',
    IosDevExperience: 'iOSDev',
    IosDevAppStoreLink: 'appStoreLink',
    IosDevExperienceExplained: 'iOSDevExplained',
    IntroSelfAssessment: 'introSelfAssessment',
    IntroSelfAssessmentAnswers: {
      None: 'extremely challenging',
      Low: 'very challenging',
      Medium: 'medium challenging',
      High: 'hardly challenging',
      VeryHigh: 'not challenging at all',
    },

    /* (devices) */
    /* (skills) */

    OtherSkills: 'otherSkills',

    /* (priorities) */

    StudentComments: 'studentComments',
    SupervisorAssessment: 'supervisorAssessment',
    TutorComments: 'tutorComments',
    IsPinned: 'isPinned',
  };

  // TODO: We want this skill to always exist, but ideally we should store it somewhere else and definitely document it
  static readonly SkillNameiOS = 'iOS Development';

  static readonly Skills = {
    DescriptionPostfix: '.description',
    SkillLevelPostfix: '.skillLevel',
    SkillLevelRationalePostfix: '.skillLevelRationale',
    SkillNameAbbreviationPairs: [
      [CSVConstants.SkillNameiOS, 'IOSDEV'],
      ['Frontend Development', 'WEBFE'],
      ['Server-side Development', 'SSDEV'],
      ['UI / UX', 'UIUX'],
      ['Embedded Development', 'EMBED'],
      ['Virtual & Augmented Reality', 'VRAR'],
      ['Machine Learning & Algorithms', 'MLALG'],
    ],
  };

  static readonly Devices = {
    Iphone: 'devices[iPhone]',
    Ipad: 'devices[iPad]',
    Mac: 'devices[Mac]',
    Watch: 'devices[Watch]',
    IphoneAR: 'devices[iPhoneAR]',
    IpadAR: 'devices[iPadAR]',
  };

  static readonly Team = { TeamName: 'teamName', Priority: 'Priorities[{d}]' };
  static readonly ArrayBraces = { Open: '[', Close: ']' };

  static readonly SkillLevelValue = {
    VeryHigh: 'expert skills',
    High: 'advanced skills',
    Medium: 'average skills',
    Low: 'beginner skills',
    None: 'no skills',
  };

  static readonly GenderValue = { Male: 'male', Female: 'female' };

  static readonly DeviceAvailableBooleanValue = { Available: 'Yes', Unavailable: 'No' };

  static readonly MajorOtherValue = 'Other';
}

export const ExamplePersonPropertyCsvRemotePath = '/assets/persons_example.csv';
