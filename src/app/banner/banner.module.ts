import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    BannerComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: "",
        component: BannerComponent
      }
    ]),
    TranslateModule,
  ]
})
export class BannerModule { }
