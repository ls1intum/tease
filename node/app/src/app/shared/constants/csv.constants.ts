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
    Gender: 'gender',
    Major: 'major',
    MajorOther: 'major[other]',
    Semester: 'semester',
    GermanLanguageLevel: 'language[a1]',
    EnglishLanguageLevel: 'language[a2]',
    IosDevExperience: 'iOSDevExp',
    IosDevAppStoreLink: 'appStoreLink',
    IosDevExperienceExplained: 'iOSDevExplained',
    IntroAssessment: 'introAssessment',

    /* (devices) */
    /* (skills) */

    OtherSkills: 'otherSkills',

    /* (priorities) */

    CommentsStudent: 'Comments',
    SupervisorRating: 'supervisorRating',
    CommentsTutor: 'CommentsTutor',
  };

  static readonly Skills = {
    JustifyPrefix: 'justify',
    ExpInterPrefix: 'expinter',
    ExperiencePostfix: '[expinter][1]',
    JustificationPostfix: '[expinter][2]',
    SkillAbbreviations: {
      WebFrontend: 'WEBFE',
      ServerSideDev: 'SSDEV',
      EmbeddedDev: 'EMBED',
      VRAR: 'VRAR',
      MachineLearningSkills: 'MLALG',
      UIUX: 'UIUX'
    },
    SkillLevelAnswers: ['no skills', 'beginner skills', 'average skills', 'advanced skills', 'expert skills'],
    InterestLevelAnswers: ['not interested at all', 'hardly interested', 'average interest', 'high interest', 'extremely interested'],
  };

  static readonly iOSDevExperienceLow = 'I have no experience in Apple platform development other than the intro course.';
  static readonly iOSDevExperienceMedium = 'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).';
  static readonly iOSDevExperienceHigh = 'I have been an active developer for a native Apple application.';
  static readonly iOSDevExperienceVeryHigh = 'I have submitted my own native Apple application(s) to the AppStore.';

}



// old stuff following

// colums
export class CsvColumNames {
  static readonly Person = {
    Id: 'id',
    FirstName: 'firstname',
    LastName: 'lastname',
    Major: 'major',
    Semester: 'semester',
    TumId: 'attribute_2',
    IosDevExperience: 'iOSDevExp',
    IosDevExperienceDescription: 'iOSDevExplained',
    Email: 'email',
    GitExperience: 'gitExperience',
    SupervisorRating: 'supervisorRating',
    Gender: 'gender',
    Comments: 'Comments',
    GermanLanguageLevel: 'language[a1]',
    EnglishLanguageLevel: 'language[a2]',
    OrderID: 'orderId'
  };

  static readonly PersonDevices = {
    Iphone: 'Device[iPhone]', Ipad: 'Device[iPad]', Ipod: 'Device[iPod]',
    Mac: 'Device[Mac]', Watch: 'Device[Watch]'
  };

  static readonly PersonSkills = {
    Technology: 'Technology', Concept: 'Concepts', // TODO: remove
  };

  static readonly Team = { TeamName: 'teamName', Priority: 'Priorities[{d}]' };
  static readonly ArrayBraces = { Open: '[', Close: ']' };
}

export class CsvValueNames {
  // static readonly SkillLevelValue = {VeryHigh:"Expert",High: "High",Medium: "Med",
  static readonly SkillLevelValue = {
    VeryHigh: 'Expert', High: 'Advanced', Medium: 'Normal', Low: 'Novice', None: 'No'
  };

  static readonly GenderValue = {Male: 'male', Female: 'female'};

  // static readonly LanguageLevelValue = { Native: 'Native', C: 'C1/C2', B: 'B1/B2', A: 'A1/A2' };

  static readonly DeviceAvailableBooleanValue = {Available: 'Yes', Unavailable: 'No'};

  // static readonly MajorOtherValue = 'Other';
  static readonly OOPSkillName = 'OOP';

  static readonly iOSDevExperienceLow = 'I have no experience in Apple platform development other than the intro course.';
  static readonly iOSDevExperienceMedium = 'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).';
  static readonly iOSDevExperienceHigh = 'I have been an active developer for a native Apple application.';
  static readonly iOSDevExperienceVeryHigh = 'I have submitted my own native Apple application(s) to the AppStore.';


}

export const ExamplePersonPropertyCsvRemotePath = '/assets/persons_example.csv';
