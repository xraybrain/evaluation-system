import { Component, OnInit } from '@angular/core';
import { months } from 'src/app/config/App.config';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  months = months;
  selectedMonth: { id: number; name: string } = { id: 1, name: 'January' };
  constructor() {}

  ngOnInit(): void {}

  onFilterRecentActivities(id: number, name: string) {
    this.selectedMonth = { id, name };
  }
}
