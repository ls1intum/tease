import {Person, Gender} from "../../../models/person";
import {StringHelper} from "../../../helpers/string.helper";
import {CsvColumNames, CsvValueNames} from "../../../constants/csv.constants";
import {DeviceType} from "../../../models/device";
import {SkillLevel} from "../../../models/skill";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export class PersonSerializer {
  static serializePerson(person: Person): {} {
    let personProps = {};

    personProps[CsvColumNames.Person.Id] = person.id;
    personProps[CsvColumNames.Person.Major] = person.major;
    personProps[CsvColumNames.Person.FirstName] = person.firstName;
    personProps[CsvColumNames.Person.LastName] = person.lastName;
    personProps[CsvColumNames.Person.Term] = person.currentTerm;
    personProps[CsvColumNames.Person.IosDevExperience] = person.iosDevExp;
    personProps[CsvColumNames.Person.IosDevExperienceDescription] = person.iosDevExpDescription;
    personProps[CsvColumNames.Person.GitExperience] = person.gitExpDescription;
    personProps[CsvColumNames.Person.Email] = person.email;
    personProps[CsvColumNames.Person.Gender] = this.serializeGender(person.gender);

    this.serializePersonDevices(person,personProps);
    this.serializePriorities(person, personProps);
    this.serializeSkills(person,personProps);

    personProps[CsvColumNames.Person.SupervisorRating] = this.serializeSkillLevel(person.supervisorRating);

    return personProps;
  }

  private static serializePriorities(person: Person, personProps: {}) {
    for (let teamPrio of person.teamPriorities) {
      if (teamPrio == undefined)
        debugger;

      let columnName = StringHelper.format(CsvColumNames.Team.Priority,
        person.getTeamPriority(teamPrio));

      personProps[columnName] = teamPrio.name;
    }
  }

  private static serializeSkills(person: Person, personProps: {}) {
    for(let skill of person.skills){
      let columnName = skill.skillType + CsvColumNames.ArrayBraces.Open + skill.skill + CsvColumNames.ArrayBraces.Close;
      personProps[columnName] = this.serializeSkillLevel(skill.skillLevel);
    }
  }

  private static serializeGender(gender: Gender){
    switch(gender){
      case Gender.Male:
        return CsvValueNames.GenderValue.Male;
      case Gender.Female:
        return CsvValueNames.GenderValue.Female;
    }
  }

  static serializeSkillLevel(skillLevel: SkillLevel){
    switch (skillLevel){
      case SkillLevel.VeryHigh:
        return CsvValueNames.SkillLevelValue.VeryHigh;
      case SkillLevel.High:
        return CsvValueNames.SkillLevelValue.High;
      case SkillLevel.Medium:
        return CsvValueNames.SkillLevelValue.Medium;
      case SkillLevel.Low:
        return CsvValueNames.SkillLevelValue.Low;
      case SkillLevel.None:
        return CsvValueNames.SkillLevelValue.None;
    }
  }

  private static serializePersonDevices(person: Person, personProps: {}) {
    personProps[CsvColumNames.PersonDevices.Ipad] = person.ownsDevice(DeviceType.Ipad) ?
      CsvValueNames.DeviceAvailableBooleanValue.Available : CsvValueNames.DeviceAvailableBooleanValue.Unavailable;
    personProps[CsvColumNames.PersonDevices.Iphone] = person.ownsDevice(DeviceType.Iphone) ?
      CsvValueNames.DeviceAvailableBooleanValue.Available : CsvValueNames.DeviceAvailableBooleanValue.Unavailable;
    personProps[CsvColumNames.PersonDevices.Ipod] = person.ownsDevice(DeviceType.Ipod) ?
      CsvValueNames.DeviceAvailableBooleanValue.Available : CsvValueNames.DeviceAvailableBooleanValue.Unavailable;
    personProps[CsvColumNames.PersonDevices.Watch] = person.ownsDevice(DeviceType.Watch) ?
      CsvValueNames.DeviceAvailableBooleanValue.Available : CsvValueNames.DeviceAvailableBooleanValue.Unavailable;
    personProps[CsvColumNames.PersonDevices.Mac] = person.ownsDevice(DeviceType.Mac) ?
      CsvValueNames.DeviceAvailableBooleanValue.Available : CsvValueNames.DeviceAvailableBooleanValue.Unavailable;
  }
}
