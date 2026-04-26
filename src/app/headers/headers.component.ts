import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  endpoint = environment.baseUrl;
  menuForm: FormGroup;
  getvalue = [];
  iconImg = null;
  whatImage: any;
  fileImgUpload: any;
  logObject = [];

  constructor(public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,) {
    this.menuForm = this.fb.group({
      product: this.fb.array(this.getvalue),
    });
  }

  ngOnInit(): void {
    const object = {
      sort: {
        seq: "ASC"
      }
    }

    this.authService.getHeader(object).subscribe(
      (res: any) => {
        this.logObject = res.payload.filter(item => item.seq == 11 && item.name == 'LOGO');
        this.logObject.forEach(element => {
          this.iconImg = element.enMenu;
        });
        this.getvalue = res.payload.filter(item => item.seq !== 11 && item.name !== 'LOGO');

        var dropDownValue = this.getvalue;
        var dropDownArray = []

        if (dropDownValue.length > 0) {
          for (var i = 0; i < dropDownValue.length; i++) {
            dropDownArray.push(this.getPiecesValue(dropDownValue[i]))
          }
        }
        this.menuForm = this.fb.group({
          product: this.fb.array(dropDownArray),
        });
      })
  }

  getPiecesValue(obj): FormGroup {
    return this.fb.group({
      id: [obj.id],
      seq: [obj.seq],
      name: [obj.name],
      enMenu: [obj.enMenu],
      arMenu: [obj.arMenu],
    })
  }

  addPieces() {
    let control = <FormArray>this.menuForm.controls.product;
    control.push(
      this.fb.group({
        enMenu: [''],
        arMenu: [''],
      })
    )
  }

  onSubmit(data) {
    // console.log("fef",data)
    const object = {
      seq: data.value.seq,
      enMenu: data.value.enMenu,
      arMenu: data.value.arMenu,
      id: data.value.id
    }
    // console.log("dfe", object)
    this.authService.updateHeader(object)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  checkFileFormat(checkFile) {
    if (checkFile.type == 'image/webp' || checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/svg+xml' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff') {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.whatImage = event.target.result;
      }
      this.fileImgUpload = file;
    }
  }

  removeImg() {
    this.iconImg = "";
    this.fileImgUpload = "";
  }

  onLogoUpdate() {
    if (this.fileImgUpload) {
      this.spinner.show();
      const object = {
        relations: ["header", "images"],
        filter: {
          id: "14dd2c78-a584-450b-a895-57ccdce08814"
        },
        sort: { seq: "ASC" }
      }
      this.authService.getSectionsByHeaderId(object).subscribe(
        (res: any) => {
          const array: any = [];
          array.push(res.payload[0].images[0].id);

          const formData = new FormData();
          formData.append('images', this.fileImgUpload)
          formData.append('section_id', res.payload[0].id,)
          formData.append('seqs', res.payload[0]['seq'])
          formData.append('ids', JSON.stringify(array))
          this.authService.uploadImage(formData)
            .subscribe((res: any) => {
              if (res.code == 200) {
                // console.log("formdata",this.projectForm.value)
                this.logObject.forEach(element => {
                  const object = {
                    seq: element.seq,
                    enMenu: res.payload[0].path,
                    arMenu: element.arMenu,
                    id: element.id
                  }
                  // console.log("dfe", object)
                  this.authService.updateHeader(object)
                    .subscribe((res: any) => {
                      if (res.isSuccess == true) {
                        this.toastr.success('Success ', 'Updated Successfully');
                        this.spinner.hide();
                        this.ngOnInit();
                      } else {
                        this.toastr.error('Enter valid ', 'Error');
                      }
                    });
                });
              }
            });
        });
    }
  }

  changeMenuStatus(value){
    if (value.isActive == true) {
      var visible = false;
    } else {
      var visible = true
    }

    const object = { isActive: visible, id: value.id }
    this.authService.updateHeader(object)
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
