import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
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
  sure: any;
  revert: any;
  yesDelete: any;
  deleted: any;
  fileConfirm: any;
  cancel: any;
  ok: any;
  getValue = [];
  getLength: any;
  projectParamsId: any;
  getSectionData: any;
  getTitle: any;
  getArTitle: any;
  projectDetForm: FormGroup;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  whatImage: any;
  getSec: any;
  iconImgIDd = [];

  isEdit = false;
  submitted = false;
  projImg: any;
  projImgUpload: any;
  prjImgFileUploaded: any;
  projImages = [];
  projImgLength = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  editData:any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,) {
    this.projectDetForm = this.fb.group({
      seq: [''], code: [''], erContent: [''], arContent: [''], header: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectParamsId = params['id'];
    });

    const object = {
      relations: ["header", "images"],
      filter: {
        id: this.projectParamsId
      },
      sort: { seq: "ASC" }
    }

    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getSectionData = res.payload;
        this.getTitle = this.getSectionData[0].erTitle;
        this.getArTitle = this.getSectionData[0].arTitle;
        this.getSec = this.getSectionData[0].seq;
        this.projectDetForm = this.fb.group({
          id: this.getSectionData[0].id,
          seq: this.getSectionData[0].seq,
          code: this.getSectionData[0].code,
          erContent: this.getSectionData[0].erContent,
          arContent: this.getSectionData[0].arContent,
          header: this.getSectionData[0].header.id,
        });
        var seq1Value = this.getSectionData[0]?.images.filter(element => {
          return element.seq === 1;
        })
        this.iconImg = seq1Value[0]?.path;
        this.iconImgIDd = [seq1Value[0]?.id];
        this.projImgLength = [this.getSectionData[0].images.length];
        // console.log("fe",this.projImgLength)
        var imagArray = this.getSectionData[0]?.images.filter(item => item.seq !== 0 && item.seq !==1)
        this.projImages = imagArray?.sort(function (first, second) {
          return first.seq - second.seq;
        });
        // console.log("fef",this.projImages)
        this.dataSource = new MatTableDataSource(this.projImages);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });
      this.displayedColumns = ['index', 'path', 'rowActionToggle', 'rowActionIcon'];
  }

  uploadImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
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
    this.fileImgUpload = "";
  }

  onSubmitDetailsData() {
    if (!this.iconImg) {
      if (this.fileImgUpload) {
        this.spinner.show();
        const formData = new FormData();
        formData.append('images', this.fileImgUpload)
        formData.append('section_id', this.projectParamsId,)
        formData.append('seqs', '[1]')
        formData.append('ids', '[]')

        this.authService.uploadImage(formData)
          .subscribe((res: any) => {
            if (res.code == 200) {
              this.iconImg = res.payload[0].path;
              this.authService.updateSection(this.projectDetForm.value)
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
        this.authService.updateSection(this.projectDetForm.value)
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
    } else {
      if (this.fileImgUpload) {
        this.spinner.show();
        const formData = new FormData();
        formData.append('images', this.fileImgUpload)
        formData.append('section_id', this.projectParamsId,)
        formData.append('seqs', '[1]')
        formData.append('ids', JSON.stringify(this.iconImgIDd))

        this.authService.uploadImage(formData)
          .subscribe((res: any) => {
            if (res.code == 200) {
              this.iconImg = res.payload[0].path;
              this.authService.updateSection(this.projectDetForm.value)
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
        this.authService.updateSection(this.projectDetForm.value)
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
    this.projImg = null;
    this.projImgUpload = null;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  removeProjectImges() {
    this.projImg = "";
    this.prjImgFileUploaded = "";
    this.projImgUpload = "";
  }

  uploadProjFile(event) {
    const file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.projImgUpload = event.target.result;
    }
    this.prjImgFileUploaded = file;
  }

  onSubmitProjImageData() {
    this.submitted = true;
    if (!this.isEdit) {
      if (!(this.prjImgFileUploaded)) {
        return false;
      }
    }
    if (this.isEdit) {
      this.projImageUpdateService(this.editData)
      return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('images', this.prjImgFileUploaded)
    formData.append('section_id', this.projectParamsId)
    formData.append('seqs', JSON.stringify(this.projImgLength))
    formData.append('ids', '[]')
    this.authService.uploadImage(formData)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.projImg = res.payload[0].path;
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.spinner.hide();
          this.prjImgFileUploaded = null;
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      });
  }

  editProjImages(data,content){
    this.projImgUpload = null;
    this.editData = data;
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.prjImgFileUploaded = null;
    this.projImg = data.path;
  }

  projImageUpdateService(data){
    if (this.prjImgFileUploaded) {
      this.spinner.show();
      const array: any = [];
      array.push(data['id']);
      const seqArray = [];
      seqArray.push(data['seq']);

      const formData = new FormData();
      formData.append('images', this.prjImgFileUploaded)
      formData.append('section_id', this.projectParamsId)
      formData.append('seqs', JSON.stringify(seqArray))
      formData.append('ids', JSON.stringify(array))
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.projImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.submitted = false;
            this.spinner.hide();
            this.projectParamsId = null;
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
