import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatingComponent } from './operating.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OperatingComponent
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
        component: OperatingComponent
      }
    ]),
    TranslateModule,
  ]
})
export class OperatingModule { }
