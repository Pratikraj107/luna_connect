import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { TransactionSevices } from 'src/services/transaction.services';
import { TransactionDataModel } from 'src/model/transaction.model';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import { ViewChild } from '@angular/core';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent = new ChartComponent;
  chartOptions: Partial<any> = {};
  allTranscations: Array<TransactionDataModel> = []
  totalTransCount: number = 0
  totalDebit:any =  0
  totalDebitCount = 0
  totalCedit: number = 0
  AvgDebit: number = 0
  AvgCebit: number = 0
  formattedDebitData: Array<any> = []
  formattedCreditData: Array<any> = []
  yearsLimit: number = 10;
  yearsFilterData: Array <string> = []
  totalMonthlyValue:number = 0
  selectedYr = null
  allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  constructor(private transactionService: TransactionSevices) {
    
  }
  /* Calling function to get all transactions and generating chart on app initialisation */
  ngOnInit ():void {
    this.genPastYears()
    this.getAllTransactions()
    this.generateChart()
  }
  //calculate past 10 years 
  genPastYears () {
    let GetCurrentYear:any = new Date().getFullYear()
    for (let i = 0; i <= this.yearsLimit; i++) {
      this.yearsFilterData.push(GetCurrentYear)
      GetCurrentYear --
    }
  }
 /* get all transaction details from API */
  getAllTransactions(){
    this.transactionService.getallTransactionDetails().subscribe((data: Array<TransactionDataModel>)=>{
      this.allTranscations = data.sort((date1, date2) => {return +new Date(date1.date) - +new Date(date2.date)});
      this.getTotalTransCount();
      this.getDebit( '', '');
      this.getCredit();
      this.generateChart();
    })
  }

  formatDate (d:any) {
    const tempDate = new Date(d)
    const formatedDate:any = tempDate.getDate() +'-' + tempDate.getMonth()  +'-' + tempDate.getFullYear()
    return formatedDate
  }

  generateChart () {
    this.chartOptions = {
      series: [
        {
          name: 'Debit',
          data: this.formattedDebitData
        },
        {
          name: 'Credit',
          data: this.formattedCreditData
        }
      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "All Debit/Credit Transactions",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
      },
      yaxis: {
        min: 5,
        max: 40
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
    
  }


  getTotalTransCount () {
    if (this.allTranscations.length > 0) {
      this.totalTransCount = this.allTranscations.length
    } else {
      this.totalTransCount = 0
    }
  }
   getDebit (fydata:any, fmdata:string) {
    this.allTranscations.filter((debt)=>{
      if(debt.direction.toLowerCase() === 'debit') {
        this.totalDebit = parseInt(this.totalDebit + debt.amount)
        console.log('this.totalDebit.length')
        this.totalDebitCount++
        let temp:any = {'x': this.formatDate(debt.date), 'y': debt.amount}
          this.formattedDebitData.push(temp)
      }
    })
    
   }

   getCredit () {
    this.allTranscations.filter((cred, i)=>{
      if(cred.direction.toLowerCase() === 'credit') {
        this.totalCedit = this.totalCedit + cred.amount
        let temp:any = {'x': this.formatDate(cred.date), 'y': cred.amount}
        this.formattedCreditData.push(temp)
      }
    })
    
  }
  getYearlyData (y:any) {
    this.allMonths.filter((ele, index)=>{
      let tmvalued:any = this.totalMonthData(index + 1, y, 'debit')
      let tmvaluec:any = this.totalMonthData(index + 1, y, 'credit')
      let tempd:any = {'x': ele, 'y':  (tmvalued ? parseInt(tmvalued): 0)}
      let tempc:any = {'x': ele, 'y':  (tmvaluec ? parseInt(tmvaluec): 0)}
      this.formattedDebitData.push(tempd)
      this.formattedCreditData.push(tempc)
     
    })
    
    this.generateChart()
  }

  getMonthlyData (y:any, m:any, dtype:any) {
    this.allTranscations.filter((ele, index)=>{
      if(ele.direction.toLowerCase() == dtype) {
        if (new Date (ele.date).getMonth() + 1 == m && new Date (ele.date).getFullYear() == y) {
          let tempd:any = {'x': this.formatDate(ele.date), 'y': ele.amount}
          this.formattedDebitData.push(tempd)
          this.totalDebit = parseInt(this.totalDebit + ele.amount)
          this.totalDebitCount++
        }
      } else if (ele.direction.toLowerCase() == 'credit'){
        if (new Date (ele.date).getMonth() == m && new Date (ele.date).getFullYear() == y) {
          let tempc:any = {'x': this.formatDate(ele.date), 'y': ele.amount}
          this.formattedCreditData.push(tempc)
        }
      }
    })
    this.totalTransCount = this.formattedDebitData.length + this.formattedCreditData.length
    this.generateChart()
  }

  totalMonthData (m:any, y:any, dtype:any): number {
    this.totalMonthlyValue = 0
    this.allTranscations.filter((data, i)=> {
      if(data.direction.toLowerCase() == dtype) {
      if (new Date (data.date).getMonth() + 1 == m && new Date (data.date).getFullYear() == y) {
        this.totalMonthlyValue = this.totalMonthlyValue + data.amount
        if(dtype == 'debit') {
          this.totalDebit = parseInt(this.totalDebit + data.amount)
          this.totalDebitCount++
        }
        this.totalTransCount++
      }
    }
    })
    return this.totalMonthlyValue
  }
  changeyear (y:any) {
    this.formattedDebitData = []
    this.formattedCreditData = []
    this.totalMonthlyValue = 0
    this.totalDebit = 0
    this.totalDebitCount =0
    this.totalTransCount = 0
    this.selectedYr = y.target.value
    this.getYearlyData(y.target.value)
   
  }

  changemonth (m:any){
    if(this.selectedYr) {
      this.formattedDebitData = []
    this.formattedCreditData = []
    this.totalMonthlyValue = 0
    this.totalDebit = 0
    this.totalTransCount = 0
    this.totalDebitCount =0
      this.getMonthlyData(this.selectedYr, m.target.value, 'debit')
    }
  }
}
