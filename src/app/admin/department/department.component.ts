import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepartmentFormComponent } from 'src/app/modals/department-form/department-form.component';
import { Department } from 'src/app/models/interface/Department.interface';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public departments: Department[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSearch() {
    this.departments = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.departmentService
      .findAll(page, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        if (response.success) {
          if (response.results) {
            this.departments.push(...response.results);
            if (response.page && response.pages) {
              this.hasMore = response.page < response.pages;
            }
          }
        } else {
          this.toastr.error(response.message, '', { timeOut: 2000 });
        }
      });
  }

  onCreateNew() {
    const modalInstance = this.modal.open(DepartmentFormComponent, {
      size: 'sm',
      windowClass: 'modal-rounded',
    });
    modalInstance.result
      .then((department?: Department) => {
        if (department) {
          this.departments.push(department);
        }
      })
      .catch(() => {});
  }

  onEdit(department: Department) {
    const modalInstance = this.modal.open(DepartmentFormComponent, {
      size: 'sm',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.department = department;
  }
}
