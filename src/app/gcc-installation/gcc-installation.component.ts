import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-gcc-installation',
  templateUrl: './gcc-installation.component.html',
  styleUrls: ['./gcc-installation.component.scss']
})
export class GccInstallationComponent implements OnInit {
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
    sanitize: false,
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
  gccFirstForm: FormGroup;
  getValue: any;
  iconImg: any;
  whatImage: any;
  fileImgUpload: any;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  gccTabForm: FormGroup;
  isEdit = false;
  submitted = false;
  getTabArray = [];
  getLength: any;
  editData: any;
  sectionId: any;
  formSec = [];

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.gccFirstForm = this.fb.group({
      seq: [''], code: [''], erContent: [''], arContent: [''], header: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "597f86b2-bb38-47b6-88ef-1ffc85bf1097" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.formSec = this.getValue.filter(element => {
          return element.code === 'GCC';
        })
        this.gccFirstForm = this.fb.group({
          id: [this.formSec[0].id],
          seq: [this.formSec[0].seq],
          code: [this.formSec[0].code],
          erTitle: [this.formSec[0].erTitle],
          arTitle: [this.formSec[0].arTitle],
          erContent: [this.formSec[0].erContent],
          arContent: [this.formSec[0].arContent],
          header: [this.formSec[0].header.id],
          image: [this.formSec[0]?.images[0]],
        });
        this.iconImg = this.formSec[0]?.images[0]?.path;
      });

    const object1 = {
      relations: ["header", "images"],
      filter: {
        code: "GCCTAB"
      },
      sort: { seq: "ASC" }
    }

    this.authService.getSectionsByHeaderId(object1).subscribe(
      (res: any) => {
        this.getTabArray = res.payload;
        this.dataSource = new MatTableDataSource(this.getTabArray);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
        this.getLength = this.getTabArray.length;
      });
    this.displayedColumns = ['index', 'erTitle', 'arTitle', 'imgSec', 'rowActionToggle', 'rowActionIcon'];

    this.gccTabForm = this.fb.group({
      erTitle: ['', [Validators.required]],
      arTitle: ['', [Validators.required]],
    });
  }

  get f() { return this.gccTabForm.controls; }


  uploadImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      this.iconImg = "";
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.whatImage = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
  }

  removeImg() {
    this.iconImg = "";
    this.whatImage = "";
    this.fileImgUpload = "";

    this.gccFirstForm.patchValue({
      image: null
    });
  }

  onSubmitGCCFormData() {
    if (this.fileImgUpload) {

      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', 'ec250ff0-2e7b-44f0-8fde-531f939e36db',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["c791428a-eeaa-41f4-9dba-98cb44ceeb3c"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;

            // FIX: update form image object
            this.gccFirstForm.patchValue({
              image: res.payload[0]
            });

            // clear temporary preview
            this.whatImage = "";
            this.authService.updateSection(this.gccFirstForm.value)
              .subscribe((res: any) => {
                if (res.isSuccess == true) {
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.spinner.hide();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else {
      this.authService.updateSection(this.gccFirstForm.value)
        .subscribe((res: any) => {
          if (res.isSuccess == true) {
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
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
    this.gccTabForm.reset();
    this.isEdit = false;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onSubmitTabData() {
    this.submitted = true;
    if (!this.gccTabForm.valid) {
      return false;
    }

    if (this.isEdit) {
      this.GCCTABEditService(this.editData)
      return;
    }

    this.gccTabForm.value.seq = this.getLength;
    this.gccTabForm.value.code = "GCCTAB";
    this.gccTabForm.value.header = '597f86b2-bb38-47b6-88ef-1ffc85bf1097';
    this.authService.createSection(this.gccTabForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.gccTabForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  editTabName(data, content) {
    this.editData = data;
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.isEdit = true;
    this.sectionId = data['id'];

    this.gccTabForm = this.fb.group({
      id: [data['id']],
      erTitle: [data['erTitle']],
      arTitle: [data['arTitle']],
      seq: [data['seq']],
      code: [data['code']],
      header: [data['header'].id],
    });
  }

  GCCTABEditService(data) {
    this.authService.updateSection(this.gccTabForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.gccTabForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
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
          this.gccTabForm.reset();
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }
}

