import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit{
  private fb = inject(FormBuilder);
  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  states = [

    {name: 'Wyoming', abbreviation: 'WY'}
  ];
  constructor(private apollo:Apollo){

  }

  ngOnInit(): void {
      this.apollo.watchQuery(
        {
          query:gql`{
            books {
              author
              id
              title
            }
          }`
        }
      ).valueChanges.subscribe(result=>{
        console.log('result arrived',result);
      })
  }
  onSubmit(): void {
    alert('Thanks!');
  }
}
