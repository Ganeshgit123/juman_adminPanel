import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-operating',
  templateUrl: './operating.component.html',
  styleUrls: ['./operating.component.scss']
})
export class OperatingComponent implements OnInit {
  endpoint = environment.baseUrl;
  operaingForm: FormGroup;
  getValue: any;
  operatingSect = [];

  gerFlowImg: any;
  gerFlowUpload: any;
  gerFlowFileUploaded: any;

  gerFlowImgAR: any;
  gerFlowUploadAR: any;
  gerFlowFileUploadedAR: any;

  usgMeImg: any;
  usgMeUpload: any;
  usgMeFileUploaded: any;

  usgMeImgAR: any;
  usgMeUploadAR: any;
  usgMeFileUploadedAR: any;

  bostikImg: any;
  bostikUpload: any;
  bostikFileUploaded: any;

  bostikImgAR: any;
  bostikUploadAR: any;
  bostikFileUploadedAR: any;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.operaingForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''], erContent: [''], arContent: [''], header: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "d5dc29ae-481b-47a4-80f3-2f1afa274da0" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.operatingSect = this.getValue.filter(element => {
          return element.code === 'HOPERA';
        })
        this.operaingForm = this.fb.group({
          id: [this.operatingSect[0].id],
          seq: [this.operatingSect[0].seq],
          code: [this.operatingSect[0].code],
          erTitle: [this.operatingSect[0].erTitle],
          arTitle: [this.operatingSect[0].arTitle],
          erContent: [this.operatingSect[0].erContent],
          arContent: [this.operatingSect[0].arContent],
          header: [this.operatingSect[0].header.id],
        });

        const getImageArray = this.getValue.filter(element => {
          return element.code === "HOPERA";
        })
        const zeroSeqGerFlowImg = getImageArray[0]?.images.filter(element => {
          return element.seq === 0;
        })
        const firstSeqGerFlowImg = getImageArray[0]?.images.filter(element => {
          return element.seq === 1;
        })
        this.gerFlowImg = zeroSeqGerFlowImg[0]?.path;
        this.gerFlowImgAR = firstSeqGerFlowImg[0]?.path;

        const zeroSeqUsgMeImg = getImageArray[0]?.images.filter(element => {
          return element.seq === 2;
        })
        const firstSeqUsgMeImg = getImageArray[0]?.images.filter(element => {
          return element.seq === 3;
        })
        this.usgMeImg = zeroSeqUsgMeImg[0]?.path;
        this.usgMeImgAR = firstSeqUsgMeImg[0]?.path;

        const zeroSeqBostikImg = getImageArray[0]?.images.filter(element => {
          return element.seq === 4;
        })
        const firstSeqBostikImg = getImageArray[0]?.images.filter(element => {
          return element.seq === 5;
        })
        this.bostikImg = zeroSeqBostikImg[0]?.path;
        this.bostikImgAR = firstSeqBostikImg[0]?.path;
      })
  }

  onSubmitOperating() {
    this.authService.updateSection(this.operaingForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  uploadGerFlowImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.gerFlowUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.gerFlowFileUploaded = file;
    }
  }

  removeGerFlowFileImg() {
    this.gerFlowImg = "";
    this.gerFlowFileUploaded = "";
  }

  uploadGerFlowARImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.gerFlowUploadAR = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.gerFlowFileUploadedAR = file;
    }
  }

  removeGerFlowARFileImg() {
    this.gerFlowImgAR = "";
    this.gerFlowFileUploadedAR = "";
  }

  onSubmitGerFlowData() {
    if (this.gerFlowFileUploaded && this.gerFlowFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gerFlowFileUploaded)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["30ec64b9-9d54-42e0-a2c2-287af0daac37"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.gerFlowFileUploadedAR)
            formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["41de9abd-10a3-4df6-9946-9373fdc731d3"]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.gerFlowImgAR = res.payload[0].path;
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.spinner.hide();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else if (this.gerFlowFileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gerFlowFileUploaded)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["30ec64b9-9d54-42e0-a2c2-287af0daac37"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    } else if (this.gerFlowFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gerFlowFileUploadedAR)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["41de9abd-10a3-4df6-9946-9373fdc731d3"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImgAR = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  uploadUsgMeImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.usgMeUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.usgMeFileUploaded = file;
    }
  }

  removeUsgMeFileImg() {
    this.usgMeImg = "";
    this.usgMeFileUploaded = "";
  }

  uploadUsgMeARImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.usgMeUploadAR = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.usgMeFileUploadedAR = file;
    }
  }

  removeUsgMeARFileImg() {
    this.usgMeImgAR = "";
    this.usgMeFileUploadedAR = "";
  }

  onSubmitUsgMeData() {
    if (this.usgMeFileUploaded && this.usgMeFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.usgMeFileUploaded)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[2]')
      formData.append('ids', '["697abc98-c18a-4968-b923-d5ec96dfa0af"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.usgMeFileUploadedAR)
            formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
            formData.append('seqs', '[3]')
            formData.append('ids', '["4b1466be-25e7-4d80-acae-a2dcf58ce93c"]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.gerFlowImgAR = res.payload[0].path;
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.spinner.hide();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else if (this.usgMeFileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.usgMeFileUploaded)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[2]')
      formData.append('ids', '["697abc98-c18a-4968-b923-d5ec96dfa0af"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    } else if (this.usgMeFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.usgMeFileUploadedAR)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[3]')
      formData.append('ids', '["4b1466be-25e7-4d80-acae-a2dcf58ce93c"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImgAR = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  uploadBostikImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.bostikUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.bostikFileUploaded = file;
    }
  }

  removeBostikFileImg() {
    this.bostikImg = "";
    this.bostikFileUploaded = "";
  }

  uploadBostikARImgFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.bostikUploadAR = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.bostikFileUploadedAR = file;
    }
  }

  removeBostikARFileImg() {
    this.bostikImgAR = "";
    this.bostikFileUploadedAR = "";
  }

  onSubmitBostikData() {
    if (this.bostikFileUploaded && this.bostikFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.bostikFileUploaded)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[4]')
      formData.append('ids', '["3ec5c098-01eb-477c-8737-c3b048a23d0f"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.bostikFileUploadedAR)
            formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
            formData.append('seqs', '[5]')
            formData.append('ids', '["fd1e7bf4-5a67-4727-85a8-ce13b973dd62"]')

            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.gerFlowImgAR = res.payload[0].path;
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.spinner.hide();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else if (this.bostikFileUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.bostikFileUploaded)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[4]')
      formData.append('ids', '["3ec5c098-01eb-477c-8737-c3b048a23d0f"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    } else if (this.bostikFileUploadedAR) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.bostikFileUploadedAR)
      formData.append('section_id', '4a8992e7-bb2e-4f9d-85ec-b11ed4256b98',)
      formData.append('seqs', '[5]')
      formData.append('ids', '["fd1e7bf4-5a67-4727-85a8-ce13b973dd62"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.gerFlowImgAR = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }
}
