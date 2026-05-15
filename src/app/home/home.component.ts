import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

  aboutForm: FormGroup;
  whatWeDoForm: FormGroup;
  serviceForm: FormGroup;
  getValue: any;
  iconImg = null;
  fileImgUpload: any;
  whatImage: any;
  gccServiceImg: any;
  gccUpload: any;
  gccServiceImgUpload: any;
  marketServiceImg: any;
  marketUpload: any;
  marketPlaceServiceImgUpload: any;
  aboutSec = [];
  whatWeDoSec = [];
  serviceSect = [];

  // ✅ ViewChild refs for all 3 file inputs
  @ViewChild('docFileInput') docFileInput: ElementRef;
  @ViewChild('gccFileInput') gccFileInput: ElementRef;
  @ViewChild('marketFileInput') marketFileInput: ElementRef;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.aboutForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''],
      erContent: [''], arContent: [''], header: [''],
    });
    this.whatWeDoForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''],
      erContent: [''], arContent: [''], header: [''],
    });
    this.serviceForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], arTitle: [''],
      erContent: [''], arContent: [''], header: [''],
    });
  }

  ngOnInit(): void {
    const object = {
      relations: ["header", "images"],
      filter: { header: { id: "d5dc29ae-481b-47a4-80f3-2f1afa274da0" } },
      sort: { seq: "ASC" }
    }

    this.authService.getSectionsByHeaderId(object).subscribe((res: any) => {
      this.getValue = res.payload;

      // About section
      this.aboutSec = this.getValue.filter(e => e.code === 'HABOUT');
      this.aboutForm = this.fb.group({
        id: [this.aboutSec[0].id],
        seq: [this.aboutSec[0].seq],
        code: [this.aboutSec[0].code],
        erTitle: [this.aboutSec[0].erTitle],
        arTitle: [this.aboutSec[0].arTitle],
        erContent: [this.aboutSec[0].erContent],
        arContent: [this.aboutSec[0].arContent],
        header: [this.aboutSec[0].header.id],
        image: [this.aboutSec[0]?.images[0]],
      });
      this.iconImg = this.aboutSec[0]?.images[0]?.path;

      // What We Do section
      this.whatWeDoSec = this.getValue.filter(e => e.code === 'HWHO');
      this.whatWeDoForm = this.fb.group({
        id: [this.whatWeDoSec[0].id],
        seq: [this.whatWeDoSec[0].seq],
        code: [this.whatWeDoSec[0].code],
        erTitle: [this.whatWeDoSec[0].erTitle],
        arTitle: [this.whatWeDoSec[0].arTitle],
        erContent: [this.whatWeDoSec[0].erContent],
        arContent: [this.whatWeDoSec[0].arContent],
        header: [this.whatWeDoSec[0].header.id],
      });

      // Service section
      this.serviceSect = this.getValue.filter(e => e.code === 'SERVIC');
      this.serviceForm = this.fb.group({
        id: [this.serviceSect[0].id],
        seq: [this.serviceSect[0].seq],
        code: [this.serviceSect[0].code],
        erTitle: [this.serviceSect[0].erTitle],
        arTitle: [this.serviceSect[0].arTitle],
        erContent: [this.serviceSect[0].erContent],
        arContent: [this.serviceSect[0].arContent],
        header: [this.serviceSect[0].header.id],
      });

      this.gccServiceImg = this.serviceSect[0]?.images.find(e => e.seq === 0)?.path;
      this.marketServiceImg = this.serviceSect[0]?.images.find(e => e.seq === 1)?.path;
    });
  }

  // ✅ Individual reset helpers for each upload section
  resetDocFileState() {
    this.iconImg = null;
    this.fileImgUpload = null;
    this.whatImage = null;
    if (this.docFileInput) {
      this.docFileInput.nativeElement.value = '';
    }
  }

  resetGccFileState() {
    this.gccServiceImg = null;
    this.gccServiceImgUpload = null;
    this.gccUpload = null;
    if (this.gccFileInput) {
      this.gccFileInput.nativeElement.value = '';
    }
  }

  resetMarketFileState() {
    this.marketServiceImg = null;
    this.marketPlaceServiceImgUpload = null;
    this.marketUpload = null;
    if (this.marketFileInput) {
      this.marketFileInput.nativeElement.value = '';
    }
  }

  uploadDocFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.fileImgUpload = file;
      this.whatImage = file.name;
    }
  }

  removeImg() {
    this.resetDocFileState(); // ✅ Properly clears all doc state + DOM
  }

  onSubmitAboutData() {
    if (this.fileImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.fileImgUpload);
      formData.append('section_id', '0a622677-bf80-487e-94ce-3040f0ea5c8c');
      formData.append('seqs', '[0]');
      formData.append('ids', '["486cc1fc-be89-4348-92b0-2ce4a7629a9a"]');

      this.authService.uploadImage(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.iconImg = res.payload[0].path;
          this.resetDocFileState(); // ✅ Clear stale file after upload
          this.authService.updateSection(this.aboutForm.value).subscribe((res: any) => {
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
      this.authService.updateSection(this.aboutForm.value).subscribe((res: any) => {
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

  onSubmitWhatWeDo() {
    this.authService.updateSection(this.whatWeDoForm.value).subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', 'Error');
      }
    });
  }

  uploadGccServiceFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => { this.gccUpload = event.target.result; }
      reader.readAsDataURL(file);
      this.gccServiceImgUpload = file;
    }
  }

  removeGcc() {
    this.resetGccFileState(); // ✅ Properly clears all gcc state + DOM
  }

  uploadMarketServiceFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => { this.marketUpload = event.target.result; }
      reader.readAsDataURL(file);
      this.marketPlaceServiceImgUpload = file;
    }
  }

  removeMarketImg() {
    this.resetMarketFileState(); // ✅ Properly clears all market state + DOM
  }

  onSubmitServiceSect() {
    // ✅ FIXED: Check BOTH first, then individuals — previous order made "both" unreachable
    if (this.gccServiceImgUpload && this.marketPlaceServiceImgUpload) {
      this.spinner.show();

      // Upload GCC image first
      const gccFormData = new FormData();
      gccFormData.append('images', this.gccServiceImgUpload);
      gccFormData.append('section_id', 'a2b6cc9c-91b6-42a9-8fd2-a5ffef922fe8');
      gccFormData.append('seqs', '[0]');
      gccFormData.append('ids', '["bc40878a-ac78-4582-a3c9-d56461e3b118"]');

      this.authService.uploadImage(gccFormData).subscribe((res: any) => {
        if (res.code == 200) {
          this.gccServiceImg = res.payload[0].path;
          this.resetGccFileState(); // ✅ Clear after upload

          // Then upload Market image
          const marketFormData = new FormData();
          marketFormData.append('images', this.marketPlaceServiceImgUpload);
          marketFormData.append('section_id', 'a2b6cc9c-91b6-42a9-8fd2-a5ffef922fe8');
          marketFormData.append('seqs', '[1]');
          marketFormData.append('ids', '["3ef6f996-b4e6-4198-95e2-2ff5bddda20c"]');

          this.authService.uploadImage(marketFormData).subscribe((res: any) => {
            if (res.code == 200) {
              this.marketServiceImg = res.payload[0].path;
              this.resetMarketFileState(); // ✅ Clear after upload

              this.authService.updateSection(this.serviceForm.value).subscribe((res: any) => {
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

    } else if (this.gccServiceImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.gccServiceImgUpload);
      formData.append('section_id', 'a2b6cc9c-91b6-42a9-8fd2-a5ffef922fe8');
      formData.append('seqs', '[0]');
      formData.append('ids', '["bc40878a-ac78-4582-a3c9-d56461e3b118"]');

      this.authService.uploadImage(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.gccServiceImg = res.payload[0].path;
          this.resetGccFileState(); // ✅ Clear after upload
          this.authService.updateSection(this.serviceForm.value).subscribe((res: any) => {
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

    } else if (this.marketPlaceServiceImgUpload) {
      this.spinner.show();
      const formData = new FormData();
      formData.append('images', this.marketPlaceServiceImgUpload);
      formData.append('section_id', 'a2b6cc9c-91b6-42a9-8fd2-a5ffef922fe8');
      formData.append('seqs', '[1]');
      formData.append('ids', '["3ef6f996-b4e6-4198-95e2-2ff5bddda20c"]');

      this.authService.uploadImage(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.marketServiceImg = res.payload[0].path;
          this.resetMarketFileState(); // ✅ Clear after upload
          this.authService.updateSection(this.serviceForm.value).subscribe((res: any) => {
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
      // No image changes, just update section data
      this.authService.updateSection(this.serviceForm.value).subscribe((res: any) => {
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