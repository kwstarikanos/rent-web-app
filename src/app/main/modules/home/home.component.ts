import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private titleService: Title,
  ) {
    titleService.setTitle('RentCube');
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);
    });
  }

  logout() {
    this.auth.logout();
  }
}
