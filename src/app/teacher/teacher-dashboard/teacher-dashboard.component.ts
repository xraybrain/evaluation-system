import { Component, OnInit } from '@angular/core';
import { months } from 'src/app/config/App.config';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit {
  months = months;
  selectedMonth: { id: number; name: string } = { id: 1, name: 'January' };
  constructor() {}

  ngOnInit(): void {}

  onFilterRecentActivities(id: number, name: string) {
    this.selectedMonth = { id, name };
  }
}
