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
  selector: 'app-board-director',
  templateUrl: './board-director.component.html',
  styleUrls: ['./board-director.component.scss']
})
export class BoardDirectorComponent implements OnInit {
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

  charimanForm: FormGroup;
  ceoForm: FormGroup;
  boardHeadForm: FormGroup;
  getValue: any;
  chairManVal = [];
  CEOVal = [];
  headVal = [];
  boAddVAl = [];
  boardADDForm: FormGroup;

  chairmanImg = null;
  fileImgUpload: any;
  chairUploadImg: any;

  ceoImg = null;
  ceoUploadImg: any;
  ceoImgUploaded: any;

  execDirImg = null;
  execUploadImg: any;
  execDirImgUploaded: any;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.charimanForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      sectionHead: [''], sectionHeadAr: [''],
    });
    this.ceoForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      sectionHead: [''], sectionHeadAr: [''],
    });
    // this.boardHeadForm = this.fb.group({
    //   seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    //   sectionHead: [''], sectionHeadAr: [''],
    // });
    this.boardADDForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      sectionHead: [''], sectionHeadAr: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "3f6ce278-c5c8-4475-83fc-612ad4f7de8e" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.chairManVal = this.getValue.filter(element => {
          return element.code === 'CHAIRM';
        })
        this.charimanForm = this.fb.group({
          id: [this.chairManVal[0].id],
          seq: [this.chairManVal[0].seq],
          code: [this.chairManVal[0].code],
          erTitle: [this.chairManVal[0].erTitle],
          arTitle: [this.chairManVal[0].arTitle],
          erContent: [this.chairManVal[0].erContent],
          arContent: [this.chairManVal[0].arContent],
          header: [this.chairManVal[0].header.id],
          sectionHead: [this.chairManVal[0]?.additionalInfo?.sectionHead],
          sectionHeadAr: [this.chairManVal[0]?.additionalInfo?.sectionHeadAr],
        });
        this.chairmanImg = this.chairManVal[0]?.images[0]?.path;

        this.CEOVal = this.getValue.filter(element => {
          return element.code === 'BOCEO';
        })
        this.ceoForm = this.fb.group({
          id: [this.CEOVal[0].id],
          seq: [this.CEOVal[0].seq],
          code: [this.CEOVal[0].code],
          erTitle: [this.CEOVal[0].erTitle],
          arTitle: [this.CEOVal[0].arTitle],
          erContent: [this.CEOVal[0].erContent],
          arContent: [this.CEOVal[0].arContent],
          header: [this.CEOVal[0].header.id],
          sectionHead: [this.CEOVal[0]?.additionalInfo?.sectionHead],
          sectionHeadAr: [this.CEOVal[0]?.additionalInfo?.sectionHeadAr],
        });
        this.ceoImg = this.CEOVal[0]?.images[0]?.path;
        // this.headVal = this.getValue.filter(element => {
        //   return element.code === 'BOHEAD';
        // })
        // this.boardHeadForm = this.fb.group({
        //   id: [this.headVal[0].id],
        //   seq: [this.headVal[0].seq],
        //   code: [this.headVal[0].code],
        //   erTitle: [this.headVal[0].erTitle],
        //   arTitle: [this.headVal[0].arTitle],
        //   erContent: [this.headVal[0].erContent],
        //   arContent: [this.headVal[0].arContent],
        //   header: [this.headVal[0].header.id],
        //   sectionHead: [this.headVal[0].additionalInfo.sectionHead],
        //   sectionHeadAr: [this.headVal[0].additionalInfo.sectionHeadAr],
        // });

        this.boAddVAl = this.getValue.filter(element => {
          return element.code === 'BOADD';
        })
        this.boardADDForm = this.fb.group({
          id: [this.boAddVAl[0].id],
          seq: [this.boAddVAl[0].seq],
          code: [this.boAddVAl[0].code],
          erTitle: [this.boAddVAl[0].erTitle],
          arTitle: [this.boAddVAl[0].arTitle],
          erContent: [this.boAddVAl[0].erContent],
          arContent: [this.boAddVAl[0].arContent],
          header: [this.boAddVAl[0].header.id],
          sectionHead: [this.boAddVAl[0]?.additionalInfo?.sectionHead],
          sectionHeadAr: [this.boAddVAl[0]?.additionalInfo?.sectionHeadAr],
        });
        this.execDirImg = this.boAddVAl[0]?.images[0]?.path;
      });
  }

  onSubmitHeadSec() {
    this.authService.updateSection(this.boardHeadForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  uploadImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.chairUploadImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
  }

  removeImg() {
    this.chairmanImg = "";
    this.fileImgUpload = "";
  }

  onSubmitChairmanSec() {
    const object = {
      id: this.charimanForm.value.id,
      seq: this.charimanForm.value.seq,
      code: this.charimanForm.value.code,
      erTitle: this.charimanForm.value.erTitle,
      arTitle: this.charimanForm.value.arTitle,
      erContent: this.charimanForm.value.erContent,
      arContent: this.charimanForm.value.arContent,
      header: this.charimanForm.value.header,
      additionalInfo: {
        sectionHead: this.charimanForm.value.sectionHead,
        sectionHeadAr: this.charimanForm.value.sectionHeadAr,
      }
    }

    if (this.fileImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', '0c46a497-8fa6-4bfe-9567-ded5fc9136b6',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["f17ffb10-4338-47b7-9969-3a5b2805494f"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.chairmanImg = res.payload[0].path;
            this.authService.updateSection(object)
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

  uploadCeoImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.ceoUploadImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.ceoImgUploaded = file;
    }
  }

  removeCEOImg() {
    this.ceoImg = "";
    this.ceoImgUploaded = "";
  }

  onSubmitCeoSec() {
    const object = {
      id: this.ceoForm.value.id,
      seq: this.ceoForm.value.seq,
      code: this.ceoForm.value.code,
      erTitle: this.ceoForm.value.erTitle,
      arTitle: this.ceoForm.value.arTitle,
      erContent: this.ceoForm.value.erContent,
      arContent: this.ceoForm.value.arContent,
      header: this.ceoForm.value.header,
      additionalInfo: {
        sectionHead: this.ceoForm.value.sectionHead,
        sectionHeadAr: this.ceoForm.value.sectionHeadAr,
      }
    }
    if (this.ceoImgUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.ceoImgUploaded)
      formData.append('section_id', '9a38c0b7-0475-4b67-b522-bd245192a49d',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["9bc73c24-36b1-445d-91e1-3fea11411636"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.ceoImg = res.payload[0].path;
            this.authService.updateSection(object)
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

  uploadExecDirecImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.execUploadImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.execDirImgUploaded = file;
    }
  }

  removeExecDirectImg() {
    this.execDirImg = "";
    this.execDirImgUploaded = "";
  }

  onSubmitBODADDSec() {
    const object = {
      id: this.boardADDForm.value.id,
      seq: this.boardADDForm.value.seq,
      code: this.boardADDForm.value.code,
      erTitle: this.boardADDForm.value.erTitle,
      arTitle: this.boardADDForm.value.arTitle,
      erContent: this.boardADDForm.value.erContent,
      arContent: this.boardADDForm.value.arContent,
      header: this.boardADDForm.value.header,
      additionalInfo: {
        sectionHead: this.boardADDForm.value.sectionHead,
        sectionHeadAr: this.boardADDForm.value.sectionHeadAr,
      }
    }
    if (this.execDirImgUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.execDirImgUploaded)
      formData.append('section_id', '14777ca6-7e0a-4d9c-af86-c9747dbf6dea',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["a5d77a3e-b94a-41ff-ac60-c5cf1d45fb4b"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.ceoImg = res.payload[0].path;
            this.authService.updateSection(object)
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
}
