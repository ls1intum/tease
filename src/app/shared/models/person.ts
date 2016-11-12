/**
 * Created by wanur on 05/11/2016.
 */

export class Person {
  id: number;
  firstName: string;
  lastName: string;
  currentTerm: number;
  major: string;

  constructor(id: number, firstName: string){
    this.id = id;
    this.firstName = firstName;
  }
}
