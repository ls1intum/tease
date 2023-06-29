export class CSVConstants {
  static readonly Student = {
    FirstName: 'firstname',
    LastName: 'lastname',
    Email: 'email',
    StudentId: 'studentID',
    Gender: 'gender',
    Nationality: 'nationality',
    StudyProgram: 'studyProgram',
    Semester: 'semester',
    GermanLanguageLevel: 'germanLanguageLevel',
    EnglishLanguageLevel: 'englishLanguageLevel',
    IosDevExperience: 'iOSDev',
    IosDevAppStoreLink: 'appStoreLink',
    IosDevExperienceExplained: 'iOSDevExplained',
    IntroSelfAssessment: 'introSelfAssessment',
    IntroSelfAssessmentAnswers: {
      Novice: 'extremely challenging',
      Intermediate: 'very challenging',
      Advanced: 'medium challenging',
      Expert: 'not challenging at all',
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
  static readonly SkillIdiOS = 'swift';

  static readonly Skills = {
    SkillPrefix: 'skill.',
    SkillTitlePostfix: '.title',
    SkillLevelPostfix: '.skillLevel',
    SkillLevelRationalePostfix: '.skillLevelRationale',

    // TODO: instead of hardcoding them here infer team IDs from the CSV column names (using the prefix)
    // for importing via the api there is a route to retrieve skills
    SkillIds: [CSVConstants.SkillIdiOS, 'webfe', 'ssdev', 'uiux', 'embed', 'vrar', 'mlalg']
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

  static readonly GenderValue = { Male: 'male', Female: 'female' };

  static readonly DeviceAvailableBooleanValue = { Available: 'Yes', Unavailable: 'No' };

  static readonly MajorOtherValue = 'Other';
}

export const ExampleStudentPropertyCsvRemotePath = '/assets/students_example.csv';
