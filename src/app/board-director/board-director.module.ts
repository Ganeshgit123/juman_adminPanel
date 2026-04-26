import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardDirectorComponent } from './board-director.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    BoardDirectorComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: "",
        component: BoardDirectorComponent
      }
    ]),
    TranslateModule,
  ]
})
export class BoardDirectorModule { }
