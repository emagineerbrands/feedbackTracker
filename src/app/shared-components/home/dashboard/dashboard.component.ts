import { Component, OnInit } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Chart, ChartItem } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
})

export class DashboardComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  //   var salesChartCanvas = document.getElementById("line-chart") as ChartItem;
  //   var salesChartData = {
  //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //     datasets: [
  //       {
  //         label: 'Digital Goods',
  //         backgroundColor: 'rgba(60,141,188,0.9)',
  //         borderColor: 'rgba(60,141,188,0.8)',
  //         pointRadius: false,
  //         pointColor: '#3b8bba',
  //         pointStrokeColor: 'rgba(60,141,188,1)',
  //         pointHighlightFill: '#fff',
  //         pointHighlightStroke: 'rgba(60,141,188,1)',
  //         data: [28, 48, 40, 19, 86, 27, 90]
  //       },
  //       {
  //         label: 'Electronics',
  //         backgroundColor: 'rgba(210, 214, 222, 1)',
  //         borderColor: 'rgba(210, 214, 222, 1)',
  //         pointRadius: false,
  //         pointColor: 'rgba(210, 214, 222, 1)',
  //         pointStrokeColor: '#c1c7d1',
  //         pointHighlightFill: '#fff',
  //         pointHighlightStroke: 'rgba(220,220,220,1)',
  //         data: [65, 59, 80, 81, 56, 55, 40]
  //       }
  //     ]
  //   }
  //   var salesChartOptions = {
  //     maintainAspectRatio: false,
  //     responsive: true,
  //     legend: {
  //       display: false
  //     },
  //     scales: {
  //       xAxes: [{
  //         gridLines: {
  //           display: false
  //         }
  //       }],
  //       yAxes: [{
  //         gridLines: {
  //           display: false
  //         }
  //       }]
  //     }
  //   }

  //   var salesChart = new Chart("line-chart", {
  //     type: 'line',
  //     data: {
  //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //       datasets: [{
  //         label: '# of Votes',
  //         data: [12, 19, 3, 5, 2, 3],
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   })
  // }
  }
  onOrders(){
    this.router.navigateByUrl("/dashboard/orders");
  }

}
