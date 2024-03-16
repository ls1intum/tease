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
      const skills: Skill[] = JSON.parse(localStorage.getItem('skills'));
      this.skillsSubject$.next(skills);
    } catch (error) {
      this.skillsSubject$.next([]);
    }

    this.skillsSubject$.subscribe(skills => {
      localStorage.setItem('skills', JSON.stringify(skills));
    });
  }

  setSkills(skills: Skill[]): void {
    this.skillsSubject$.next(skills);
  }

  deleteSkills(): void {
    this.skillsSubject$.next([]);
  }

  get skills$(): Observable<Skill[]> {
    return this.skillsSubject$;
  }
}
