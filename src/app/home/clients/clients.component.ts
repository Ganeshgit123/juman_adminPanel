import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  endpoint = environment.baseUrl;
  isEdit = false;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  logoImages = [];
  iconImg = null;
  fileImgUpload: any;
  iconImgUrl: any;
  submitted = false;
  whatImage: any;
  sectionId: any;
  logoImgLength = [];
  editData: any;
  clientForm: FormGroup;
  clientSec = [];

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,
    private translate: TranslateService,) {
    this.clientForm = this.fb.group({
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
        var getList = res.payload;
        this.clientSec = getList.filter(element => {
          return element.code === 'CLIENT';
        })
        this.clientForm = this.fb.group({
          id: [this.clientSec[0].id],
          seq: [this.clientSec[0].seq],
          code: [this.clientSec[0].code],
          erTitle: [this.clientSec[0].erTitle],
          arTitle: [this.clientSec[0].arTitle],
          erContent: [this.clientSec[0].erContent],
          arContent: [this.clientSec[0].arContent],
          header: [this.clientSec[0].header.id],
        });
        this.sectionId = this.clientSec[0].id;
        this.logoImages = this.clientSec[0].images.sort(function (first, second) {
          return first.seq - second.seq;
        });
        this.logoImgLength.push(this.logoImages.length);

        this.dataSource = new MatTableDataSource(this.logoImages);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });

    this.displayedColumns = ['index', 'path', 'rowActionToggle', 'rowActionIcon'];
  }

  onSubmitPartnerSect() {
    this.authService.updateSection(this.clientForm.value)
      .subscribe((res: any) => {
        if (res.isSuccess == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(content) {
    this.isEdit = false;
    this.iconImg = null;
    this.whatImage = null;
    this.modalService.open(content, { centered: true });
  }

  removeImg() {
    this.iconImg = "";
    this.fileImgUpload = "";
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.whatImage = event.target.result;
    }
    this.fileImgUpload = file;
  }

  onSubmitImageData() {
    this.submitted = true;
    if (!this.isEdit) {
      if (!(this.fileImgUpload)) {
        return false;
      }
    }
    if (this.isEdit) {
      this.imageUpdateService(this.editData)
      return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('images', this.fileImgUpload)
    formData.append('section_id', this.sectionId,)
    formData.append('seqs', JSON.stringify(this.logoImgLength))
    formData.append('ids', '[]')
    this.authService.uploadImage(formData)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.iconImg = res.payload[0].path;
          this.toastr.success('Success ', 'Updated Successfully');
          this.submitted = false;
          this.iconImg = null;
          this.spinner.hide();
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      });
  }

  editLogos(data, content) {
    this.editData = data;
    this.modalService.open(content, { centered: true });
    this.isEdit = true;
    this.fileImgUpload = null;
    this.whatImage = null;
    this.iconImg = data.path;
  }

  imageUpdateService(data) {
    if (this.fileImgUpload) {
      this.spinner.show();
      const array: any = [];
      array.push(data['id']);
      const seqArray = [];
      seqArray.push(data['seq']);

      const formData = new FormData();
      formData.append('images', this.fileImgUpload)
      formData.append('section_id', this.sectionId)
      formData.append('seqs', JSON.stringify(seqArray))
      formData.append('ids', JSON.stringify(array))
      this.authService.uploadImage(formData)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.iconImg = res.payload[0].path;
            this.toastr.success('Success ', 'Updated Successfully');
            this.submitted = false;
            this.iconImg = null;
            this.spinner.hide();
            this.modalService.dismissAll();
            this.ngOnInit();
          }
        });
    } else {
      this.submitted = false;
      this.modalService.dismissAll();
      this.ngOnInit();
    }
  }

  changeStatus(value) {
    if (value.isActive == true) {
      var visible = false;
    } else {
      var visible = true
    }

    const object = { isActive: visible, id: value.id }
    this.authService.updateImagesWithoutUpload(object)
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
