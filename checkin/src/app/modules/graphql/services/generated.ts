import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Checkin = {
  __typename?: 'Checkin';
  bookingCode?: Maybe<Scalars['String']['output']>;
  checkinStatus?: Maybe<Scalars['Boolean']['output']>;
  checkinWindow?: Maybe<CheckinWindow>;
  fName?: Maybe<Scalars['String']['output']>;
};

export enum CheckinWindow {
  Closed = 'CLOSED',
  Open = 'OPEN',
  Pre = 'PRE'
}

export type Mutation = {
  __typename?: 'Mutation';
  doCheckin?: Maybe<Response>;
};


export type MutationDoCheckinArgs = {
  bookingCode: Scalars['String']['input'];
  fname: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  checkin?: Maybe<Array<Maybe<Checkin>>>;
};

export type Response = {
  __typename?: 'Response';
  checkin?: Maybe<Checkin>;
  message?: Maybe<Scalars['String']['output']>;
};

export type DoCheckInMutationVariables = Exact<{
  bookingCode: Scalars['String']['input'];
  fname: Scalars['String']['input'];
}>;


export type DoCheckInMutation = { __typename?: 'Mutation', doCheckin?: { __typename?: 'Response', message?: string | null, checkin?: { __typename?: 'Checkin', bookingCode?: string | null, checkinStatus?: boolean | null, checkinWindow?: CheckinWindow | null, fName?: string | null } | null } | null };

export const DoCheckInDocument = gql`
    mutation doCheckIn($bookingCode: String!, $fname: String!) {
  doCheckin(bookingCode: $bookingCode, fname: $fname) {
    checkin {
      bookingCode
      checkinStatus
      checkinWindow
      fName
    }
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DoCheckInGQL extends Apollo.Mutation<DoCheckInMutation, DoCheckInMutationVariables> {
    override document = DoCheckInDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }