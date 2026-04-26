import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestNewsComponent } from './latest-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LatestNewsComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path: "",
        component: LatestNewsComponent
      }
    ]),
    TranslateModule,
  ]
})
export class LatestNewsModule { }
