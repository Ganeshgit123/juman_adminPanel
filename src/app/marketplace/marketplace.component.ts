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
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
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
  marketPlaceFirstForm: FormGroup;
  linkForm: FormGroup;
  getValue: any;
  iconImg: any;
  whatImage: any;
  fileImgUpload: any;

  adbanEngImg: any;
  adbanEngUpload: any;
  adbanENUploaded: any;

  adbanARImg: any;
  adbanARUpload: any;
  adbanARUploaded: any;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.marketPlaceFirstForm = this.fb.group({
      seq: [''], code: [''], erContent: [''], arContent: [''], header: [''],
    });
    this.linkForm = this.fb.group({
      gplayLink: [''], appStoLink: [''], webLink: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: {
        header: { id: "e13a7ca1-c97a-4d7e-be5c-05b90421fe9e" }
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.marketPlaceFirstForm = this.fb.group({
          id: [this.getValue[0].id],
          seq: [this.getValue[0].seq],
          code: [this.getValue[0].code],
          erTitle: [this.getValue[0].erTitle],
          arTitle: [this.getValue[0].arTitle],
          erContent: [this.getValue[0].erContent],
          arContent: [this.getValue[0].arContent],
          header: [this.getValue[0].header.id],
          image: [this.getValue[0]?.images[0]],
        });

        this.iconImg = this.getValue[0]?.images[0]?.path;

        var adImagesShow = this.getValue[1]?.images.filter(element => {
          return element.isActive;
        })
        var imagesss = adImagesShow?.filter(element => {
          return element.seq === 0;
        })
        this.adbanEngImg = imagesss?.[0]?.path;

        var arImgaesss = adImagesShow?.filter(element => {
          return element.seq === 1;
        })
        this.adbanARImg = arImgaesss?.[0]?.path;

        this.linkForm = this.fb.group({
          id: [this.getValue[0].id],
          gplayLink: [this.getValue[0].additionalInfo.gplayLink],
          appStoLink: [this.getValue[0].additionalInfo.appStoLink],
          webLink: [this.getValue[0].additionalInfo.webLink],
        });
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

  onSubmitMarketFormData() {
    if (this.fileImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', '45fbf042-d29f-43ad-8c59-d33da255aa8e',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["ffaaf7e8-58b7-4197-899e-eee5d7a87014"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;
            this.authService.updateSection(this.marketPlaceFirstForm.value)
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
      this.authService.updateSection(this.marketPlaceFirstForm.value)
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

  uploadAdBanEngImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.adbanEngUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.adbanENUploaded = file;
    }
  }

  removeAdBanEngImg() {
    this.adbanEngImg = "";
    this.adbanENUploaded = "";
  }

  uploadAdBanARImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.adbanARUpload = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.adbanARUploaded = file;
    }
  }

  removeAdBanARImg() {
    this.adbanARImg = "";
    this.adbanARUploaded = "";
  }

  onSubmitAdBannerData() {
    if (this.adbanENUploaded && this.adbanARUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.adbanENUploaded)
      formData.append('section_id', '60444652-90de-47ca-97d8-c3143c38dee3',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["e0e5c4f3-0bb5-4f86-b148-833e378af26e"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.adbanEngImg = res.payload[0].path;

            const formData = new FormData();
            formData.append('images', this.adbanARUploaded)
            formData.append('section_id', '60444652-90de-47ca-97d8-c3143c38dee3',)
            formData.append('seqs', '[1]')
            formData.append('ids', '["fca97adf-a3b1-40b4-a438-af985b8ef930"]')
            this.authService.uploadImage(formData)
              .subscribe((res: any) => {
                if (res.code == 200) {
                  this.adbanARImg = res.payload[0].path;
                  this.toastr.success('Success ', 'Updated Successfully');
                  this.spinner.hide();
                  this.ngOnInit();
                } else {
                  this.toastr.error('Enter valid ', 'Error');
                }
              });
          }
        });
    } else if (this.adbanENUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.adbanENUploaded)
      formData.append('section_id', '60444652-90de-47ca-97d8-c3143c38dee3',)
      formData.append('seqs', '[0]')
      formData.append('ids', '["e0e5c4f3-0bb5-4f86-b148-833e378af26e"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.adbanEngImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    } else if (this.adbanARUploaded) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.adbanARUploaded)
      formData.append('section_id', '60444652-90de-47ca-97d8-c3143c38dee3',)
      formData.append('seqs', '[1]')
      formData.append('ids', '["fca97adf-a3b1-40b4-a438-af985b8ef930"]')

      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.adbanARImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', 'Error');
          }
        });
    }
  }

  onSubmitLinkData() {
    const object = {
      gplayLink: this.linkForm.value.gplayLink,
      appStoLink: this.linkForm.value.appStoLink,
      webLink: this.linkForm.value.webLink,
    }
    this.linkForm.value.additionalInfo = object;
    this.authService.updateSection(this.linkForm.value)
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
