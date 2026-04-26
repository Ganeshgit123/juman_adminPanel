import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SucessfulPartnerComponent } from './sucessful-partner.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    SucessfulPartnerComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path: "",
        component: SucessfulPartnerComponent
      }
    ]),
    TranslateModule,
  ]
})
export class SucessfulPartnerModule { }
