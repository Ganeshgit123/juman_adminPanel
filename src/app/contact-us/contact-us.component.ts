import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getValue = [];
  totalValue: any;
  totalRecords: any;
  
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(public authService: AuthService,private router: Router,) { }

  ngOnInit(): void {
    this.displayedColumns = ['index', 'name','mobileNumber','email','message'];

  }

  initialLoad() {
    let currentPage = (this.matPaginator?.pageIndex ?? 0);
    const object = { limit: (this.matPaginator?.pageSize ?? 0), skip: currentPage }
    this.authService.getContacts(object).subscribe(
      (res: any) => {
        this.totalRecords = res.payload.totalCount;
        this.getValue = res.payload.data;
        this.dataSource = new MatTableDataSource(this.getValue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      });
  }

  pageChange() {
    this.matPaginator?.page.pipe(
      switchMap(() => {
        let currentPage = (this.matPaginator?.pageIndex ?? 0);
        let val:any;
        if(currentPage != 0){
          val = (10 - currentPage)
        }else{
           val = 0
        }
        const object = { limit: (this.matPaginator?.pageSize ?? 0), skip: (currentPage + val) }
        return this.authService.getCarrer(object);
      }),
      map(result => {
        if (!result) {
          return [];
        }
        this.totalRecords = result.payload.totalCount;
        return result.payload.data;
      })
    )
      .subscribe(data => {
        this.dataSource = data;
      });
  }


  ngAfterViewInit(): void {
    if (localStorage.getItem("dir") == "ltr") {
      this.matPaginator._intl.itemsPerPageLabel = 'Items per page';
    } else {
      this.matPaginator._intl.itemsPerPageLabel = 'معلومات كل صفحة';
    }
    this.pageChange();
    this.initialLoad();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
