import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    RouterModule.forChild([
      {
        path: "",
        component: ContactUsComponent
      }
    ]),
    TranslateModule,
  ]
})
export class ContactUsModule { }
