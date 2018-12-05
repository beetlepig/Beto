import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-alex-logo',
  templateUrl: './alex-logo.component.html',
  styleUrls: ['./alex-logo.component.css']
})
export class AlexLogoComponent implements OnInit {


  constructor( private router: Router) { }

  ngOnInit() { }

  redirect() {
    this.router.navigate(['/']);
  }
}
