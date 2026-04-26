import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  endpoint = environment.baseUrl;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getValue = [];
  projectForm: FormGroup;
  isEdit = false;
  submitted = false;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  getLength: any;
  whatImage: any;
  editData: any;
  sectionId: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.displayedColumns = ['index', 'erTitle', 'arTitle', 'path', 'projDet', 'rowActionToggle', 'rowActionIcon'];
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "370637af-3d03-41d3-be36-d5d7cc35bce4" }
      },
      sort: { seq: "DESC" }
    }

    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.getLength = this.getValue.length;
        this.dataSource = new MatTableDataSource(this.getValue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    this.projectForm = this.fb.group({
      erTitle: ['', [Validators.required]],
      arTitle: ['', [Validators.required]],
    });
  }

  get f() { return this.projectForm.controls; }

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
    this.projectForm.reset();
    this.isEdit = false;
    this.iconImg = null;
    this.whatImage = null;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  removeImg() {
    this.iconImg = "";
    this.fileImgUpload = "";
  }

  checkFileFormat(checkFile) {
    if (checkFile.type == 'image/webp' || checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/svg+xml' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff') {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.whatImage = event.target.result;
      }
      this.fileImgUpload = file;
    }
  }

  onSubmitData() {
    if (this.isEdit) {
      this.submitted = false;
      this.projectEditService(this.editData)
      return;
    } else {
      if (!(this.projectForm.valid && this.fileImgUpload)) {
        return false;
      }
    }
    this.submitted = true;
    this.spinner.show();
    const object = {
      seq: this.getLength,
      code: "PROJE",
      header: '370637af-3d03-41d3-be36-d5d7cc35bce4',
      erTitle: this.projectForm.value.erTitle,
      arTitle: this.projectForm.value.arTitle,
    }
    this.authService.createSection(object)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          const section_id = res.payload.id;
          if (this.fileImgUpload) {
            const formData = new FormData();
            formData.append('images', this.fileImgUpload)
            formData.append('section_id', section_id)
            formData.append('seqs', '[0]')
            formData.append('ids', '[]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.iconImg = res.payload[0].path;
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.submitted = false;
                  this.spinner.hide();
                  this.projectForm.reset();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                }
              });
          } else {
            this.toastr.success('Success ', 'Updated Successfully');
            this.submitted = false;
            this.projectForm.reset();
            this.spinner.hide();
            this.modalService.dismissAll();
            this.ngOnInit();
          }
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  editProject(data, content) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.whatImage = null;
    // console.log("fef", this.editData)
    this.isEdit = true;
    this.fileImgUpload = null;
    this.sectionId = data['id'];
    var imageVal = data.images.filter(item => item.seq == 0);
    this.editData = imageVal[0];
    this.iconImg = imageVal[0]?.path;

    this.projectForm = this.fb.group({
      id: [data['id']],
      erTitle: [data['erTitle']],
      arTitle: [data['arTitle']],
      seq: [data['seq']],
      code: [data['code']],
      header: [data['header'].id],
    });
  }

  projectEditService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const array: any = [];
      array.push(data.id);
      const seqArr: any = [];
      seqArr.push(data.seq);

      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', this.sectionId)
      formData.append('seqs', seqArr)
      formData.append('ids', JSON.stringify(array))

      this.authService.uploadImage(formData)

        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;
            // console.log("update",this.projectForm.value)
            this.authService.updateSection(this.projectForm.value)
              .subscribe((res: any) => {
                if (res.isSuccess == true) {
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.submitted = false;
                  this.spinner.hide();
                  this.projectForm.reset();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else {
      this.authService.updateSection(this.projectForm.value)
        .subscribe((res: any) => {
          if (res.isSuccess == true) {
            this.toastr.success('Success ', 'Updated Successfully');
            this.submitted = false;
            this.projectForm.reset();
            this.modalService.dismissAll();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  changeStatus(value) {
    if (value.isActive == true) {
      var visible = false;
    } else {
      var visible = true
    }
    const object = {
      id: value.id,
      isActive: visible
    }
    this.authService.updateSection(object)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.projectForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }
}
