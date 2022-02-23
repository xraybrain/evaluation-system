import { Component, OnInit } from '@angular/core';
import { months } from 'src/app/config/App.config';
import { AdminDashboardStats } from 'src/app/models/interface/Admin.interface';
import { Activity } from 'src/app/models/interface/User.interface';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  months = months;
  currentMonth = new Date().getMonth();
  selectedMonth: { id: number; name: string } = {
    id: this.currentMonth,
    name: months[this.currentMonth],
  };
  dashboardStats: AdminDashboardStats = {
    students: 0,
    admins: 0,
    teachers: 0,
    departments: 0,
  };
  activities: Activity[] = [];

  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.adminService.getAdminDashboardStats().subscribe((response) => {
      if (response.success) {
        if (response.result) this.dashboardStats = response.result;
      }
    });
    this.loadActivities();
  }

  loadActivities() {
    this.userService
      .findAllActivities(this.selectedMonth.id)
      .subscribe((response) => {
        if (response.success) {
          this.activities = response.results as [];
        }
      });
  }

  onFilterRecentActivities(id: number, name: string) {
    this.selectedMonth = { id, name };
    this.loadActivities();
  }
}
