import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TransactionSevices } from 'src/services/transaction.services';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    FormsModule
  ],
  providers: [TransactionSevices],
  bootstrap: [AppComponent]
})
export class AppModule { }
