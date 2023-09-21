import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { DoCheckInGQL,DoCheckInMutation,Response } from '../../graphql/services/generated';
import { Observable, Subscription, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MutationResult } from 'apollo-angular';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnDestroy{
  private fb = inject(FormBuilder);
  checkinForm = this.fb.group({
   
    familyName: [null, [Validators.required, Validators.pattern("^[a-zA-Z]*$"),Validators.maxLength(15)]],
    bookingCode: [null, [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$"),Validators.minLength(6),Validators.maxLength(6)]]
  });
  doCheckInSubscription: Subscription | undefined;

  constructor(private doCheckInGQL: DoCheckInGQL,private _snackBar: MatSnackBar){

  }
  
   doCheckIn(): void {
    this.doCheckInSubscription  = this.doCheckInGQL.mutate({bookingCode:this.checkinForm.get("bookingCode")?.value!,fname:this.checkinForm.get("familyName")?.value!})
    .pipe(
      catchError(err=>{
      
        if(err.networkError instanceof HttpErrorResponse && err.networkError.status === 400){
          this.openSnackBarError(err.networkError.error.errors[0].message,'close');
        }
        if(err.networkError.status === 401){
          this.openSnackBarError('You are not authorized to perform this action','close');
        }
        if(err.networkError.status === 500){
          this.openSnackBarError('There is some problem. Please try again.','close');
        }
        throw err;
      })
    ).subscribe((result: MutationResult<DoCheckInMutation>)=>{ 
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
  ngOnDestroy(): void {
    this.doCheckInSubscription?.unsubscribe();
  }
}
