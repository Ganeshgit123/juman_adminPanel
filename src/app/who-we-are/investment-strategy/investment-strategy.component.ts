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
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-investment-strategy',
  templateUrl: './investment-strategy.component.html',
  styleUrls: ['./investment-strategy.component.scss']
})
export class InvestmentStrategyComponent implements OnInit {
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
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  strategyHeadForm: FormGroup;
  getLength: any;
  getValue = [];

  invsetStrategyForm: FormGroup;
  isEdit = false;
  submitted = false;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  sectionId: any;
  whatImage: any;
  editData: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.strategyHeadForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], header: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        code: "INVEST"
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        const getList = res.payload;
        this.strategyHeadForm = this.fb.group({
          id: [getList[0].id],
          seq: [getList[0].seq],
          code: [getList[0].code],
          erTitle: [getList[0].erTitle],
          arTitle: [getList[0].arTitle],
          header: [getList[0].header.id],
        });
        this.getLength = getList.length;
      });

    const data = {
      relations: ["header", "images"],
      filter: {
        code: "STRAGY"
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(data).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.dataSource = new MatTableDataSource(this.getValue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      })

    this.invsetStrategyForm = this.fb.group({
      erTitle: ['', [Validators.required]],
      arTitle: ['', [Validators.required]],
      erContent: ['', [Validators.required]],
      arContent: ['', [Validators.required]],
    });

    this.displayedColumns = ['index', 'erTitle', 'arTitle', 'erContent', 'arContent', 'path', 'rowActionToggle', 'rowActionIcon'];

  }

  get f() { return this.invsetStrategyForm.controls; }

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

  onSubmitInvestHeadSect() {
    this.authService.updateSection(this.strategyHeadForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  openModal(content) {
    this.invsetStrategyForm.reset();
    this.isEdit = false;
    this.whatImage = null;
    this.iconImg = null;
    this.modalService.open(content, { centered: true, size: 'xl' });
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
    this.submitted = true;
    if (!this.isEdit) {
      if (!(this.invsetStrategyForm.valid && this.fileImgUpload)) {
        return false;
      }
    }

    if (this.isEdit) {
      this.investStrategyEditService(this.editData)
      return;
    }
    this.spinner.show();
    this.invsetStrategyForm.value.seq = this.getLength;
    this.invsetStrategyForm.value.code = "STRAGY";
    this.invsetStrategyForm.value.header = '8f94b895-b239-48c1-af46-c0304acbb32f';
    this.authService.createSection(this.invsetStrategyForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          const section_id = res.payload.id;
          if (this.fileImgUpload) {
            const formData = new FormData();
            formData.append('images', this.fileImgUpload)
            formData.append('section_id', section_id,)
            formData.append('seqs', '[0]')
            formData.append('ids', '[]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.iconImg = res.payload[0].path;
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.submitted = false;
                  this.invsetStrategyForm.reset();
                  this.spinner.hide();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                }
              });
          } else {
            this.submitted = false;
            this.invsetStrategyForm.reset();
            this.modalService.dismissAll();
            this.spinner.hide();
            this.ngOnInit();
          }
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  editStrategy(data, content) {
    this.whatImage = null;
    this.fileImgUpload = null;
    this.editData = data;
    this.modalService.open(content, { centered: true, size: 'xl' });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.sectionId = data['id'];
    this.iconImg = data.images[0].path;

    this.invsetStrategyForm = this.fb.group({
      id: [data['id']],
      erTitle: [data['erTitle']],
      arTitle: [data['arTitle']],
      erContent: [data['erContent']],
      arContent: [data['arContent']],
      seq: [data['seq']],
      code: [data['code']],
      header: [data['header'].id],
    });
  }

  investStrategyEditService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const array: any = [];
      array.push(data.images[0].id);

      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', this.sectionId)
      formData.append('seqs', data['seq'])
      formData.append('ids', JSON.stringify(array))
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;
            // console.log("formdata",this.projectForm.value)
            this.authService.updateSection(this.invsetStrategyForm.value)
              .subscribe((res: any) => {
                if (res.isSuccess == true) {
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.submitted = false;
                  this.spinner.hide();
                  this.invsetStrategyForm.reset();
                  this.modalService.dismissAll();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else {
      this.authService.updateSection(this.invsetStrategyForm.value)
        .subscribe((res: any) => {
          if (res.isSuccess == true) {
            this.toastr.success('Success ', 'Updated Successfully');
            this.submitted = false;
            this.invsetStrategyForm.reset();
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

    const object = { isActive: visible, id: value.id }
    this.authService.updateSection(object)
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
