import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Skill } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private skillsSubject$: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);

  constructor() {
    try {
      const storedSkills = localStorage.getItem('skills') || '[]';
      const skills: Skill[] = JSON.parse(storedSkills);
      this.setSkills(skills);
    } catch (error) {
      this.deleteSkills();
    }
  }

  setSkills(skills: Skill[]): void {
    this.skillsSubject$.next(skills);
    localStorage.setItem('skills', JSON.stringify(skills));
  }

  deleteSkills(): void {
    this.setSkills([]);
  }

  get skills$(): Observable<Skill[]> {
    return this.skillsSubject$;
  }
}
