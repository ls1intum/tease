import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Skill } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  constructor() {
    try {
      let skills: Skill[] = JSON.parse(localStorage.getItem('skills'));
      if (!skills || !Array.isArray(skills) || !skills.every(this.isSkill)) {
        skills = [];
      }
      this.skillsSubject.next(skills);
    } catch (error) {
      this.skillsSubject.next([]);
    }

    this.skillsSubject.subscribe(skills => {
      localStorage.setItem('skills', JSON.stringify(skills));
    });
  }

  private skillsSubject: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);

  setSkills(skills: Skill[]): void {
    this.skillsSubject.next(skills);
  }

  deleteSkills(): void {
    this.skillsSubject.next([]);
  }

  getSkills(): Skill[] {
    return this.skillsSubject.getValue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isSkill(obj: any): obj is Skill {
    return obj && typeof obj.description === 'string' && typeof obj.id === 'string' && typeof obj.title === 'string';
  }
}
