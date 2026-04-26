import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesSectionComponent } from './images-section.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ImagesSectionComponent
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
        component: ImagesSectionComponent
      }
    ]),
    TranslateModule,
  ]
})
export class ImagesSectionModule { }
