import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { DragulaService } from 'ng2-dragula';
import { Student } from '../../shared/models/student';
import { Team } from '../../shared/models/team';
import { StudentDetailOverlayComponent } from '../student-detail-overlay/student-detail-overlay.component';
import { OverlayService } from '../../overlay.service';
import { ConstraintsOverlayComponent } from '../constraints-overlay/constraints-overlay.component';
import { SkillLevel } from '../../shared/models/skill';
import { Device } from '../../shared/models/device';
import { FormControl, FormGroup } from '@angular/forms';

enum StudentPoolDisplayMode {
  Closed,
  OneRow,
  TwoRows,
  Full,
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onImportPressed = new EventEmitter();
  @Input() onTeamStatisticsButtonPressed;

  studentPoolDisplayMode: StudentPoolDisplayMode = StudentPoolDisplayMode.OneRow;
  statisticsVisible = false;

  StudentPoolDisplayMode = StudentPoolDisplayMode;
  SkillLevel = SkillLevel;
  Device = Device;

  studentPoolDisplayModeFormGroup = new FormGroup({
    studentPoolDisplayModeControl: new FormControl(StudentPoolDisplayMode.OneRow),
  });

  constructor(
    public teamService: TeamService,
    private dragulaService: DragulaService,
    private overlayService: OverlayService,
  ) {
    /* save model when modified by drag & drop operation */
    dragulaService.dropModel("students").subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
      let student: Student = teamService.getStudentById(item.studentId);
      let currentTeam = student.team;

      if (currentTeam) {
        currentTeam.remove(student);
      }

      let inferredNewTeam = this.inferTeam(targetModel, student);

      // just in case the team inferred from student references is also a copy and
      // not stored in the TeamService -> match by name (worst case this returns the same reference again)
      let newTeam = teamService.getTeamByName(inferredNewTeam.name);
      newTeam.add(student);
      teamService.saveToLocalBrowserStorage();
    });
  }

  studentPoolDisplayModeUpdated() {
    this.studentPoolDisplayMode = this.studentPoolDisplayModeFormGroup.value.studentPoolDisplayModeControl;
    this.onStudentPoolDisplayModeChange()
  }

  ngOnInit() {
    this.teamService.readFromBrowserStorage();
  }

  getStudentPoolDisplayModeCSSClass(value: StudentPoolDisplayMode): string {
    const modeString = (Object.values(StudentPoolDisplayMode)[value] as string).toLowerCase()
    return 'student-pool-display-mode-' + modeString
  }

  public showStudentDetails(student: Student) {
    this.overlayService.closeOverlay();

    if (!student) {
      return;
    }

    const indexOfStudent = this.teamService.studentsWithoutTeam.indexOf(student);

    this.overlayService.displayComponent(StudentDetailOverlayComponent, {
      student: student,
      onClose: () => this.teamService.saveToLocalBrowserStorage(),
      onNextStudentClicked: () => this.showStudentDetails(this.teamService.studentsWithoutTeam[indexOfStudent + 1]),
      onPreviousStudentClicked: () => this.showStudentDetails(this.teamService.studentsWithoutTeam[indexOfStudent - 1]),
      onStudentClicked: clickedStudent => this.showStudentDetails(clickedStudent),
    });
  }

  public isDataLoaded(): boolean {
    return this.teamService.teams && this.teamService.teams.length > 0;
  }

  openConstraintsDialog() {
    this.overlayService.displayComponent(ConstraintsOverlayComponent, { displayWarning: !this.areAllTeamsEmpty() });
  }

  protected areAllTeamsEmpty(): boolean {
    return this.teamService.teams.reduce((acc, team) => acc && team.students.length === 0, true);
  }

  toggleStudentPoolStatistics() {
    this.statisticsVisible = !this.statisticsVisible;
    if (this.statisticsVisible) {
      this.studentPoolDisplayMode = StudentPoolDisplayMode.Full;

      // make sure the value of the radio button form is updated accordingly as well
      this.studentPoolDisplayModeFormGroup.setValue({ studentPoolDisplayModeControl: StudentPoolDisplayMode.Full})
    }
  }

  onStudentPoolDisplayModeChange() {
    if (this.studentPoolDisplayMode !== StudentPoolDisplayMode.Full && this.statisticsVisible)
      this.toggleStudentPoolStatistics();
  }

  /**
  * Infers a team based on an array of members of a team, assumes any given student picked
  * from the array has the correct team set with the exception of the student passed to the function
  * This is a workaround for the fact that a student dropped into a new team will still have the team set
  * that they were dragged out/removed from
  * @param {Array<Student>} members The students currently in the team (including the student that was just added)
  * @param {Student} added The student that was just added to the team and has the wrong team set
  * @returns Inferred actual team (based on members that were already in the team)
  */
  private inferTeam(members: Array<Student>, added: Student): Team {
    let teams = members.filter(member => member.studentId != added.studentId).map(member => member.team)
    let unique_teams = [... new Set(teams)]
    if (unique_teams.length > 1) {
      throw new Error("Team members had more than one unique team: " + unique_teams.map(team => team.name))
    } else if (unique_teams.length == 0) {
      // TODO: if no other students were in the team before, this currenet method
      // has no way of inferring the team name, needs to be fixed
      return null;
    }
    return unique_teams[0]
  }
}
