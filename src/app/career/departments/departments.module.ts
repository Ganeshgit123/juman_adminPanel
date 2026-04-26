import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsComponent } from './departments.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DepartmentsComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: DepartmentsComponent
      }
    ]),
    TranslateModule,
  ]
})
export class DepartmentsModule { }
