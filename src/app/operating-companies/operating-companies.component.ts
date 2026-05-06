import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-operating-companies',
  templateUrl: './operating-companies.component.html',
  styleUrls: ['./operating-companies.component.scss']
})
export class OperatingCompaniesComponent implements OnInit {
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
  gerFlowCompForm: FormGroup;
  getValue: any;
  gerUpload: any;
  gerFlowLogo: any;
  gerFileImgUpload: any;
  gerCompImg: any;
  getCompUpload: any;
  gerCompImgUpload: any;

  usgMeCompForm: FormGroup;
  usgMeLogoUpload: any;
  usgMeLogo: any;
  usgMeLogoUploadedFile: any;
  usgMeCompImg: any;
  usgMeCompUpload: any;
  usgMeCompanyUploadedFile: any;

  bostikCompForm: FormGroup;
  bostikLogo: any;
  bostikLogoupload: any;
  boxtikLogoUploadFile: any;
  bostikCompImg: any;
  boxtikCompUpload: any;
  boxtikCompanyUploadFile: any;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.gerFlowCompForm = this.fb.group({
      seq: [''], code: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.usgMeCompForm = this.fb.group({
      seq: [''], code: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.bostikCompForm = this.fb.group({
      seq: [''], code: [''], erContent: [''], arContent: [''], header: [''],
    });
  }
  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "93033b65-6a67-4b14-8033-8e2a0ad4964c" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.gerFlowCompForm = this.fb.group({
          id: [this.getValue[0].id],
          seq: [this.getValue[0].seq],
          code: [this.getValue[0].code],
          erContent: [this.getValue[0].erContent],
          arContent: [this.getValue[0].arContent],
          header: [this.getValue[0].header.id],
          image: [this.getValue[0]?.images[0]],
        });
        var gerFlowSeq0 = this.getValue[0]?.images.filter(element => {
          return element.seq === 0;
        })
        this.gerFlowLogo = gerFlowSeq0[0]?.path;

        var gerFlowSeq1 = this.getValue[0]?.images.filter(element => {
          return element.seq === 1;
        })
        this.gerCompImg = gerFlowSeq1[0]?.path;

        this.usgMeCompForm = this.fb.group({
          id: [this.getValue[1].id],
          seq: [this.getValue[1].seq],
          code: [this.getValue[1].code],
          erContent: [this.getValue[1].erContent],
          arContent: [this.getValue[1].arContent],
          header: [this.getValue[1].header.id],
          image: [this.getValue[1]?.images[0]],
        });
        var usageMeSeq0 = this.getValue[1]?.images.filter(element => {
          return element.seq === 0;
        })
        this.usgMeLogo = usageMeSeq0[0]?.path;

        var usageMeSeq1 = this.getValue[1]?.images.filter(element => {
          return element.seq === 1;
        })
        this.usgMeCompImg = usageMeSeq1[0]?.path;

        this.bostikCompForm = this.fb.group({
          id: [this.getValue[2].id],
          seq: [this.getValue[2].seq],
          code: [this.getValue[2].code],
          erContent: [this.getValue[2].erContent],
          arContent: [this.getValue[2].arContent],
          header: [this.getValue[2].header.id],
          image: [this.getValue[2]?.images[0]],
        });

        var bostikSeq0 = this.getValue[2]?.images.filter(element => {
          return element.seq === 0;
        })
        this.bostikLogo = bostikSeq0[0]?.path;

        var bostikSeq1 = this.getValue[2]?.images.filter(element => {
          return element.seq === 1;
        })
        this.bostikCompImg = bostikSeq1[0]?.path;
      });
  }

  uploadGerFlowImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.gerUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.gerFileImgUpload = file;
    }
  }

  removeGerFlowImg() {
    this.gerFlowLogo = "";
    this.gerFileImgUpload = "";
    this.gerUpload = "";
  }

  uploadGerCompanyImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.getCompUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.gerCompImgUpload = file;
    }
  }

  removeGerCompanyImg() {
    this.gerCompImg = "";
    this.gerCompImgUpload = "";
    this.getCompUpload = "";
  }

  onSubmitGerFlowFormData() {
    if (this.gerFileImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gerFileImgUpload)
      formData.append('section_id', 'af053cb0-6e23-4870-b6f9-a22e752962a6',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["9bf0e05b-29a6-44ee-b2af-21933ddd0cd5"]')
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowLogo = res.payload[0].path;

            this.authService.updateSection(this.gerFlowCompForm.value)
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
    } else if (this.gerCompImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gerCompImgUpload)
      formData.append('section_id', 'af053cb0-6e23-4870-b6f9-a22e752962a6',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["71f3752f-03a1-493a-9916-8e91ad34e002"]')
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerCompImg = res.payload[0].path;

            this.authService.updateSection(this.gerFlowCompForm.value)
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
    } else if (this.gerFileImgUpload && this.gerCompImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gerFileImgUpload)
      formData.append('section_id', 'af053cb0-6e23-4870-b6f9-a22e752962a6',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["9bf0e05b-29a6-44ee-b2af-21933ddd0cd5"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowLogo = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.gerCompImgUpload)
            formData.append('section_id', 'af053cb0-6e23-4870-b6f9-a22e752962a6',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["71f3752f-03a1-493a-9916-8e91ad34e002"]')
            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.gerCompImg = res.payload[0].path;

                  this.authService.updateSection(this.gerFlowCompForm.value)
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
          }
        });
    } else {
      this.authService.updateSection(this.gerFlowCompForm.value)
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

  uploadUsgMeLogoFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.usgMeLogoUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.usgMeLogoUploadedFile = file;
    }
  }

  removeUsgMeLogoImg() {
    this.usgMeLogo = "";
    this.usgMeLogoUploadedFile = "";
    this.usgMeLogoUpload = "";
  }

  uploadUsgMeCompanyFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.usgMeCompUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.usgMeCompanyUploadedFile = file;
    }
  }

  removeUsgMeCompanyImg() {
    this.usgMeCompImg = "";
    this.usgMeCompanyUploadedFile = "";
    this.usgMeCompUpload = "";
  }

  onSubmitUsgMeFormData() {
    if (this.usgMeLogoUploadedFile) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.usgMeLogoUploadedFile)
      formData.append('section_id', '8b46b06c-cac0-4a39-bb6d-1ac77eac9411',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["cffdcecc-0bd0-47a4-add9-5082eb7e50bc"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.usgMeLogo = res.payload[0].path;
            this.authService.updateSection(this.usgMeCompForm.value)
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
    } else if (this.usgMeCompanyUploadedFile) {
      const formData = new FormData();
      formData.append('images', this.usgMeCompanyUploadedFile)
      formData.append('section_id', '8b46b06c-cac0-4a39-bb6d-1ac77eac9411',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["98ce1635-5f22-445a-a86a-fc6ff0c576fb"]')
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.usgMeCompImg = res.payload[0].path;

            this.authService.updateSection(this.usgMeCompForm.value)
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
    } else if (this.usgMeLogoUploadedFile && this.usgMeCompanyUploadedFile) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.usgMeLogoUploadedFile)
      formData.append('section_id', '8b46b06c-cac0-4a39-bb6d-1ac77eac9411',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["cffdcecc-0bd0-47a4-add9-5082eb7e50bc"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.usgMeLogo = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.usgMeCompanyUploadedFile)
            formData.append('section_id', '8b46b06c-cac0-4a39-bb6d-1ac77eac9411',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["9997e418-0765-46e1-bc26-7064bdcce7d4"]')
            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.usgMeCompImg = res.payload[0].path;

                  this.authService.updateSection(this.usgMeCompForm.value)
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
          }
        });
    } else {
      this.authService.updateSection(this.usgMeCompForm.value)
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

  uploadBostikLogoFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.bostikLogoupload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.boxtikLogoUploadFile = file;
    }
  }

  removeBostikLogoImg() {
    this.bostikLogo = "";
    this.boxtikLogoUploadFile = "";
    this.bostikLogoupload = "";
  }

  uploadBostikCompanyFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.boxtikCompUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.boxtikCompanyUploadFile = file;
    }
  }

  removeBostikCompanyImg() {
    this.bostikCompImg = "";
    this.boxtikCompanyUploadFile = "";
    this.boxtikCompUpload = ""; 
  }

  onSubmitBostikFormData() {
    if (this.boxtikLogoUploadFile) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.boxtikLogoUploadFile)
      formData.append('section_id', '334e88d1-d896-45d6-bb98-2e2b1282e93a',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["473811e1-3c07-4f2b-8a6b-4ad6f9e0c2aa"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.bostikLogo = res.payload[0].path;
            this.authService.updateSection(this.bostikCompForm.value)
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
    } else if (this.boxtikCompanyUploadFile) {
      const formData = new FormData();
      formData.append('images', this.boxtikCompanyUploadFile)
      formData.append('section_id', '334e88d1-d896-45d6-bb98-2e2b1282e93a',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["eeb9b933-7a6c-4848-b02a-a8848e27d874"]')
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.bostikCompImg = res.payload[0].path;

            this.authService.updateSection(this.bostikCompForm.value)
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
    } else if (this.boxtikLogoUploadFile && this.boxtikCompanyUploadFile) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.boxtikLogoUploadFile)
      formData.append('section_id', '334e88d1-d896-45d6-bb98-2e2b1282e93a',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["473811e1-3c07-4f2b-8a6b-4ad6f9e0c2aa"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.bostikLogo = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.boxtikCompanyUploadFile)
            formData.append('section_id', '334e88d1-d896-45d6-bb98-2e2b1282e93a',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["eeb9b933-7a6c-4848-b02a-a8848e27d874"]')
            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.bostikCompImg = res.payload[0].path;

                  this.authService.updateSection(this.bostikCompForm.value)
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
          }
        });
    } else {
      this.authService.updateSection(this.bostikCompForm.value)
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
