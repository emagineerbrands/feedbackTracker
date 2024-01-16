// @ts-ignore
import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { FeedbackService } from '../../services/feedback-service/feedback.service';
import { ReturnsService } from '../../services/returns-service/returns.service';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  pageTitle:string = 'Dashboard';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': '', 'status':'active'},

  ];



  assigneeData:any;
  returnData:any;
  sourceData:any;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  constructor(
    private service:FeedbackService,
    private rservice:ReturnsService
  ){

  }

  params:any = {
    assignee:{
      fromDate:'',
      toDate:'',
    },
    return:{
      fromDate:'',
      toDate:'',
    },
    source:{
      fromDate:'',
      toDate:'',
    },
    mio:{
      fromDate:'',
      toDate:'',
    },
    country:{
      fromDate:'',
      toDate:'',
    },
  }



  // Bar Chart
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataset [] = [];

  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    // Add other chart options as needed
  };
  public pieChartLabels: string[] = [];
  public pieChartData: ChartDataset[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  // Bar Chart Source
  public barChartLabelsSource: string[] = [];

  public barChartDataSource: ChartDataset [] = [];

  // Bar Chart Source
  public barChartLabelsMIO: string[] = [];

  public barChartDataMIO: ChartDataset [] = [];
  // Bar Chart Source

  public barChartLabelsCountry: string[] = [];

  public barChartDataCountry: ChartDataset [] = [];
  // Pie Chart
  public barChartOptionsCountry: ChartOptions = {
    responsive: true,
    // Add other chart options as needed
  };



  ngOnInit(): void {
    this.getAssigneeCount(this.params.assignee);
    this.getReturnCount();
    this.getSourceCount();
    this.getMIOCOunt();
    this.getCountryCount();
    this.getComplaintTypeCount();

  }

  // Map string to ChartType
  getChartType(): ChartType {
    return this.barChartType as ChartType;
  }

  async getAssigneeCount(assigneeDates:any){
    await this.service.assigneeCountReport(assigneeDates).subscribe((data:any) => {
      data.map((d:any) => {
        d.grand_total = d.fulfillment_count + d.wellness_advisor_count;
      });
      this.assigneeData = data;
      const formattedData = this.formatDataForBarChart(this.assigneeData);
      this.barChartLabels = formattedData.labels;
      this.barChartData = formattedData.datasets;
    });
  }

  formatDataForBarChart(assigneeData: any[]): { labels: string[], datasets: any[] } {
    const labels = ['Fulfillment', 'Wellness Advisor', 'Grand Total'];
    const datasets = assigneeData.map((item, index) => {
      return {
        data: [item.fulfillment_count, item.wellness_advisor_count, item.grand_total],
        label: item.status,
        backgroundColor: this.getBackgroundColor(index)
      };
    });

    return { labels, datasets };
  }
  getBackgroundColor(index: number): string {
    // Define your color logic based on the index or any other condition
    // Example: return a list of colors based on index
    const colors = ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'];
    return colors[index % colors.length];
  }

  async getReturnCount(){
    await this.service.returnCountReport(this.params.return).subscribe((data:any) => {

      this.returnData = data;
      const trueCount = this.returnData[0].return_true_count;
      const falseCount = this.returnData[0].return_false_count;
      this.pieChartLabels = ['True', 'False'];
      this.pieChartData = [
        {
          data: [trueCount, falseCount],
          backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)']
        }
      ];
    });
  }

  async getSourceCount(){
    await this.service.sourceCountReport(this.params.source).subscribe((data:any) => {
      data.map((d:any) => {
        (d.source == '') ? d.source = 'Null': ''
      });
      /*data.map((d:any) => {
        d.grand_total = d.pending_count + d.solved_count;
      });
      // Calculate total counts
      const totalPending = data.reduce((sum:any, d:any) => sum + d.pending_count, 0);
      const totalSolved = data.reduce((sum:any, d:any) => sum + d.solved_count, 0);
      const totalGrandTotal = data.reduce((sum:any, d:any) => sum + d.pending_count + d.solved_count, 0);

      // Add "Grand Total" row
      const grandTotalRow = {
          "source": "Grand Total",
          "pending_count": totalPending,
          "solved_count": totalSolved,
          "grand_total": totalGrandTotal
      };

      // Add the "Grand Total" row to the data array
      data.push(grandTotalRow); */
      this.sourceData = data;
      const formattedData = this.formatDataForBarChartSource(this.sourceData);
      this.barChartLabelsSource = formattedData.labels;
      this.barChartDataSource = formattedData.datasets;
      console.log('this.sourceData', this.sourceData);

    });
  }

  formatDataForBarChartSource(sourceData: any[]): { labels: string[], datasets: ChartDataset[] } {
    const labels: string[] = sourceData.map(item => item.source);

    const datasets: ChartDataset[] = [
      {
        data: sourceData.map(item => item.pending_count),
        label: 'Pending',
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Set your color for pending
      },
      {
        data: sourceData.map(item => item.solved_count),
        label: 'Solved',
        backgroundColor: 'rgba(255, 99, 132, 0.7)', // Set your color for solved
      }
      // Add more datasets if needed for different categories
    ];

    return { labels, datasets };
  }

  async getMIOCOunt(){
    await this.service.mioCountReport(this.params.mio).subscribe((data:any) => {
      const formattedData = this.formatDataForBarChartMIO(data);
      this.barChartLabelsMIO = formattedData.labels;
      this.barChartDataMIO = formattedData.datasets;
    });
  }

  formatDataForBarChartMIO(assigneeData: any[]): { labels: string[], datasets: any[] } {
    const labels = ['Full-Order', 'SKU'];
    const datasets = assigneeData.map((item, index) => {
      return {
        data: [item.full_order_count, item.sku_count],
        label: item.mio,
        backgroundColor: this.getBackgroundColor(index)
      };
    });

    return { labels, datasets };
  }


  async getCountryCount(){
    await this.service.countryCountReport(this.params.country).subscribe((data:any) => {
      const formattedData = this.formatDataForBarChartCountry(data);
      this.barChartLabelsCountry = formattedData.labels;
      this.barChartDataCountry = formattedData.datasets;
    });
  }

  formatDataForBarChartCountry(assigneeData: any[]): { labels: string[], datasets: any[] } {
    const labels = ['Full-Order', 'SKU'];
    const datasets = assigneeData.map((item, index) => {
      return {
        data: [item.full_order_count, item.sku_count],
        label: item.canada,
        backgroundColor: this.getBackgroundColor(index)
      };
    });

    return { labels, datasets };
  }

  async getComplaintTypeCount(){
    await this.service.complaintTypeCOuntReport(this.params.country).subscribe((data:any) => {
      console.log('complaint', data);
    });
  }


}
