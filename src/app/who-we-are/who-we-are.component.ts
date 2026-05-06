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

        const getByCode = (code: string) =>
          this.getValue.find((el: any) => el.code === code);

        const getImageBySeq = (images: any[], seq: number) =>
          images?.find((img: any) => img.seq === seq)?.path;

        // ── Top Section (WHO) ──────────
        const topSec = getByCode('WHO');
        this.topSectionForm = this.fb.group({
          id: [topSec?.id],
          seq: [topSec?.seq],
          code: [topSec?.code],
          erTitle: [topSec?.erTitle],
          arTitle: [topSec?.arTitle],
          header: [topSec?.header?.id],
        });

        // ── What We Do (ABOUT) ─────────────────────────────────────────
        const whatWeDo = getByCode('ABOUT');
        this.whatWeDoForm = this.fb.group({
          id: [whatWeDo?.id],
          seq: [whatWeDo?.seq],
          code: [whatWeDo?.code],
          erTitle: [whatWeDo?.erTitle],
          arTitle: [whatWeDo?.arTitle],
          erContent: [whatWeDo?.erContent],
          arContent: [whatWeDo?.arContent],
          header: [whatWeDo?.header?.id],
        });
        this.iconImg = whatWeDo?.images?.[0]?.path;

        // ── Counter Section (COUNT) ────────────────────────────────────
        const counterSec = getByCode('COUNT');
        const ai = counterSec?.additionalInfo;
        this.counterSecForm = this.fb.group({
          id: [counterSec?.id],
          seq: [counterSec?.seq],
          code: [counterSec?.code],
          erTitle: [counterSec?.erTitle],
          arTitle: [counterSec?.arTitle],
          header: [counterSec?.header?.id],
          firstValue: [ai?.firstValue],
          firstValueAr: [ai?.firstValueAr],
          firstContent: [ai?.firstContent],
          arFirstContent: [ai?.arFirstContent],
          secondValue: [ai?.secondValue],
          secondValueAr: [ai?.secondValueAr],
          secondContent: [ai?.secondContent],
          arSecondContent: [ai?.arSecondContent],
          thirdValue: [ai?.thirdValue],
          thirdValueAr: [ai?.thirdValueAr],
          thirdContent: [ai?.thirdContent],
          arThirdContent: [ai?.arThirdContent],
          fourthValue: [ai?.fourthValue],
          fourthValueAr: [ai?.fourthValueAr],
          fourthContent: [ai?.fourthContent],
          arFourthContent: [ai?.arFourthContent],
        });

        // ── Our Vision (ABOTAB seq=3) ──────────────────────────────────
        const visionSec = this.getValue.find(
          (el: any) => el.code === 'ABOTAB' && el.seq === 3
        );
        this.ourVisionForm = this.fb.group({
          id: [visionSec?.id],
          seq: [visionSec?.seq],
          code: [visionSec?.code],
          erTitle: [visionSec?.erTitle],
          arTitle: [visionSec?.arTitle],
          erContent: [visionSec?.erContent],
          arContent: [visionSec?.arContent],
          header: [visionSec?.header?.id],
        });
        this.visonImg = getImageBySeq(visionSec?.images, 0);
        this.visonImgAR = getImageBySeq(visionSec?.images, 1);

        // ── Our Mission (ABOTAB seq=4) ─────────────────────────────────
        const missionSec = this.getValue.find(
          (el: any) => el.code === 'ABOTAB' && el.seq === 4
        );
        this.ourMissionForm = this.fb.group({
          id: [missionSec?.id],
          seq: [missionSec?.seq],
          code: [missionSec?.code],
          erTitle: [missionSec?.erTitle],
          arTitle: [missionSec?.arTitle],
          erContent: [missionSec?.erContent],
          arContent: [missionSec?.arContent],
          header: [missionSec?.header?.id],
        });
        this.missionImg = getImageBySeq(missionSec?.images, 0);
        this.missionImgAR = getImageBySeq(missionSec?.images, 1);

        // ── Our Values (ABOTAB seq=5) ──────────────────────────────────
        const valuesSec = this.getValue.find(
          (el: any) => el.code === 'ABOTAB' && el.seq === 5
        );
        this.ourValuesForm = this.fb.group({
          id: [valuesSec?.id],
          seq: [valuesSec?.seq],
          code: [valuesSec?.code],
          erTitle: [valuesSec?.erTitle],
          arTitle: [valuesSec?.arTitle],
          erContent: [valuesSec?.erContent],
          arContent: [valuesSec?.arContent],
          header: [valuesSec?.header?.id],
        });
        this.valuesImg = getImageBySeq(valuesSec?.images, 0);
        this.valueImgAR = getImageBySeq(valuesSec?.images, 1);

        // ── Interested Section (ABBOTT) ────────────────────────────────
        const interestedSec = getByCode('ABBOTT');
        this.interstedForm = this.fb.group({
          id: [interestedSec?.id],
          seq: [interestedSec?.seq],
          code: [interestedSec?.code],
          erTitle: [interestedSec?.erTitle],
          arTitle: [interestedSec?.arTitle],
          erContent: [interestedSec?.erContent],
          arContent: [interestedSec?.arContent],
          header: [interestedSec?.header?.id],
          enString: [interestedSec?.additionalInfo?.enString],
          arString: [interestedSec?.additionalInfo?.arString],
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
    this.whatImage = "";
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
    this.visionUpload = "";
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
    this.visionUploadAR = "";
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
    this.missionUpload = "";
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
    this.missionUploadAR = "";
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
    this.valuesUpload = "";
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
    this.valueUploadAR = "";
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
