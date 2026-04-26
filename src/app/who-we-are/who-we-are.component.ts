import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-who-we-are',
  templateUrl: './who-we-are.component.html',
  styleUrls: ['./who-we-are.component.scss']
})
export class WhoWeAreComponent implements OnInit {
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

  topSectionForm: FormGroup;
  whatWeDoForm: FormGroup;
  getValue: any;
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  whatImage: any;

  counterSecForm: FormGroup;

  ourVisionForm: FormGroup;
  visonImg: any;
  visionUpload: any;
  visionFileUploaded: any;

  visonImgAR: any;
  visionUploadAR: any;
  visionFileUploadedAR: any;

  ourMissionForm: any;
  missionImg: any;
  missionUpload: any;
  missionFileUpload: any;

  missionImgAR: any;
  missionUploadAR: any;
  missionFileUploadedAR: any;

  ourValuesForm: any;
  valuesImg: any;
  valuesUpload: any;
  valuesFileUploaded: any;

  valueImgAR: any;
  valueUploadAR: any;
  valueFileUploadedAR: any;

  interstedForm: FormGroup;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.topSectionForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], header: [''],
    });
    this.whatWeDoForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.counterSecForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], header: [''], firstValue: [''], firstContent: [''],
      arFirstContent: [''], secondValue: [''], secondContent: [''], arSecondContent: [''], thirdValue: [''],
      thirdContent: [''], arThirdContent: [''], firstValueAr: [''], secondValueAr: [''], thirdValueAr: [''],
      fourthValue: [''], fourthContent: [''], arFourthContent: [''], fourthValueAr: [''],
    });
    this.ourVisionForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.ourMissionForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.ourValuesForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.interstedForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      enString: [''], arString: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "8f94b895-b239-48c1-af46-c0304acbb32f" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.topSectionForm = this.fb.group({
          id: [this.getValue[0].id],
          seq: [this.getValue[0].seq],
          code: [this.getValue[0].code],
          erTitle: [this.getValue[0].erTitle],
          arTitle: [this.getValue[0].arTitle],
          header: [this.getValue[0].header.id],
        });

        this.whatWeDoForm = this.fb.group({
          id: [this.getValue[1].id],
          seq: [this.getValue[1].seq],
          code: [this.getValue[1].code],
          erTitle: [this.getValue[1].erTitle],
          arTitle: [this.getValue[1].arTitle],
          erContent: [this.getValue[1].erContent],
          arContent: [this.getValue[1].arContent],
          header: [this.getValue[1].header.id],
        });
        this.iconImg = this.getValue[1]?.images[0]?.path;

        this.counterSecForm = this.fb.group({
          id: [this.getValue[2].id],
          seq: [this.getValue[2].seq],
          code: [this.getValue[2].code],
          erTitle: [this.getValue[2].erTitle],
          arTitle: [this.getValue[2].arTitle],
          header: [this.getValue[2].header.id],
          firstValue: [this.getValue[2].additionalInfo?.firstValue],
          firstValueAr: [this.getValue[2].additionalInfo?.firstValueAr],
          firstContent: [this.getValue[2].additionalInfo?.firstContent],
          arFirstContent: [this.getValue[2].additionalInfo?.arFirstContent],
          secondValue: [this.getValue[2].additionalInfo?.secondValue],
          secondValueAr: [this.getValue[2].additionalInfo?.secondValueAr],
          secondContent: [this.getValue[2].additionalInfo?.secondContent],
          arSecondContent: [this.getValue[2].additionalInfo?.arSecondContent],
          thirdValue: [this.getValue[2].additionalInfo?.thirdValue],
          thirdValueAr: [this.getValue[2].additionalInfo?.thirdValueAr],
          thirdContent: [this.getValue[2].additionalInfo?.thirdContent],
          arThirdContent: [this.getValue[2].additionalInfo?.arThirdContent],
          fourthValue: [this.getValue[2].additionalInfo?.fourthValue],
          fourthValueAr: [this.getValue[2].additionalInfo?.fourthValueAr],
          fourthContent: [this.getValue[2].additionalInfo?.fourthContent],
          arFourthContent: [this.getValue[2].additionalInfo?.arFourthContent],
        });

        this.ourVisionForm = this.fb.group({
          id: [this.getValue[3].id],
          seq: [this.getValue[3].seq],
          code: [this.getValue[3].code],
          erTitle: [this.getValue[3].erTitle],
          arTitle: [this.getValue[3].arTitle],
          erContent: [this.getValue[3].erContent],
          arContent: [this.getValue[3].arContent],
          header: [this.getValue[3].header.id],
        });
        const zeroSeqVisoImg = this.getValue[3]?.images.filter(element => {
          return element.seq === 0;
        })
        const firstSeqVisoImg = this.getValue[3]?.images.filter(element => {
          return element.seq === 1;
        })
        this.visonImg = zeroSeqVisoImg[0]?.path;
        this.visonImgAR = firstSeqVisoImg[0]?.path;

        this.ourMissionForm = this.fb.group({
          id: [this.getValue[4].id],
          seq: [this.getValue[4].seq],
          code: [this.getValue[4].code],
          erTitle: [this.getValue[4].erTitle],
          arTitle: [this.getValue[4].arTitle],
          erContent: [this.getValue[4].erContent],
          arContent: [this.getValue[4].arContent],
          header: [this.getValue[4].header.id],
        });
        const zeroSeqMissionImg = this.getValue[4]?.images.filter(element => {
          return element.seq === 0;
        })
        const firstSeqMissionImg = this.getValue[4]?.images.filter(element => {
          return element.seq === 1;
        })
        this.missionImg = zeroSeqMissionImg[0]?.path;
        this.missionImgAR = firstSeqMissionImg[0]?.path;

        this.ourValuesForm = this.fb.group({
          id: [this.getValue[5].id],
          seq: [this.getValue[5].seq],
          code: [this.getValue[5].code],
          erTitle: [this.getValue[5].erTitle],
          arTitle: [this.getValue[5].arTitle],
          erContent: [this.getValue[5].erContent],
          arContent: [this.getValue[5].arContent],
          header: [this.getValue[5].header.id],
        });
        const zeroSeqValueImg = this.getValue[5]?.images.filter(element => {
          return element.seq === 0;
        })
        const firstSeqValueImg = this.getValue[5]?.images.filter(element => {
          return element.seq === 1;
        })
        this.valuesImg = zeroSeqValueImg[0]?.path;
        this.valueImgAR = firstSeqValueImg[0]?.path;

        this.interstedForm = this.fb.group({
          id: [this.getValue[6].id],
          seq: [this.getValue[6].seq],
          code: [this.getValue[6].code],
          erTitle: [this.getValue[6].erTitle],
          arTitle: [this.getValue[6].arTitle],
          erContent: [this.getValue[6].erContent],
          arContent: [this.getValue[6].arContent],
          header: [this.getValue[6].header.id],
          enString: [this.getValue[6].additionalInfo?.enString],
          arString: [this.getValue[6].additionalInfo?.arString],
        });
      });
  }

  onSubmitTopSectionData() {
    // console.log("fef",this.aboutForm.value)
    this.authService.updateSection(this.topSectionForm.value)
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

  onSubmitWhatWeDoData() {
    // console.log("fef",this.aboutForm.value)
    if (this.fileImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', 'ba653f8b-c2a7-4397-bf2b-2f101a0f91cf',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["86c14088-c6e9-4c4e-8aa7-51cde5a037e4"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;
            this.authService.updateSection(this.whatWeDoForm.value)
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
      this.authService.updateSection(this.whatWeDoForm.value)
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

  onSubmitCounterData() {
    const object = {
      id: this.counterSecForm.value.id,
      seq: this.counterSecForm.value.seq,
      code: this.counterSecForm.value.code,
      erTitle: this.counterSecForm.value.erTitle,
      arTitle: this.counterSecForm.value.arTitle,
      header: this.counterSecForm.value.header,
      additionalInfo: {
        firstContent: this.counterSecForm.value.firstContent,
        arFirstContent: this.counterSecForm.value.arFirstContent,
        firstValue: this.counterSecForm.value.firstValue,
        firstValueAr: this.counterSecForm.value.firstValueAr,
        secondContent: this.counterSecForm.value.secondContent,
        arSecondContent: this.counterSecForm.value.arSecondContent,
        secondValue: this.counterSecForm.value.secondValue,
        secondValueAr: this.counterSecForm.value.secondValueAr,
        thirdContent: this.counterSecForm.value.thirdContent,
        arThirdContent: this.counterSecForm.value.arThirdContent,
        thirdValue: this.counterSecForm.value.thirdValue,
        thirdValueAr: this.counterSecForm.value.thirdValueAr,
        fourthValue: this.counterSecForm.value.fourthValue,
        fourthValueAr: this.counterSecForm.value.fourthValueAr,
        fourthContent: this.counterSecForm.value.fourthContent,
        arFourthContent: this.counterSecForm.value.arFourthContent,
      }
    }
    // console.log("fef", object)

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

  uploadVisionImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.visionUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.visionFileUploaded = file;
    }
  }

  removeVisionFileImg() {
    this.visonImg = "";
    this.visionFileUploaded = "";
  }

  uploadVisionARImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.visionUploadAR = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.visionFileUploadedAR = file;
    }
  }

  removeVisionARFileImg() {
    this.visonImgAR = "";
    this.visionFileUploadedAR = "";
  }

  onSubmitVisionData() {
    if (this.visionFileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.visionFileUploaded)
      formData.append('section_id', 'e2fcf3df-2773-4fba-a987-9b3513c24188',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["37f29a8d-712e-4322-b623-6da4f7dc453c"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.visonImg = res.payload[0].path;
            this.authService.updateSection(this.ourVisionForm.value)
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
    } else if (this.visionFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.visionFileUploadedAR)
      formData.append('section_id', 'e2fcf3df-2773-4fba-a987-9b3513c24188',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["4dfbb8c4-148c-4108-b2ea-86ded1aacad2"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.visonImgAR = res.payload[0].path;
            this.authService.updateSection(this.ourVisionForm.value)
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
    else if (this.visionFileUploaded && this.visionFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.visionFileUploaded)
      formData.append('section_id', 'e2fcf3df-2773-4fba-a987-9b3513c24188',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["37f29a8d-712e-4322-b623-6da4f7dc453c"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.visonImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.visionFileUploadedAR)
            formData.append('section_id', 'e2fcf3df-2773-4fba-a987-9b3513c24188',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["4dfbb8c4-148c-4108-b2ea-86ded1aacad2"]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.visonImgAR = res.payload[0].path;

                  this.authService.updateSection(this.ourVisionForm.value)
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
    }
    else {
      this.authService.updateSection(this.ourVisionForm.value)
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

  uploadMissionImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.missionUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.missionFileUpload = file;
    }
  }

  removeMissionFileImg() {
    this.missionImg = "";
    this.missionFileUpload = "";
  }

  uploadMissionARImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.missionUploadAR = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.missionFileUploadedAR = file;
    }
  }

  removeMissionARFileImg() {
    this.missionImgAR = "";
    this.missionFileUploadedAR = "";
  }

  onSubmitMissionData() {
    if (this.missionFileUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.missionFileUpload)
      formData.append('section_id', '8a71555b-f8ca-4efa-aed0-9f0fb90f5511',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["afd608ce-f7fb-4bee-9ed1-669773155251"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.missionImg = res.payload[0].path;
            this.authService.updateSection(this.ourMissionForm.value)
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
    } else if (this.missionFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.missionFileUploadedAR)
      formData.append('section_id', '8a71555b-f8ca-4efa-aed0-9f0fb90f5511',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["0aaaf6fe-f768-44b8-9315-ad1253f3c3e6"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.missionImgAR = res.payload[0].path;
            this.authService.updateSection(this.ourMissionForm.value)
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
    } else if (this.missionFileUpload && this.missionFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.missionFileUpload)
      formData.append('section_id', '8a71555b-f8ca-4efa-aed0-9f0fb90f5511',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["afd608ce-f7fb-4bee-9ed1-669773155251"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.missionImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.missionFileUploadedAR)
            formData.append('section_id', '8a71555b-f8ca-4efa-aed0-9f0fb90f5511',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["0aaaf6fe-f768-44b8-9315-ad1253f3c3e6"]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.missionImgAR = res.payload[0].path;

                  this.authService.updateSection(this.ourMissionForm.value)
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
    }
    else {
      this.authService.updateSection(this.ourMissionForm.value)
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

  uploadValuesImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.valuesUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.valuesFileUploaded = file;
    }
  }

  removeValuesFileImg() {
    this.valuesImg = "";
    this.valuesFileUploaded = "";
  }

  uploadValueARImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.valueUploadAR = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.valueFileUploadedAR = file;
    }
  }

  removeValueARFileImg() {
    this.valueImgAR = "";
    this.valueFileUploadedAR = "";
  }

  onSubmitValuesData() {
    if (this.valuesFileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.valuesFileUploaded)
      formData.append('section_id', 'ec008af5-ce0e-442e-969f-768bc1ea5ce4',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["95e8ddb5-547b-44ea-80af-7ee03a3ecaa8"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.valuesImg = res.payload[0].path;
            this.authService.updateSection(this.ourValuesForm.value)
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
    } else if (this.valueFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.valueFileUploadedAR)
      formData.append('section_id', 'ec008af5-ce0e-442e-969f-768bc1ea5ce4',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["537d720f-ea2e-4e47-aeda-64492379342e"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.valueImgAR = res.payload[0].path;
            this.authService.updateSection(this.ourValuesForm.value)
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
    } else if (this.valuesFileUploaded && this.valueFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.valuesFileUploaded)
      formData.append('section_id', 'ec008af5-ce0e-442e-969f-768bc1ea5ce4',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["95e8ddb5-547b-44ea-80af-7ee03a3ecaa8"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.valuesImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.valueFileUploadedAR)
            formData.append('section_id', 'ec008af5-ce0e-442e-969f-768bc1ea5ce4',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["537d720f-ea2e-4e47-aeda-64492379342e"]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.valueImgAR = res.payload[0].path;
                  this.authService.updateSection(this.ourValuesForm.value)
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
      this.authService.updateSection(this.ourValuesForm.value)
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

  onSubmitInterestSecData() {
    const object = {
      enString: this.interstedForm.value.enString,
      arString: this.interstedForm.value.arString
    }
    this.interstedForm.value.additionalInfo = object;
    this.authService.updateSection(this.interstedForm.value)
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
