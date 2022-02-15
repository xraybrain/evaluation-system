import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherAccountComponent } from './teacher/teacher-account/teacher-account.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptor/HeaderInterceptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminManagerComponent } from './components/admin-manager/admin-manager.component';
import { TeacherManagerComponent } from './components/teacher-manager/teacher-manager.component';
import { StudentManagerComponent } from './components/student-manager/student-manager.component';
import { DepartmentComponent } from './admin/department/department.component';
import { AdminManageAdminsComponent } from './admin/admin-manage-admins/admin-manage-admins.component';
import { AdminManageTeachersComponent } from './admin/admin-manage-teachers/admin-manage-teachers.component';
import { AdminManageStudentsComponent } from './admin/admin-manage-students/admin-manage-students.component';
import { DepartmentFormComponent } from './modals/department-form/department-form.component';
import { MessageBoxComponent } from './modals/message-box/message-box.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentDashboardComponent,
    AdminDashboardComponent,
    AdminAccountComponent,
    TeacherDashboardComponent,
    TeacherAccountComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ProfileComponent,
    AdminManagerComponent,
    TeacherManagerComponent,
    StudentManagerComponent,
    DepartmentComponent,
    AdminManageAdminsComponent,
    AdminManageTeachersComponent,
    AdminManageStudentsComponent,
    DepartmentFormComponent,
    MessageBoxComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [DepartmentFormComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
