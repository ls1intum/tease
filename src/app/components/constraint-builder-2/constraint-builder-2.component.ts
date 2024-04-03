import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project, Student } from 'src/app/api/models';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { Skill } from 'src/app/api/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-constraint-builder-2',
  templateUrl: './constraint-builder-2.component.html',
  styleUrl: './constraint-builder-2.component.scss',
})
export class ConstraintBuilder2Component implements OverlayComponent, OnInit {
  data = {};

  private students: Student[] = [];
  private projects: Project[] = [];
  private skills: Skill[] = [];

  constructor(
    private constraintsService: ConstraintsService,
    private overlayService: OverlayService,
    private studentsService: StudentsService,
    private skillsService: SkillsService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.students = this.studentsService.getStudents();
    this.projects = this.projectsService.getProjects();
    this.skills = this.skillsService.getSkills();

    this.items.forEach(item => {
      this.control.push(new FormControl(false));
    });
  }

  items = [
    { name: 'Four', id: 4 },
    { name: 'Five', id: 5 },
    { name: 'Six', id: 6 },
  ];

  form = new FormGroup({
    items: new FormArray([]),
  });

  submit() {}

  get control() {
    return this.form.get('items') as FormArray;
  }
}
