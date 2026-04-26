import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from './headers.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    HeadersComponent
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
        component: HeadersComponent
      }
    ]),
    TranslateModule,
  ]
})
export class HeadersModule { }
