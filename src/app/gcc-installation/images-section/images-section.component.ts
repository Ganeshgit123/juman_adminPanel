import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-images-section',
  templateUrl: './images-section.component.html',
  styleUrls: ['./images-section.component.scss']
})
export class ImagesSectionComponent implements OnInit {
  endpoint = environment.baseUrl;
  isEdit = false;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  logoImages = [];
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  submitted = false;
  whatImage: any;
  logoImgLength: any;
  editData: any;
  GCCtabParmsId: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.GCCtabParmsId = params['id'];
    });
    const object = {
      sectionIds: [this.GCCtabParmsId]
    }

    this.authService.getImagesBySectionId(object).subscribe(
      (res: any) => {
        this.logoImages = res.payload;
        this.logoImgLength = this.logoImages.length;

        this.dataSource = new MatTableDataSource(this.logoImages);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    this.displayedColumns = ['index', 'path', 'rowActionToggle', 'rowActionIcon'];

  }

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
    this.isEdit = false;
    this.iconImg = null;
    this.whatImage = null;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  removeImg() {
    this.iconImg = "";
    this.fileImgUpload = "";
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.whatImage = event.target.result;
    }
    this.fileImgUpload = file;
  }

  onSubmitImageData() {
    this.submitted = true;
    if (!this.isEdit) {
      if (!(this.fileImgUpload)) {
        return false;
      }
    }
    if (this.isEdit) {
      this.imageUpdateService(this.editData)
      return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('images', this.fileImgUpload)
    formData.append('section_id', this.GCCtabParmsId)
    formData.append('seqs', JSON.stringify(this.logoImgLength))
    formData.append('ids', '[]')
    this.authService.uploadImage(formData)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.iconImg = res.payload[0].path;
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.spinner.hide();
          this.iconImg = null;
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      });
  }

  editImages(data, content) {
    this.editData = data;
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.whatImage = null;
    this.iconImg = data.path;
  }

  imageUpdateService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const array: any = [];
      array.push(data['id']);
      const seqArray = [];
      seqArray.push(data['seq']);

      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', this.GCCtabParmsId)
      formData.append('seqs', JSON.stringify(seqArray))
      formData.append('ids', JSON.stringify(array))
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.submitted = false;
            this.spinner.hide();
            this.iconImg = null;
            this.modalService.dismissAll();
            this.ngOnInit();
          }
        });
    } else {
      this.submitted = false;
      this.modalService.dismissAll();
      this.ngOnInit();
    }
  }

  changeStatus(value) {
    if (value.isActive == true) {
      var visible = false;
    } else {
      var visible = true
    }

    const object = {
      isActive: visible, id: value.id
    }
    this.authService.updateImagesWithoutUpload(object)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

}
