import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { DoCheckInGQL,DoCheckInMutation,Response } from '../../graphql/services/generated';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MutationResult } from 'apollo-angular';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit{
  private fb = inject(FormBuilder);
  checkinForm = this.fb.group({
   
    familyName: ['gupta', [Validators.required, Validators.pattern("^[a-zA-Z]*$"),Validators.maxLength(15)]],
    bookingCode: ['k12345', [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$"),Validators.minLength(6),Validators.maxLength(6)]]
  });

  constructor(private doCheckInGQL: DoCheckInGQL,private _snackBar: MatSnackBar){

  }

  ngOnInit(): void {
      
  }
  doCheckIn(): void {
    this.doCheckInGQL.mutate({bookingCode:this.checkinForm.get("bookingCode")?.value!,fname:this.checkinForm.get("familyName")?.value!})
    .pipe(
      catchError((err:any)=>{
        console.log(err);
        this.openSnackBarError(err.networkError?.error.errors[0].message,'close');
        throw err;
      })
    )
    .subscribe((result: MutationResult<DoCheckInMutation>)=>{ 

     this.openSnackBarSuccess(result.data?.doCheckin?.message!,'close');
    });
  }
  openSnackBarError(message: string, action: string) {
    this._snackBar.open(message, action,{
      verticalPosition:'top',
      panelClass: ['error']
    });
  }

  openSnackBarSuccess(message: string, action: string) {
    this._snackBar.open(message, action,{
      verticalPosition:'top',
      panelClass: ['success']
    });
  }
}
