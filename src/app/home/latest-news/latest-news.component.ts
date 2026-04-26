import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent implements OnInit {
  endpoint = environment.baseUrl;

  latestForm1: FormGroup;
  getValue: any;
  latUpload: any;
  latestImg11: any;
  lateImageFileUploaded: any;

  latestForm22: FormGroup;
  lat2Upload: any;
  latestImg2: any;
  lateImage22FileUploaded: any;

  latestForm33: FormGroup;
  lat3Upload: any;
  latestImg3: any;
  lateImage33FileUploaded: any;

  newsLinkForm: FormGroup;
  getLinkValue: any;

  latestHeadForm: FormGroup;

  constructor(public fb: FormBuilder, public authService: AuthService, private toastr: ToastrService,
    private router: Router, private spinner: NgxSpinnerService,) {
    this.latestForm1 = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      link: [''], linkAr: [''], date: [''],
    });
    this.latestForm22 = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      link: [''], linkAr: [''], date: [''],
    });
    this.latestForm33 = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
      link: [''], linkAr: [''], date: [''],
    });
    this.newsLinkForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], additionalInfo: [''], header: [''],
    });
    this.latestHeadForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
  }
  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        code: "LANEWS"
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.latestForm1 = this.fb.group({
          id: [this.getValue[0].id],
          seq: [this.getValue[0].seq],
          code: [this.getValue[0].code],
          erTitle: [this.getValue[0].erTitle],
          arTitle: [this.getValue[0].arTitle],
          erContent: [this.getValue[0].erContent],
          arContent: [this.getValue[0].arContent],
          header: [this.getValue[0].header.id],
          link: [this.getValue[0]?.additionalInfo?.link],
          linkAr: [this.getValue[0]?.additionalInfo?.linkAr],
          date: [this.getValue[0]?.additionalInfo?.date],
        });
        this.latestImg11 = this.getValue[0]?.images[0]?.path;

        this.latestForm22 = this.fb.group({
          id: [this.getValue[1].id],
          seq: [this.getValue[1].seq],
          code: [this.getValue[1].code],
          erTitle: [this.getValue[1].erTitle],
          arTitle: [this.getValue[1].arTitle],
          erContent: [this.getValue[1].erContent],
          arContent: [this.getValue[1].arContent],
          header: [this.getValue[1].header.id],
          link: [this.getValue[1]?.additionalInfo?.link],
          linkAr: [this.getValue[1]?.additionalInfo?.linkAr],
          date: [this.getValue[1]?.additionalInfo?.date],
        });
        this.latestImg2 = this.getValue[1]?.images[0]?.path;

        this.latestForm33 = this.fb.group({
          id: [this.getValue[2].id],
          seq: [this.getValue[2].seq],
          code: [this.getValue[2].code],
          erTitle: [this.getValue[2].erTitle],
          arTitle: [this.getValue[2].arTitle],
          erContent: [this.getValue[2].erContent],
          arContent: [this.getValue[2].arContent],
          header: [this.getValue[2].header.id],
          link: [this.getValue[2]?.additionalInfo?.link],
          linkAr: [this.getValue[2]?.additionalInfo?.linkAr],
          date: [this.getValue[2]?.additionalInfo?.date],
        });
        this.latestImg3 = this.getValue[2]?.images[0]?.path;
      });

    const object1 = {
      relations: ["header", "images"],
      filter: {
        code: "NEWSLI"
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object1).subscribe(
      (res: any) => {
        this.getLinkValue = res.payload;
        this.newsLinkForm = this.fb.group({
          id: [this.getLinkValue[0].id],
          seq: [this.getLinkValue[0].seq],
          code: [this.getLinkValue[0].code],
          erTitle: [this.getLinkValue[0].erTitle],
          arTitle: [this.getLinkValue[0].arTitle],
          erContent: [this.getLinkValue[0].erContent],
          arContent: [this.getLinkValue[0].arContent],
          additionalInfo: [this.getLinkValue[0].additionalInfo],
          header: [this.getLinkValue[0].header.id],
        });
      })
  }

  uploadLatestImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.latUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.lateImageFileUploaded = file;
    }
  }

  removeLatest1Img() {
    this.latestImg11 = "";
    this.lateImageFileUploaded = "";
  }
  onSubmitLatest1FormData() {
    const object = {
      id: this.latestForm1.value.id,
      seq: this.latestForm1.value.seq,
      code: this.latestForm1.value.code,
      erTitle: this.latestForm1.value.erTitle,
      arTitle: this.latestForm1.value.arTitle,
      erContent: this.latestForm1.value.erContent,
      arContent: this.latestForm1.value.arContent,
      header: this.latestForm1.value.header,
      additionalInfo: {
        link: this.latestForm1.value.link,
        linkAr: this.latestForm1.value.linkAr,
        date: this.latestForm1.value.date,
      }
    }
    if (this.lateImageFileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.lateImageFileUploaded)
      formData.append('section_id', '4aa33634-eb6b-4736-9f2d-1120c05daadd',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["a63860cf-31a5-4e38-93c3-667783bc9d93"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.latestImg11 = res.payload[0].path;
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
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  uploadLatest2ImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.lat2Upload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.lateImage22FileUploaded = file;
    }
  }

  removeLatest2Img() {
    this.latestImg2 = "";
    this.lateImage22FileUploaded = "";
  }

  onSubmitLatest22FormData() {
    const object = {
      id: this.latestForm22.value.id,
      seq: this.latestForm22.value.seq,
      code: this.latestForm22.value.code,
      erTitle: this.latestForm22.value.erTitle,
      arTitle: this.latestForm22.value.arTitle,
      erContent: this.latestForm22.value.erContent,
      arContent: this.latestForm22.value.arContent,
      header: this.latestForm22.value.header,
      additionalInfo: {
        link: this.latestForm22.value.link,
        linkAr: this.latestForm22.value.linkAr,
        date: this.latestForm22.value.date,
      }
    }
    if (this.lateImage22FileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.lateImage22FileUploaded)
      formData.append('section_id', '943d6022-213f-4067-8eb6-d15ea55c20da',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["642bfa5a-396a-480a-9dad-1ebb6ffc0b08"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.latestImg2 = res.payload[0].path;
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
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  uploadLatest3ImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.lat3Upload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.lateImage33FileUploaded = file;
    }
  }

  removeLatest3Img() {
    this.latestImg3 = "";
    this.lateImage33FileUploaded = "";
  }

  onSubmitLatest33FormData() {
    const object = {
      id: this.latestForm33.value.id,
      seq: this.latestForm33.value.seq,
      code: this.latestForm33.value.code,
      erTitle: this.latestForm33.value.erTitle,
      arTitle: this.latestForm33.value.arTitle,
      erContent: this.latestForm33.value.erContent,
      arContent: this.latestForm33.value.arContent,
      header: this.latestForm33.value.header,
      additionalInfo: {
        link: this.latestForm33.value.link,
        linkAr: this.latestForm33.value.linkAr,
        date: this.latestForm33.value.date,
      }
    }
    if (this.lateImage33FileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.lateImage33FileUploaded)
      formData.append('section_id', '3adfe7bb-ae10-4d0a-89a0-02e6da5f0609',)
      formData.append('seqs', '[2]')
      formData.append('ids', '["a009fc0f-1ef5-42ee-99f5-5c2e973dc39d"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.latestImg3 = res.payload[0].path;
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
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  obSubmitLinkForm() {
    this.authService.updateSection(this.newsLinkForm.value)
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
