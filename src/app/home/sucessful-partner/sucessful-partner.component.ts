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
  selector: 'app-sucessful-partner',
  templateUrl: './sucessful-partner.component.html',
  styleUrls: ['./sucessful-partner.component.scss']
})
export class SucessfulPartnerComponent implements OnInit {
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
  partnerForm: FormGroup;
  getValue: any;
  isEdit = false;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  logoImages = [];
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  submitted = false;
  whatImage: any;
  sectionId: any;
  logoImgLength = [];
  editData: any;
  partnerSec = [];

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.partnerForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "d0001922-3379-4f30-8c77-531571649537" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.partnerSec = this.getValue.filter(element => {
          return element.code === 'PARTNE';
        })
        this.partnerForm = this.fb.group({
          id: [this.partnerSec[0].id],
          seq: [this.partnerSec[0].seq],
          code: [this.partnerSec[0].code],
          erTitle: [this.partnerSec[0].erTitle],
          arTitle: [this.partnerSec[0].arTitle],
          erContent: [this.partnerSec[0].erContent],
          arContent: [this.partnerSec[0].arContent],
          header: [this.partnerSec[0].header.id],
        });
        this.sectionId = this.partnerSec[0].id;
        this.logoImages = this.partnerSec[0].images.sort(function (first, second) {
          return first.seq - second.seq;
        });
        this.logoImgLength.push(this.logoImages.length);

        this.dataSource = new MatTableDataSource(this.logoImages);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    this.displayedColumns = ['index', 'path', 'rowActionToggle', 'rowActionIcon'];

  }

  onSubmitPartnerSect() {
    this.authService.updateSection(this.partnerForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
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
    this.modalService.open(content, { centered: true });
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
    formData.append('section_id', this.sectionId,)
    formData.append('seqs', JSON.stringify(this.logoImgLength))
    formData.append('ids', '[]')
    this.authService.uploadImage(formData)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.iconImg = res.payload[0].path;
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.iconImg = null;
          this.spinner.hide();
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      });
  }

  editLogos(data, content) {
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
      formData.append('section_id', this.sectionId)
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

    const object = { isActive: visible, id: value.id }
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
