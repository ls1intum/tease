import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { facCheckIcon, facErrorIcon, facInfoIcon, facWarnIcon } from 'src/assets/icons/icons';
import { ProjectData } from 'src/app/shared/models/allocation-data';
import { LocksService } from 'src/app/shared/data/locks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  facErrorIcon = facErrorIcon;
  facCheckIcon = facCheckIcon;
  facInfoIcon = facInfoIcon;
  facWarnIcon = facWarnIcon;

  @Input({ required: true }) projectsData: ProjectData[];
  constraintsVisible = false;

  lockedStudents: string[] = [];
  private locksSubscription: Subscription;

  constructor(private locksService: LocksService) {}

  ngOnInit() {
    this.locksSubscription = this.locksService.locks$.subscribe(locks => {
      this.lockedStudents = Array.from(locks.keys());
    });
  }

  ngOnDestroy() {
    this.locksSubscription?.unsubscribe();
  }
}
