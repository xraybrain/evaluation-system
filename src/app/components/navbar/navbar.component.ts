import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/interface/User.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public user: User | undefined;
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser().subscribe((response) => {
      this.user = response.result;
    });
  }
}
