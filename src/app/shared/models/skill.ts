import { StudentSerializer } from '../layers/data-access-layer/student-serializer';
import { CSVConstants } from '../constants/csv.constants';
import { SkillLevel } from './generated-model/skillLevel';

export class Skill {
  private _id: string;
  private _title: string;
  private _description: string;

  constructor(id: string, title: string, description: string, ) {
    this._id = id;
    this._title = title;
    this._description = description;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  /**
   * Helper method to set some information if it is still missing from the skill definition
   * To prevent redundancy in the CSV encoding only one row in the columns for a skills title
   * is populated with values, so depending on in which row of the file this value
   * is set and in which line the parser starts the value will initially be undefined
   * until the row with the non-empty title is parsed
   * @param {string} skillTitle the title of the skill, can be empty
   */
  public setIfMissing(skillTitle: string): void { 
    if (!this.title && skillTitle && skillTitle !== '') { this._title = skillTitle; }
  }
}

