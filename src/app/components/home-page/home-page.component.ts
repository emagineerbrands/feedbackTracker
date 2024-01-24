// @ts-ignore
import { Component, AfterViewInit  } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { FeedbackService } from '../../services/feedback-service/feedback.service';
import { ReturnsService } from '../../services/returns-service/returns.service';
import flatpickr from 'flatpickr';
import { ChartParams } from '../../interface/ChartParams';
import { DateRange } from '../../interface/DateRange';
import { ColorService } from '../../services/color-service/color.service';
import { DateConvertService } from '../../services/date-convert-service/date-convert.service';
import { ChartCanvasParams } from '../../interface/ChartCanvasParams';

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
export class HomePageComponent implements AfterViewInit  {

  pageTitle:string = 'Dashboard';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': '', 'status':'active'},

  ];

  //Chart Basic Info
  cardBackgroundInfo:string = 'card-info';
  public StackedbarChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  // Bar Chart
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';

  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    // Add other chart options as needed
  };

  //Assignee Info
  assigneeChartData:ChartDataset[] = [];
  assigneeChartLabels: string[] = [];
  assigneeData:any;

  //Return Info
  public returnChartLabels: string[] = [];
  public returnChartData: ChartDataset[] = [];
  public returnTableDataFormate:any;

  //Source Info
  public sourceChartLabels: string[] = [];
  public sourceChartData: ChartDataset[] = [];
  public sourceTableDataFormate:any;

  //MIO Info
  public mioChartLabels: string[] = [];
  public mioChartData: ChartDataset[] = [];
  public mioTableDataFormate:any;

  //MIO Info
  public countryChartLabels: string[] = [];
  public countryChartData: ChartDataset[] = [];
  public countryTableDataFormate:any;

  params:ChartParams = {
    Assignee:{
      FromDate:'',
      ToDate:'',
    },
    Return:{
      FromDate:'',
      ToDate:'',
    },
    Source:{
      FromDate:'',
      ToDate:'',
    },
    MIO:{
      FromDate:'',
      ToDate:'',
    },
    Country:{
      FromDate:'',
      ToDate:'',
    },
    ComplaintType:{
      FromDate:'',
      ToDate:'',
      Solution:'Cancellation'
    },
    Complaint:{
      FromDate:'',
      ToDate:'',
      ComplaintType:'Fitting'
    },
    SKU:{
      FromDate:'',
      ToDate:'',
      Complaint:'Asking for receipt,Stolen,Box destroyed/smashed',
      ComplaintType:'Order inquiry,Defective items'
    },
  }


  staticData:any;

  constructor(
    private service:FeedbackService,
    private rservice:ReturnsService,
    private color: ColorService,
    private dateRange: DateConvertService,
  ){}


  dateFromChild(value: DateRange, chartCat:string){
    switch(chartCat){
      case 'Assignee':
        this.params.Assignee = value;
        this.getAssigneeCount();
        break;
      case 'Return':
        this.params.Return = value;
        this.getReturnCount();
        break;
      case 'Source':
        this.params.Source = value;
        this.getSourceCount();
        break;
      case 'MIO':
        this.params.MIO = value;
        this.getMIOCOunt();
        break;
      case 'Country':
        this.params.Country = value;
        this.getCountryCount();
        break;
      default:
        break;
    }
  }

  ngAfterViewInit(): void {

  }

  public barChartLabelsComplaint: string[] = [];

  public barChartDataComplaint: ChartDataset [] = [];


  // Pie Chart
  public barChartOptionsNoStack: ChartOptions = {
    responsive: true,
    // Add other chart options as needed
  };



  ngOnInit(): void {
    this.getAssigneeCount();
    this.getReturnCount();
    this.getSourceCount();
    this.getMIOCOunt();
    this.getCountryCount();
    this.getComplaintTypeCount();
    this.getComplaintTypeCountTable();
    this.getStaticData();
    this.getCountOfComplaint();
    this.getCountOfComplaintTable();
    this.getSKUCountReport();

  }

  async getStaticData(){
    await this.service.getAllStaticData().subscribe((data:any) => {
      this.staticData = data;
    });
  }

  async getAssigneeCount(){
    await this.service.assigneeCountReport(this.params.Assignee).subscribe((data:any) => {
      data.map((d:any) => {
        d.grand_total = d.fulfillment_count + d.wellness_advisor_count;
      });

      const assigneeData = this.assigneeTableData(data);
      this.assigneeData = assigneeData;
      this.assigneeChartData = assigneeData.chartData.datasets;
      this.assigneeChartLabels  = assigneeData.chartData.labels;
    });
  }

  formatDataForBarChart(assigneeData: any[]): { labels: string[], datasets: any[] } {
    const labels = ['Fulfillment', 'Wellness Advisor', 'Grand Total'];
    const datasets = assigneeData.map((item, index) => {
      return {
        data: [item.fulfillment_count, item.wellness_advisor_count, item.grand_total],
        label: item.status,
        backgroundColor: this.color.getBackgroundColor(index)
      };
    });

    return { labels, datasets };
  }

  assigneeTableData(assigneeData: any[]){
    const tableHeader:string[] = ['Status', 'Fulfillment', 'Wellness Advisors', 'Grand Total'];
    const tableBody:any[]=assigneeData;
    const formattedData = this.formatDataForBarChart(assigneeData);
    return {'tableHeader':tableHeader, 'tableBody':tableBody, 'chartData':formattedData};
  }


  async getReturnCount(){
    await this.service.returnCountReport(this.params.Return).subscribe((data:any) => {
      this.returnTableDataFormate = this.returnTableData(data);
      const trueCount = data[0].return_true_count;
      const falseCount = data[0].return_false_count;
      this.returnChartLabels = ['Return', 'No-Return'];
      this.returnChartData = [
        {
          data: [trueCount, falseCount],
          backgroundColor: ['#f53d3d', '#5b5bf5']
        }
      ];
    });
  }

  returnTableData(returnData:any){
    const tableHeader = ['Status', 'Count of Return'];
    const tableBody:any[] = [
      {
        'name':'False',
        'return_false_count':returnData[0].return_false_count
      },
      {
        'name':'True',
        'return_true_count':returnData[0].return_true_count
      },
      {
        'name':'Grand Total',
        'return_total_count':returnData[0].return_true_count+returnData[0].return_false_count
      }
    ];
    return {'tableHeader':tableHeader, 'tableBody':tableBody};
  }

  async getSourceCount(){
    await this.service.sourceCountReport(this.params.Source).subscribe((data:any) => {
      data.map((d:any) => {
        (d.source == '') ? d.source = 'Null': ''
      });
      // Add the "Grand Total" row to the data array

      this.sourceTableDataFormate = this.getFormatedSourceTable(data);
      const formattedData = this.formatDataForBarChartSource(data);
      this.sourceChartLabels = formattedData.labels;
      this.sourceChartData = formattedData.datasets;

    });
  }

  getFormatedSourceTable(data:any){
    const tableHeader = ['Label', 'Pending', 'Solved', 'Grand Total'];
    let sourceDataTable = [...data];
    sourceDataTable.map((d:any) => {
      d.grand_total = d.pending_count + d.solved_count;
    });
    // Calculate total counts
    const totalPending = sourceDataTable.reduce((sum:any, d:any) => sum + d.pending_count, 0);
    const totalSolved = sourceDataTable.reduce((sum:any, d:any) => sum + d.solved_count, 0);
    const totalGrandTotal = sourceDataTable.reduce((sum:any, d:any) => sum + d.pending_count + d.solved_count, 0);
    // Add "Grand Total" row
    const grandTotalRow = {
      "source": "Grand Total",
      "pending_count": totalPending,
      "solved_count": totalSolved,
      "grand_total": totalGrandTotal
    };

    // Add the "Grand Total" row to the data array
    sourceDataTable.push(grandTotalRow);
    return {'tableHeader':tableHeader, 'tableBody':sourceDataTable};
  }

  formatDataForBarChartSource(sourceData: any[]): { labels: string[], datasets: ChartDataset[] } {
    const labels: string[] = sourceData.map(item => item.source);

    const datasets: ChartDataset[] = [
      {
        data: sourceData.map(item => item.pending_count),
        label: 'Pending',
        backgroundColor: '#f53d3d', // Set your color for pending
      },
      {
        data: sourceData.map(item => item.solved_count),
        label: 'Solved',
        backgroundColor: '#5b5bf5', // Set your color for solved
      }
      // Add more datasets if needed for different categories
    ];

    return { labels, datasets };
  }

  async getMIOCOunt(){
    await this.service.mioCountReport(this.params.MIO).subscribe((data:any) => {
      data.map((d:any) => {
        d.mio = (d.mio == 'true') ? 'Multiple-Order': 'Single-Order';
      });
      // Add the "Grand Total" row to the data array
      this.mioTableDataFormate = this.formatMIOTableData(data);
      const formattedData = this.formatDataForBarChartMIO(data);
      this.mioChartLabels = formattedData.labels;
      this.mioChartData = formattedData.datasets;
    });
  }

  formatMIOTableData(data:any){
    const tableHeader = ["Label", "Full-Order", "SKU", "Grand Total"]
    let mioDataTable = [...data];
    mioDataTable.map((d:any) => {
      d.grand_total = d.full_order_count + d.sku_count;
    });
    // Calculate total counts
    const full_order_count = mioDataTable.reduce((sum:any, d:any) => sum + d.full_order_count, 0);
    const sku_count = mioDataTable.reduce((sum:any, d:any) => sum + d.sku_count, 0);
    const totalGrandTotal = mioDataTable.reduce((sum:any, d:any) => sum + d.full_order_count + d.sku_count, 0);

    // Add "Grand Total" row
    const grandTotalRow = {
        "mio": "Grand Total",
        "full_order_count": full_order_count,
        "sku_count": sku_count,
        "grand_total": totalGrandTotal
    };

    // Add the "Grand Total" row to the data array
    mioDataTable.push(grandTotalRow);
    return {'tableHeader':tableHeader, 'tableBody':mioDataTable};
  }

  formatDataForBarChartMIO(assigneeData: any[]): { labels: string[], datasets: any[] } {
    const labels = ['Full-Order', 'SKU'];

    // Calculate total counts
    const totalFullOrder = assigneeData.reduce((sum: any, item: any) => sum + item.full_order_count, 0);
    const totalSKU = assigneeData.reduce((sum: any, item: any) => sum + item.sku_count, 0);

    const datasets = assigneeData.map((item, index) => {
      const percentageFullOrder = (item.full_order_count / totalFullOrder) * 100;
      const percentageSKU = (item.sku_count / totalSKU) * 100;

      return {
        data: [percentageFullOrder, percentageSKU],
        label: item.mio,
        backgroundColor: this.color.getBackgroundColor(index)
      };
    });

    return { labels, datasets };
  }



  async getCountryCount(){
    await this.service.countryCountReport(this.params.Country).subscribe((data:any) => {
      data.map((d:any) => {
        d.canada = (d.canada == 'true') ? 'Canada': 'Out-Side Canada';
      });

      this.countryTableDataFormate = this.formateCountryTableData(data);

      const formattedData = this.formatDataForBarChartCountry(data);
      this.countryChartLabels = formattedData.labels;
      this.countryChartData = formattedData.datasets;
    });
  }

  formateCountryTableData(data:any){
    const tableHeader = ["Label", "Full-Order", "SKU", "Grand Total"]
    let countryTableData = [...data];
    countryTableData.map((d:any) => {
      d.grand_total = d.full_order_count + d.sku_count;
    });
    // Calculate total counts
    const full_order_count = countryTableData.reduce((sum:any, d:any) => sum + d.full_order_count, 0);
    const sku_count = countryTableData.reduce((sum:any, d:any) => sum + d.sku_count, 0);
    const totalGrandTotal = countryTableData.reduce((sum:any, d:any) => sum + d.full_order_count + d.sku_count, 0);

    // Add "Grand Total" row
    const grandTotalRow = {
        "canada": "Grand Total",
        "full_order_count": full_order_count,
        "sku_count": sku_count,
        "grand_total": totalGrandTotal
    };

    // Add the "Grand Total" row to the data array
    countryTableData.push(grandTotalRow);
    return {'tableHeader':tableHeader, 'tableBody':countryTableData};
  }

  formatDataForBarChartCountry(assigneeData: any[]): { labels: string[], datasets: any[] } {
    const labels = ['Full-Order', 'SKU'];

    // Calculate total for each category
    const totalFullOrder = assigneeData.reduce((sum, item) => sum + item.full_order_count, 0);
    const totalSKU = assigneeData.reduce((sum, item) => sum + item.sku_count, 0);

    const datasets = assigneeData.map((item, index) => {
      // Calculate percentage for each dataset
      const fullOrderPercentage = (item.full_order_count / totalFullOrder) * 100;
      const skuPercentage = (item.sku_count / totalSKU) * 100;

      return {
        data: [fullOrderPercentage, skuPercentage],
        label: item.canada,
        backgroundColor: this.color.getBackgroundColor(index),
      };
    });

    return { labels, datasets };
  }


  complaintTypeColumns:any[] = [];
  solutionRows:any[] = [];
  complaintTypeData:any[] = [];
  async getComplaintTypeCount(){
    await this.service.complaintTypeCountReport(this.params.ComplaintType).subscribe((data:any) => {
      this.complaintTypeData = data;
      this.getComplaintTypeCountTable();
      const formattedData = this.formatDataForBarChartComplaintType(data);
      this.barChartLabelsComplaint = formattedData.labels;
      this.barChartDataComplaint = formattedData.datasets;
    });
  }
  async getComplaintTypeCountTable(){
    let complaint:any = {FromDate:'',
    ToDate:'',
    Solution:''
  };
    complaint.FromDate = this.params.ComplaintType.FromDate;
    complaint.ToDate = this.params.ComplaintType.ToDate;
    await this.service.complaintTypeCountReport(complaint).subscribe((data:any) => {
      this.complaintTypeColumns = Array.from(new Set(data.map((item:any) => item.complaint_type)));
      this.solutionRows = Array.from(new Set(data.map((item:any) => item.solution)));

    });
  }

  getCOuntOfComplaintType(complaint:any, solution:any){
    let complaintTypeCount:number = 0;
    this.complaintTypeData.filter((complaintType:any) => {
      if(complaintType.complaint_type == complaint && complaintType.solution == solution) {  complaintTypeCount = Number(complaintType.count); }
    });
    return complaintTypeCount;
  }

  formatDataForBarChartComplaintType(data:any[]): { labels: string[], datasets: any[] } {
    // Extract unique complaint types
    const uniqueComplaintTypes = Array.from(new Set(data.map((item:any) => item.complaint_type)));

    // Extract unique solutions
    const uniqueSolutions = Array.from(new Set(data.map((item:any) => item.solution)));

    const labels = uniqueComplaintTypes.map(complaintType => {
      const solutionsForType = uniqueSolutions.filter(solution =>
        data.some((item:any) => item.complaint_type === complaintType && item.solution === solution)
      );

      return `${complaintType}`;
    });

    const datasets = uniqueSolutions.map(solution => {
      const dataForSolution = uniqueComplaintTypes.map(complaintType =>
        data.find((item:any) => item.complaint_type === complaintType && item.solution === solution)?.count || 0
      );

      return {
        data: dataForSolution,
        label: solution,
        backgroundColor: this.color.getRandomHexColor(),
      };
    });

    return { labels, datasets };
  }

  barChartLabelsComplaintCount: string[] = [];
  barChartDataComplaintCount: any[] = [];
  complaintData:any;
  async getCountOfComplaint(){
    await this.service.complaintCountReport(this.params.Complaint).subscribe((data:any) => {
      const complaitData = this.formatDataForBarChartComplaint(data);
      this.barChartLabelsComplaintCount = complaitData.labels;
      this.barChartDataComplaintCount = complaitData.datasets;
    });
  }
  async getCountOfComplaintTable(){
    let complaint:any
    complaint.FromDate = this.params.Complaint.FromDate;
    complaint.ToDate = this.params.Complaint.ToDate;
    complaint.ComplaintType = '';
    await this.service.complaintCountReport(complaint).subscribe((data:any) => {
      console.log('table', data);
      this.uniqueComplaints = Array.from(new Set(data.map((item: any) => item.complaint)));
      this.uniqueSolutions = Array.from(new Set(data.map((item: any) => item.solution)));
      this.complaintData = data;
    });
  }

  uniqueComplaints:any;
  uniqueSolutions:any;

  getTableComplaintDataFormate(solution: string, complaint: string){

    const item = this.complaintData.find((d: any) => d.complaint === complaint && d.solution === solution);
    return item ? item.count : 0;
  }

  getUniqueComplaintTypes(data: any[]): string[] {
    return [...new Set(data.map(item => item.complaint_type))];
  }

  transformDataForChart(data: any[]): any[] {
    const uniqueComplaintTypes = this.getUniqueComplaintTypes(data);

    return uniqueComplaintTypes.map(complaintType => {
      const filteredData = data.filter(item => item.complaint_type === complaintType);
      const counts = filteredData.map(item => item.count);
      return { data: counts, label: complaintType };
    });
  }

  formatDataForBarChartComplaint(data: any[]): { labels: string[], datasets: any[] } {
    const uniqueComplaints = Array.from(new Set(data.map((item: any) => item.complaint)));
    const uniqueSolutions = Array.from(new Set(data.map((item: any) => item.solution)));

    const labels = uniqueComplaints.map(complaint => `${complaint}`);

    const datasets = uniqueSolutions.map(solution => {
      const dataForSolution = uniqueComplaints.map(complaint => {
        const item = data.find((d: any) => d.complaint === complaint && d.solution === solution);
        return item ? item.count : 0;
      });

      return {
        data: dataForSolution,
        label: solution,
        backgroundColor: this.color.getRandomHexColor(),
      };
    });

    return { labels, datasets };
  }



  SKUbarChartData: { datasets: any[], labels: string[] } = { datasets: [], labels: [] };

  barChartLegend = true;
  SKUbarChartType = 'horizontalBar';

  barChartLabelsSKU: string[] = [];
  barChartDataSKU: any[] = [];

  async getSKUCountReport(){
    console.log('this.params.SKU', this.params.SKU);
    await this.service.skuCountReport(this.params.SKU).subscribe((res:any) => {
      const complaitData = this.formatDataForBarChartsku(res);
      this.barChartLabelsSKU = complaitData.labels;
      this.barChartDataSKU = complaitData.datasets;
    });
  }

  formatDataForBarChartsku(data: any[]): { labels: string[], datasets: any[] } {
    // Extract unique SKUs
    const uniqueSKUs = Array.from(new Set(data.map((item: any) => item.sku)));

    // Extract unique complaint types
    const uniqueComplaintTypes = Array.from(new Set(data.map((item: any) => item.complaint_type)));

    const labels = uniqueSKUs.map(sku => `${sku}`);

    const datasets = uniqueComplaintTypes.map(complaintType => {
      const dataForComplaintType = uniqueSKUs.map(sku => {
        const item = data.find((d: any) => d.sku === sku && d.complaint_type === complaintType);
        return item ? item.count : 0;
      });

      return {
        data: dataForComplaintType,
        label: complaintType,
        backgroundColor: this.color.getRandomHexColor(),
      };
    });

    // Sort the datasets based on the total count in descending order
    datasets.sort((a, b) => {
      const sumA = a.data.reduce((acc, val) => acc + val, 0);
      const sumB = b.data.reduce((acc, val) => acc + val, 0);
      return sumB - sumA;
    });

    return { labels, datasets };
  }



}
