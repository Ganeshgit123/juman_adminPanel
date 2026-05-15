import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    editable: true, spellcheck: true, height: '200px', minHeight: '0',
    maxHeight: '200px', width: 'auto', minWidth: '0', translate: 'yes',
    enableToolbar: true, showToolbar: true, sanitize: false,
    placeholder: 'Enter text here...', defaultParagraphSeparator: '',
    defaultFontName: '', defaultFontSize: '',
    fonts: [{ class: 'Noto Sans', name: 'Noto Sans' }],
    toolbarHiddenButtons: [['link', 'unlink', 'insertImage', 'insertVideo',
      'strikeThrough', 'subscript', 'superscript']]
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
  sectionId: any;
  whatImage: any;
  editData: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild('fileInput') fileInput: ElementRef; // ✅ Added

  constructor(
    private modalService: NgbModal, public fb: FormBuilder,
    public authService: AuthService, private toastr: ToastrService,
    private router: Router, private spinner: NgxSpinnerService,
  ) {
    this.strategyHeadForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], header: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: { code: "INVEST" },
      sort: { seq: "ASC" }
    }

    this.authService.getSectionsByHeaderId(object).subscribe((res: any) => {
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
      filter: { code: "STRAGY" },
      sort: { seq: "ASC" }
    }

    this.authService.getSectionsByHeaderId(data).subscribe((res: any) => {
      this.getValue = res.payload;
      this.dataSource = new MatTableDataSource(this.getValue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.invsetStrategyForm = this.fb.group({
      erTitle: ['', [Validators.required]],
      arTitle: ['', [Validators.required]],
      erContent: ['', [Validators.required]],
      arContent: ['', [Validators.required]],
    });

    this.displayedColumns = ['index', 'erTitle', 'arTitle', 'erContent',
      'arContent', 'path', 'rowActionToggle', 'rowActionIcon'];
  }

  get f() { return this.invsetStrategyForm.controls; }

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
    this.whatImage = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
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
    this.authService.updateSection(this.strategyHeadForm.value).subscribe((res: any) => {
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
    this.submitted = false;
    this.resetImageState(); // ✅ Replaced manual null assignments
    this.modalService.open(content, { centered: true, size: 'xl' });
  }

  removeImg() {
    this.resetImageState(); // ✅ Replaced empty string assignments
  }

  checkFileFormat(checkFile) {
    if (
      checkFile.type == 'image/webp' || checkFile.type == 'image/png' ||
      checkFile.type == 'image/jpeg' || checkFile.type == 'image/svg+xml' ||
      checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'
    ) {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    var valid = this.checkFileFormat(file);
    if (!valid) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => { this.whatImage = e.target.result; }
      this.fileImgUpload = file;
    }
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.isEdit && !(this.invsetStrategyForm.valid && this.fileImgUpload)) {
      return false;
    }

    if (this.isEdit) {
      this.investStrategyEditService(this.editData);
      return;
    }

    this.spinner.show();
    this.invsetStrategyForm.value.seq = this.getLength;
    this.invsetStrategyForm.value.code = "STRAGY";
    this.invsetStrategyForm.value.header = '8f94b895-b239-48c1-af46-c0304acbb32f';

    this.authService.createSection(this.invsetStrategyForm.value).subscribe((res: any) => {
      if (res.isSuccess == true) {
        const section_id = res.payload.id;
        if (this.fileImgUpload) {
          const formData = new FormData();
          formData.append('images', this.fileImgUpload);
          formData.append('section_id', section_id);
          formData.append('seqs', '[0]');
          formData.append('ids', '[]');

          this.authService.uploadImage(formData).subscribe((res: any) => {
            if (res.code == 200) {
              this.toastr.success('Success ', 'Updated Successfully');
              this.submitted = false;
              this.spinner.hide();
              this.invsetStrategyForm.reset();
              this.resetImageState(); // ✅ Clears stale file after create upload
              this.modalService.dismissAll();
              this.ngOnInit();
            }
          });
        } else {
          this.submitted = false;
          this.invsetStrategyForm.reset();
          this.resetImageState(); // ✅ Clears state even without image
          this.spinner.hide();
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      } else {
        this.toastr.error('Enter valid ', 'Error');
      }
    });
  }

  editStrategy(data, content) {
    this.editData = data;
    this.resetImageState(); // ✅ Replaced duplicate manual null assignments
    this.isEdit = true;
    this.submitted = false;
    this.sectionId = data['id'];
    this.iconImg = data.images[0].path; // set after reset since reset nullifies iconImg

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

    this.modalService.open(content, { centered: true, size: 'xl' });
  }

  investStrategyEditService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const array = [data.images[0].id]; // ✅ Simplified array construction

      const formData = new FormData();
      formData.append('images', this.fileImgUpload);
      formData.append('section_id', this.sectionId);
      formData.append('seqs', data['seq']);
      formData.append('ids', JSON.stringify(array));

      this.authService.uploadImage(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.authService.updateSection(this.invsetStrategyForm.value).subscribe((res: any) => {
            if (res.isSuccess == true) {
              this.toastr.success('Success ', 'Updated Successfully');
              this.submitted = false;
              this.spinner.hide();
              this.invsetStrategyForm.reset();
              this.resetImageState(); // ✅ Clears stale file after edit upload
              this.modalService.dismissAll();
              this.ngOnInit();
            } else {
              this.toastr.error('Enter valid ', 'Error');
            }
          });
        }
      });
    } else {
      this.authService.updateSection(this.invsetStrategyForm.value).subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.invsetStrategyForm.reset();
          this.resetImageState(); // ✅ Clears state on edit without new image
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
    }
  }

  changeStatus(value) {
    const object = {
      id: value.id,
      isActive: !value.isActive // ✅ Simplified toggle
    }
    this.authService.updateSection(object).subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', 'Error');
      }
    });
  }
}