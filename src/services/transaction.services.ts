import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotFoundError } from 'src/errors/not-found.errors';
import { AppErrors } from 'src/errors/app.errors';
import { Router } from '@angular/router';

@Injectable()

export class TransactionSevices {
base_url = 'https://5c937fdb4dca5d0014ad825b.mockapi.io/data'
constructor(private http: HttpClient, private router: Router) {}

httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
};

getallTransactionDetails() {
    return this.http.get(this.base_url, this.httpOptions)
    .pipe(
      map((res: any) => {
        if (res) {   
          return res;
        } else {
          return false;
        }
      }),
      catchError((error: Response) => {
        if (error.status === 400) {
          return throwError(new NotFoundError(error));
        }
        return throwError(new AppErrors(error));
      })
    );
}
}
