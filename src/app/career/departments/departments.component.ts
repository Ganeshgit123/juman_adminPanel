import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  endpoint = environment.baseUrl;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getValue = [];
  departForm: FormGroup;
  isEdit = false;
  submitted = false;
  getLength: any;
  editData:any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.displayedColumns = ['index', 'erTitle', 'arTitle', 'rowActionToggle', 'rowActionIcon'];
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "168d8ed9-6ea5-4707-bdce-c8d0689090f4" }
      },
      sort: { seq: "ASC" }
    }

    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.getLength = this.getValue.length;
        this.dataSource = new MatTableDataSource(this.getValue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    this.departForm = this.fb.group({
      erTitle: ['', [Validators.required]],
      arTitle: ['', [Validators.required]],
    });
  }

  get f() { return this.departForm.controls; }

  ngAfterViewInit(): void {
    if (localStorage.getItem("dir") == "ltr") {
      this.matPaginator._intl.itemsPerPageLabel = 'Items per page';
    } else {
      this.matPaginator._intl.itemsPerPageLabel = 'معلومات كل صفحة';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(content) {
    this.departForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.departForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.departEditService(this.editData)
      return;
    }

    this.departForm.value.seq = this.getLength;
    this.departForm.value.code = "DEPART";
    this.departForm.value.header = '168d8ed9-6ea5-4707-bdce-c8d0689090f4';
    this.authService.createSection(this.departForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.departForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  editDepart(data, content) {
    this.editData = data;
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;

    this.departForm = this.fb.group({
      id: [data['id']],
      erTitle: [data['erTitle']],
      arTitle: [data['arTitle']],
      seq: [data['seq']],
      code: [data['code']],
      header: [data['header'].id],
    });
  }

  departEditService(data){
    this.authService.updateSection(this.departForm.value)
    .subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.submitted = false;
        this.departForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', 'Error');
      }
    });
  }

  changeStatus(value){
    if(value.isActive == true){
      var visible = false;
    }else{
      var visible = true
    }
    const object = {
      id : value.id,
      isActive: visible
    }
    this.authService.updateSection(object)
    .subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.submitted = false;
        this.departForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', 'Error');
      }
    });
  }
}
