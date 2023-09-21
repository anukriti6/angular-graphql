import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinComponent } from './checkin/checkin.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes,RouterModule } from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [{
  path:'',
  component:CheckinComponent
}];


@NgModule({
  declarations: [
    CheckinComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ],
  exports:[ MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule]
})
export class CheckinModule { }
