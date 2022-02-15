import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminManageAdminsComponent } from './admin/admin-manage-admins/admin-manage-admins.component';
import { AdminManageStudentsComponent } from './admin/admin-manage-students/admin-manage-students.component';
import { AdminManageTeachersComponent } from './admin/admin-manage-teachers/admin-manage-teachers.component';
import { DepartmentComponent } from './admin/department/department.component';
import { AdminManagerComponent } from './components/admin-manager/admin-manager.component';
import { StudentManagerComponent } from './components/student-manager/student-manager.component';
import { TeacherManagerComponent } from './components/teacher-manager/teacher-manager.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
  },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/account', component: AdminAccountComponent },
  { path: 'admin/department', component: DepartmentComponent },
  { path: 'admin/manage/admins', component: AdminManageAdminsComponent },
  { path: 'admin/manage/teachers', component: AdminManageTeachersComponent },
  { path: 'admin/manage/students', component: AdminManageStudentsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
