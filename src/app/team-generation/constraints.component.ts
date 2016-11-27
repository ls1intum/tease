import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

/**
 * Created by Malte Bucksch on 27/11/2016.
 */

@Component({
  templateUrl: './constraints.component.html',
  styleUrls: ['./constraints.component.css'],
  selector: 'constraints'
})
export class ConstraintsComponent implements OnInit{
  constructor(private router: Router){

  }

  ngOnInit(): void {
    this.gotoDashboard();
  }

  gotoDashboard(){
    let link = ["/dashboard"];
    this.router.navigate(link);
  }
}
