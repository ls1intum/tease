import {Person} from "./person";
/**
 * Created by wanur on 05/11/2016.
 */

export class Team {
  id: number;
  name: string;
  persons: Person[];

  constructor(id: number, name: string){
    this.id = id;
    this.name = name;
  }
}
