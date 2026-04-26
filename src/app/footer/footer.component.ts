import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerForm: FormGroup;
  getValue = [];
  quickLinkForm: FormGroup;
  mapLinkForm: FormGroup;
  getLinkValue: any;

  constructor(public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router,) {
    this.footerForm = this.fb.group({
      address: [''], mobileNumber: [''], email: [''], copyright: [''], fbLink: [''], instaLink: [''], twitterLink: [''],
      stayStringEn: [''], stayStringAr: [''], copyrightAr: ['']
    });
    this.quickLinkForm = this.fb.group({
      quickStingEn: [''], quickStingAr: [''], whoStringEn: [''], whoStringAr: [''], serviceStringEn: [''], serviceStringAr: [''],
      projectStringEn: [''], projectStringAr: [''], careerStringEn: [''], careerStringAr: [''], operatingStringEn: [''], operatingStringAr: [''],
      gerflorString: [''], gerflorLink: [''], bostikString: [''], bostikLink: [''], usgMeString: [''], usgMeLink: ['']
    });
    this.mapLinkForm = this.fb.group({
      seq: [''], code: [''], erTitle: [''], header: [''],
    });
  }

  ngOnInit(): void {

    const object = {
      sort: {
        createdOn: "desc"
      }
    }
    this.authService.getFooter(object).subscribe(
      (res: any) => {
        this.getValue = res.payload;
        this.footerForm = this.fb.group({
          id: [this.getValue[0].id],
          address: [this.getValue[0].address],
          mobileNumber: [this.getValue[0].mobileNumber],
          email: [this.getValue[0].email],
          copyright: [this.getValue[0].copyright],
          fbLink: [this.getValue[0].fbLink],
          instaLink: [this.getValue[0].instaLink],
          twitterLink: [this.getValue[0].twitterLink],
          stayStringEn: [this.getValue[0].quickLink[0].stayStringEn],
          stayStringAr: [this.getValue[0].quickLink[0].stayStringAr],
          copyrightAr: [this.getValue[0].quickLink[0].copyrightAr],
        });

        this.quickLinkForm = this.fb.group({
          id: [this.getValue[0].id],
          quickStingEn: [this.getValue[0].quickLink[0].quickStingEn],
          quickStingAr: [this.getValue[0].quickLink[0].quickStingAr],
          whoStringEn: [this.getValue[0].quickLink[0].whoStringEn],
          whoStringAr: [this.getValue[0].quickLink[0].whoStringAr],
          serviceStringEn: [this.getValue[0].quickLink[0].serviceStringEn],
          serviceStringAr: [this.getValue[0].quickLink[0].serviceStringAr],
          projectStringEn: [this.getValue[0].quickLink[0].projectStringEn],
          projectStringAr: [this.getValue[0].quickLink[0].projectStringAr],
          careerStringEn: [this.getValue[0].quickLink[0].careerStringEn],
          careerStringAr: [this.getValue[0].quickLink[0].careerStringAr],
          operatingStringEn: [this.getValue[0].quickLink[0].operatingStringEn],
          operatingStringAr: [this.getValue[0].quickLink[0].operatingStringAr],
          gerflorString: [this.getValue[0].quickLink[0].gerflorString],
          gerflorLink: [this.getValue[0].quickLink[0].gerflorLink],
          bostikString: [this.getValue[0].quickLink[0].bostikString],
          bostikLink: [this.getValue[0].quickLink[0].bostikLink],
          usgMeString: [this.getValue[0].quickLink[0].usgMeString],
          usgMeLink: [this.getValue[0].quickLink[0].usgMeLink],
        });
      })

    const object1 = {
      relations: ["header", "images"],
      filter: {
        header: { id: "8ba840aa-c59a-4c23-97bc-578f1b95bd40" },
        code: "MAPLIN"
      },
      sort: { seq: "ASC" }
    }
    this.authService.getSectionsByHeaderId(object1).subscribe(
      (res: any) => {
        this.getLinkValue = res.payload;
        this.mapLinkForm = this.fb.group({
          id: [this.getLinkValue[0].id],
          seq: [this.getLinkValue[0].seq],
          code: [this.getLinkValue[0].code],
          erTitle: [this.getLinkValue[0].erTitle],
          header: [this.getLinkValue[0].header.id],
        });
      })
  }

  onSubmitFootLeftData() {
    const object = [{
      stayStringEn: this.footerForm.value.stayStringEn,
      stayStringAr: this.footerForm.value.stayStringAr,
      copyrightAr: this.footerForm.value.copyrightAr,
      quickStingEn: this.quickLinkForm.value.quickStingEn,
      quickStingAr: this.quickLinkForm.value.quickStingAr,
      whoStringEn: this.quickLinkForm.value.whoStringEn,
      whoStringAr: this.quickLinkForm.value.whoStringAr,
      serviceStringEn: this.quickLinkForm.value.serviceStringEn,
      serviceStringAr: this.quickLinkForm.value.serviceStringAr,
      projectStringEn: this.quickLinkForm.value.projectStringEn,
      projectStringAr: this.quickLinkForm.value.projectStringAr,
      careerStringEn: this.quickLinkForm.value.careerStringEn,
      careerStringAr: this.quickLinkForm.value.careerStringAr,
      operatingStringEn: this.quickLinkForm.value.operatingStringEn,
      operatingStringAr: this.quickLinkForm.value.operatingStringAr,
      gerflorString: this.quickLinkForm.value.gerflorString,
      gerflorLink: this.quickLinkForm.value.gerflorLink,
      bostikString: this.quickLinkForm.value.bostikString,
      bostikLink: this.quickLinkForm.value.bostikLink,
      usgMeString: this.quickLinkForm.value.usgMeString,
      usgMeLink: this.quickLinkForm.value.usgMeLink,
    }]
    this.footerForm.value.quickLink = object;
    this.authService.updateFooter(this.footerForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  onSubmitFootRightData() {
    const object = [{
      stayStringEn: this.footerForm.value.stayStringEn,
      stayStringAr: this.footerForm.value.stayStringAr,
      copyrightAr: this.footerForm.value.copyrightAr,
      quickStingEn: this.quickLinkForm.value.quickStingEn,
      quickStingAr: this.quickLinkForm.value.quickStingAr,
      whoStringEn: this.quickLinkForm.value.whoStringEn,
      whoStringAr: this.quickLinkForm.value.whoStringAr,
      serviceStringEn: this.quickLinkForm.value.serviceStringEn,
      serviceStringAr: this.quickLinkForm.value.serviceStringAr,
      projectStringEn: this.quickLinkForm.value.projectStringEn,
      projectStringAr: this.quickLinkForm.value.projectStringAr,
      careerStringEn: this.quickLinkForm.value.careerStringEn,
      careerStringAr: this.quickLinkForm.value.careerStringAr,
      operatingStringEn: this.quickLinkForm.value.operatingStringEn,
      operatingStringAr: this.quickLinkForm.value.operatingStringAr,
      gerflorString: this.quickLinkForm.value.gerflorString,
      gerflorLink: this.quickLinkForm.value.gerflorLink,
      bostikString: this.quickLinkForm.value.bostikString,
      bostikLink: this.quickLinkForm.value.bostikLink,
      usgMeString: this.quickLinkForm.value.usgMeString,
      usgMeLink: this.quickLinkForm.value.usgMeLink,
    }]
    this.quickLinkForm.value.quickLink = object;
    this.authService.updateFooter(this.quickLinkForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  obSubmitLinkForm() {
    this.authService.updateSection(this.mapLinkForm.value)
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
