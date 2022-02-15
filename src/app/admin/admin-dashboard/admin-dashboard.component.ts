import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December',
  ];
  selectedMonth: { id: number; name: string } = { id: 1, name: 'January' };
  constructor() {}

  ngOnInit(): void {}

  onFilterRecentActivities(id: number, name: string) {
    this.selectedMonth = { id, name };
  }
}
