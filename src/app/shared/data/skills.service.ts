import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Skill } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
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

  private skillsSubject$: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);

  setSkills(skills: Skill[]): void {
    this.skillsSubject$.next(skills);
  }

  deleteSkills(): void {
    this.skillsSubject$.next([]);
  }

  getSkills(): Skill[] {
    return this.skillsSubject$.getValue();
  }

  get skills$(): Observable<Skill[]> {
    return this.skillsSubject$;
  }
}
