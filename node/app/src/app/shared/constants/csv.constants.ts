/**
 * Created by Malte Bucksch on 20/11/2016.
 */
import {SkillLevel} from '../models/skill';

// colums
export class CsvColumNames {
  static readonly Person = {
    Id: 'id',
    FirstName: 'firstname',
    LastName: 'lastname',
    Major: 'major',
    MajorOther: 'major[other]',
    Term: 'semester',
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
  static readonly PersonSkills = {Technology: 'Technology', Concept: 'Concepts'};
  static readonly Team = {TeamName: 'teamName', Priority: 'Priorities[{d}]'};
  static readonly ArrayBraces = {Open: '[', Close: ']'};
}

export class CsvValueNames {
  // static readonly SkillLevelValue = {VeryHigh:"Expert",High: "High",Medium: "Med",
  static readonly SkillLevelValue = {
    VeryHigh: 'Expert', High: 'Advanced', Medium: 'Normal',
    Low: 'Novice', None: 'No'
  };
  static readonly GenderValue = {Male: 'male', Female: 'female'};
  static readonly LanguageLevelValue = {Native: 'Native', C: 'C1/C2', B: 'B1/B2', A: 'A1/A2'};
  static readonly DeviceAvailableBooleanValue = {Available: 'Yes', Unavailable: 'No'};
  static readonly MajorOtherValue = 'Other';
  static readonly OOPSkillName = 'OOP';

  static readonly iOSDevExperienceLow = 'I have no experience in Apple platform development other than the intro course.';
  static readonly iOSDevExperienceMedium = 'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).';
  static readonly iOSDevExperienceHigh = 'I have been an active developer for a native Apple application.';
  static readonly iOSDevExperienceVeryHigh = 'I have submitted my own native Apple application(s) to the AppStore.';


}

export const ExamplePersonPropertyCsvRemotePath = '/assets/persons_example.csv';
