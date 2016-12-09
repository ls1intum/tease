/**
 * Created by Malte Bucksch on 20/11/2016.
 */

// colums
export class CsvColumNames {
  static readonly Person = {Id: "id", FirstName:"firstname",LastName:"lastname",Major:"major",
    MajorOther: "major[other]", Term: "semester", IosDevExperience: "iOSDevExp", IosDevExperienceDescription: "iOSDevExplained",
    Email: "email", GitExperience: "gitExperience"};
  static readonly PersonDevices = {Iphone: "Device[iPhone]", Ipad: "Device[iPad]", Ipod: "Device[iPod]",
    Mac: "Device[Mac]", Watch: "Device[Watch]"};
  static readonly Team = {TeamName: "teamName", Priority: "Priorities[{d}]"};
}

export class CsvValueNames {
  static readonly SkillLevel = {VeryHigh:"Expert",High: "High",Medium: "Med", Low: "Low", None: "No"}
  static readonly LanguageLevel = {Native:"Native",C: "C1/C2",B: "B1/B2", A: "A1/A2"}
  static readonly DeviceAvailableBoolean = {Available: "Yes", Unavailable: "No"}
  static readonly MajorOther = "Other";
}

export const CsvTeamPrioritiesCount = 11;
