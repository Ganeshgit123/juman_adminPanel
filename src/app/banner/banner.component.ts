import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  endpoint = environment.baseUrl;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    maxHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    sanitize: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'Noto Sans', name: 'Noto Sans' }
    ],
    toolbarHiddenButtons: [
      ['link',
        'unlink',
        'insertImage',
        'insertVideo',
        'strikeThrough',
        'subscript',
        'superscript',
      ]
    ]
  };
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];
  bannerForm: FormGroup;
  isEdit = false;
  bannerId: any;
  submitted = false;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  getpages = [];
  editData: any;
  fileUpload: any;
  getDataLength: any;
  contentShow = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild('fileInput') fileInput: ElementRef; // ✅ Added

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = ['index', 'pageName', 'path', 'rowActionToggle', 'rowActionIcon'];

    const object = {
      relations: ["header"],
      sort: { seq: "ASC" }
    }

    this.authService.getBanners(object).subscribe((res: any) => {
      this.getvalue = res.payload;
      this.getDataLength = this.getvalue.length;
      this.dataSource = new MatTableDataSource(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    if (this.contentShow) {
      this.bannerForm = this.fb.group({
        banners: [''],
        header_id: ['', [Validators.required]],
        erTitle: ['', [Validators.required]],
        arTitle: ['', [Validators.required]],
        erContent: [''],
        arContent: [''],
        seq: [''],
      });
    } else {
      this.bannerForm = this.fb.group({
        banners: [''],
        header_id: ['', [Validators.required]],
        erTitle: [''],
        arTitle: [''],
        erContent: [''],
        arContent: [''],
        seq: [''],
      });
    }

    const object1 = {
      sort: { seq: "ASC" },
      filter: { isActive: true }
    }

    this.authService.getHeader(object1).subscribe((res: any) => {
      this.getpages = res.payload.filter(
        item => item.seq !== 2 && item.seq !== 5 && item.seq !== 11
      );
    });
  }

  get f() { return this.bannerForm.controls; }

  ngAfterViewInit(): void {
    if (localStorage.getItem("dir") == "ltr") {
      this.matPaginator._intl.itemsPerPageLabel = 'Items per page';
    } else {
      this.matPaginator._intl.itemsPerPageLabel = 'معلومات كل صفحة';
    }
  }

  // ✅ Added - centralized reset for all image-related state
  resetImageState() {
    this.iconImg = null;
    this.fileImgUpload = null;
    this.fileUpload = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // clears the native DOM file input
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
    this.bannerForm.reset();
    this.submitted = false;
    this.isEdit = false;
    this.resetImageState(); // ✅ Replaced manual null assignments
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  checkFileFormat(checkFile) {
    if (
      checkFile.type == 'image/webp' ||
      checkFile.type == 'image/png' ||
      checkFile.type == 'image/jpeg' ||
      checkFile.type == 'image/svg+xml' ||
      checkFile.type == 'image/tif' ||
      checkFile.type == 'image/tiff'
    ) {
      return false;
    } else {
      return true;
    }
  }

  removeImg() {
    this.resetImageState(); // ✅ Replaced manual assignments
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.fileUpload = event.target.result;
      }
      this.fileImgUpload = file;
    }
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.isEdit) {
      if (!(this.bannerForm.valid && this.fileImgUpload)) {
        return false;
      }
    }

    if (this.isEdit) {
      this.bannerEditService(this.editData);
      return;
    }

    this.spinner.show();
    const formData = new FormData();
    formData.append('banners', this.fileImgUpload);
    formData.append('seq', this.getDataLength);
    formData.append('header_id', this.bannerForm.value.header_id);
    formData.append('erTitle', this.bannerForm.value.erTitle ?? '');
    formData.append('arTitle', this.bannerForm.value.arTitle ?? '');
    formData.append('erContent', this.bannerForm.value.erContent ?? '');
    formData.append('arContent', this.bannerForm.value.arContent ?? '');
    formData.append('isActive', '1');

    this.authService.createBanner(formData).subscribe((res: any) => {
      if (res.code == 200) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.submitted = false;
        this.spinner.hide();
        this.bannerForm.reset();
        this.resetImageState(); // ✅ Clears file input after successful create
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Error ', 'Error');
      }
    });
  }

  editBanner(data, content) {
    this.editData = data;
    this.resetImageState(); // ✅ Replaced manual null assignment
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;
    this.submitted = false;
    this.iconImg = data['path'];

    var header_id = data.header.id;
    this.contentShow = header_id == "d5dc29ae-481b-47a4-80f3-2f1afa274da0";

    this.bannerForm = this.fb.group({
      id: [data['id']],
      header_id: [header_id],
      erTitle: [data['erTitle']],
      arTitle: [data['arTitle']],
      erContent: [data['erContent']],
      arContent: [data['arContent']],
      seq: [data['seq']],
      isActive: [data['isActive']],
    });
  }

  bannerEditService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('banners', this.fileImgUpload);
      formData.append('seq', data.seq);
      formData.append('id', data.id);
      formData.append('header_id', this.bannerForm.value.header_id);
      formData.append('erTitle', this.bannerForm.value.erTitle);
      formData.append('arTitle', this.bannerForm.value.arTitle);
      formData.append('erContent', this.bannerForm.value.erContent);
      formData.append('arContent', this.bannerForm.value.arContent);
      formData.append('isActive', '1');

      this.authService.updateBanner(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.spinner.hide();
          this.bannerForm.reset();
          this.resetImageState(); // ✅ Clears file input after edit with image
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Error ', 'Error');
        }
      });
    } else {
      const object = { id: this.bannerForm.value.header_id };
      this.bannerForm.value.header = object;

      this.authService.updateBannerWithoutImg(this.bannerForm.value).subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.bannerForm.reset();
          this.resetImageState(); // ✅ Clears file input after edit without image
          this.modalService.dismissAll();
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.toastr.error('Error ', 'Error');
        }
      });
    }
  }

  changeStatus(value) {
    const object = {
      id: value.id,
      isActive: value.isActive == 1 ? 0 : 1 // ✅ Simplified toggle
    }
    this.authService.updateBannerWithoutImg(object).subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.submitted = false;
        this.bannerForm.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      } else {
        this.toastr.error('Error ', 'Error');
      }
    });
  }

  headerSelect(id) {
    this.contentShow = id == "d5dc29ae-481b-47a4-80f3-2f1afa274da0"; // ✅ Simplified
  }
}