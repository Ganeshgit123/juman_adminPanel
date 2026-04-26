import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareerComponent } from './career.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CareerComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    RouterModule.forChild([
      {
        path: "",
        component: CareerComponent
      }
    ]),
    TranslateModule,
  ]
})
export class CareerModule { }
