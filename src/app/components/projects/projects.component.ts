import { Component, Input } from '@angular/core';
import { facCheckIcon, facErrorIcon } from 'src/assets/icons/icons';
import { ProjectData } from 'src/app/shared/models/allocation-data';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  facErrorIcon = facErrorIcon;
  facCheckIcon = facCheckIcon;

  @Input({ required: true }) projectsData: ProjectData[];
}
