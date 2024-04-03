/**
 * Created by Malte Bucksch on 20/11/2016.
 */

export class CSVConstants {
  static readonly Person = {
    FirstName: 'firstName',
    LastName: 'lastName',
    Email: 'email',
    TumId: 'tumId',
    Gender: 'gender',
    Nationality: 'nationality',
    Major: 'major',
    MajorOther: 'major[other]',
    Semester: 'semester',
    GermanLanguageLevel: 'language[a1]',
    EnglishLanguageLevel: 'language[a2]',
    IosDevExperience: 'iOSDev',
    IosDevAppStoreLink: 'appStoreLink',
    IosDevExperienceExplained: 'iOSDevExplained',
    IntroAssessment: 'supervisorAssessment',
    IntroAssessmentTutor: 'introAssessmentTutor[INTRO]',
    IntroAssessmentAnswers: ['NO', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    IntroAssessmentTutorAnswers: ['NO', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],

    /* (devices) */
    /* (skills) */

    OtherSkills: 'otherSkills',

    /* (priorities) */

    StudentComments: 'Comments',
    SupervisorRating: 'supervisorAssessment',
    TutorComments: 'CommentsTutor',
    IsPinned: 'IsPinned',
  };

  static readonly Skills = {
    JustifyPrefix: 'justify',
    ExpInterPrefix: 'Skills',
    ExperiencePostfix: '',
    InterestPostfix: '',
    SkillNameAbbreviationPairs: [
      ['Machine Learning', '[Machine Learning]'],
      ['Server-side development', '[Server-side development]'],
      ['Flutter', '[Flutter]'],
      ['Web Development', '[Web Development]'],
      ['Cloud infrastructure', '[Cloud infrastructure providers]'],
      ['Computer Graphics / Vision', '[Computer Graphics / Vision]'],
      ['Docker, Kubernetes', '[DockerKubernetes]'],
      ['Games Engineering', '[Games Engineering]'],
    ],
    SkillLevelAnswers: ['NO', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    InterestLevelAnswers: ['NO', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
  };

  static readonly Devices = {
    Iphone: 'devices[iPhone]',
    Ipad: 'devices[iPad]',
    Mac: 'devices[Mac]',
    Watch: 'devices[Watch]',
    IphoneAR: 'devices[iPhoneAR]',
    IpadAR: 'devices[iPadAR]',
  };

  static readonly iOSDevExperienceLow =
    'I have no experience in Apple platform development other than the intro course.';
  static readonly iOSDevExperienceMedium =
    'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).';
  static readonly iOSDevExperienceHigh = 'I have been an active developer for a native Apple application.';
  static readonly iOSDevExperienceVeryHigh = 'I have submitted my own native Apple application(s) to the AppStore.';

  static readonly Team = { TeamName: 'teamName', Priority: 'Priorities[{d}]' };
  static readonly ArrayBraces = { Open: '[', Close: ']' };

  static readonly SkillLevelValue = {
    VeryHigh: 'EXPERT',
    High: 'ADVANCED',
    Medium: 'INTERMEDIATE',
    Low: 'NOVICE',
    None: 'NO',
  };

  static readonly GenderValue = { Male: 'MALE', Female: 'FEMALE' };

  static readonly DeviceAvailableBooleanValue = { Available: 'Yes', Unavailable: 'No' };

  static readonly MajorOtherValue = 'Other';
}

export const ExamplePersonPropertyCsvRemotePath = '/assets/persons_example.csv';
