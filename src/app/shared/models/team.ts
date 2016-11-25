import {Person} from "./person";
/**
 * Created by wanur on 05/11/2016.
 */

export class Team {
  id: number;
  name: string;
  persons: Person[];

  constructor(id: number, persons: Person[]){
    this.id = id;
    this.persons = persons;
  }
}
