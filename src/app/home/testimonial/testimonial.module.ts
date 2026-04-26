import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialComponent } from './testimonial.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    TestimonialComponent
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
        component: TestimonialComponent
      }
    ]),
    TranslateModule,
  ]
})
export class TestimonialModule { }
