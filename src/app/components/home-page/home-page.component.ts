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
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { InternalService } from '../../services/internal-service/internal.service';
import { Numbers } from '../../enum/Numbers.enum';

declare var $: any; // Declare jQuery

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

  Numbers = Numbers;
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
    plugins: {
      datalabels: {
        display: false,
      }
    }
  };
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      datalabels: {
        display: false,
      }
    }
  };

  // Bar Chart
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';


  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          const dataArr = ctx.chart.data.datasets[0].data;
          dataArr.forEach(data => {
            if (typeof data === 'number') {
              sum += data;
            }
          });
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          // You can also set the size here, for example:
          size: 20, // Adjust the size as needed
        }
      }
    }
  };

  //Assignee Info
  public assigneeChartData:ChartDataset[] = [];
  public assigneeChartLabels: string[] = [];
  public assigneeData:any;
  public assigneeDataExist:boolean = true;
  public assigneecardCountExist:boolean = false;
  public assigneecardCount:number = 0;

  //Return Info
  public returnChartLabels: string[] = [];
  public returnChartData: ChartDataset[] = [];
  public returnTableDataFormate:any;
  public returnDataExist:boolean = true;
  public returncardCountExist:boolean = false;
  public returncardCount:number = 0;

  //Source Info
  public sourceChartLabels: string[] = [];
  public sourceChartData: ChartDataset[] = [];
  public sourceTableDataFormate:any;
  public sourceDataExist:boolean = true;
  public sourcecardCountExist:boolean = false;
  public sourcecardCount:number = 0;

  //MIO Info
  public mioChartLabels: string[] = [];
  public mioChartData: ChartDataset[] = [];
  public mioTableDataFormate:any;
  public mioDataExist:boolean = true;
  public miocardCountExist:boolean = false;
  public miocardCount:number = 0;

  //MIO Info
  public countryChartLabels: string[] = [];
  public countryChartData: ChartDataset[] = [];
  public countryTableDataFormate:any;
  public countryDataExist:boolean = true;
  public countrycardCountExist:boolean = false;
  public countrycardCount:number = 0;

  //Complaint Type
  public complaintTypeChartLabels: string[] = [];
  public complaintTypeChartData: ChartDataset [] = [];
  public complaintTypeTableData:any;
  public complaintTypeDataExist:boolean = true;
  public complaintTypecardCountExist:boolean = false;
  public complaintTypecardCount:number = 0;

  //Complaint
  public complaintChartLabels: string[] = [];
  public complaintChartData: ChartDataset[] = [];
  public complaintTableData:any;
  public complaintDataExist:boolean = true;
  public complaintcardCountExist:boolean = false;
  public complaintcardCount:number = 0;

  //SKU
  public skuChartLabels: string[] = [];
  public skuChartData: ChartDataset[] = [];
  public skuTableData:any;
  public skuDataExist:boolean = true;
  public skucardCountExist:boolean = false;
  public skucardCount:number = 0;

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
      Solution:1
    },
    Complaint:{
      FromDate:'',
      ToDate:'',
      ComplaintType:1,
      Complaint:''
    },
    SKU:{
      FromDate:'',
      ToDate:'',
      ComplaintType:1,
      Complaint:''
    },
  }


  // Dropdown Data for Complaint
  staticData:any;
  solutions:any;
  complaint:any[]=[];
  complaintTemp:any[]=[];
  skuComplaint:any[]=[];

  constructor(
    private feedbackService:FeedbackService,
    private color: ColorService,
    private dateRange: DateConvertService,
    public internalService: InternalService,
  ){
    Chart.register(ChartDataLabels);
  }


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
      case 'Complaint Type':
        this.params.ComplaintType.FromDate = value.FromDate;
        this.params.ComplaintType.ToDate = value.ToDate;
        this.getComplaintTypeCount();
        this.getComplaintTypeCountTable();

        break;
      case 'Complaint':
        this.params.Complaint.FromDate = value.FromDate;
        this.params.Complaint.ToDate = value.ToDate;
        this.getCountOfComplaint();
        this.getCountOfComplaintTable();
        break;
      case 'SKU':
        this.params.SKU.FromDate = value.FromDate;
        this.params.SKU.ToDate = value.ToDate;
        this.getSKUCountReport();
        this.getCountOfSKUTable();

        break;
      default:
        break;
    }
  }

  ngAfterViewInit(): void {
    $(document).ready(() => {
      $('.select2').select2().on('change', (e:any) => {
        // Handle the change event
        let selectedValue = $(e.currentTarget).val();
        this.params.Complaint.Complaint = selectedValue.join(',');
        this.getCountOfComplaint();

      });
      $('.select2SKU').select2().on('change', (e:any) => {
        // Handle the change event
        let selectedValue = $(e.currentTarget).val();
        this.params.SKU.Complaint = selectedValue.join(',');
        this.getSKUCountReport();
      });
    });
  }




  // Pie Chart
  public barChartOptionsNoStack: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      }
    }
    // Add other chart options as needed
  };

  public barChartOptionsNoStackNoColor: ChartOptions = {
    responsive: true,
    plugins:{
      legend:{
        labels:{
          boxWidth:0,
        }
      },
      datalabels: {
        display: false,
      }
    },

    // Add other chart options as needed
  };

  public SKUbarChartOptionsNoStack: ChartOptions = {
    indexAxis: 'y',
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      }
    }
    // Add other chart options as needed
  };



  ngOnInit(): void {
    this.params = this.internalService.initializeDateParams(this.params);
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
    this.getCountOfSKUTable();
  }


  //********* Static Dropdown Data *************//

  async getStaticData(){
    await this.feedbackService.getAllStaticData().subscribe((data:any) => {
      this.staticData = data;
      this.solutions = this.staticData.solutions.sort((a:any, b:any) => {
        if (a.solution < b.solution) return -1;
        if (a.solution > b.solution) return 1;
        return 0;
      });
      this.staticData.complaint.forEach((c: any) => {
        c.complaint_type.forEach((ct: string) => {
          this.complaint.push(ct);
        });
      });
      this.complaint = this.complaint.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      this.skuComplaint = this.complaintTemp = [...this.complaint];
      this.complaint = this.complaintTemp.filter((x:any) => x.complaint_id === this.params.Complaint.ComplaintType);
    });
  }

  sortdata(data:any){
    data.sort((a:any, b:any) => {
      if (a.solution < b.solution) return -1;
      if (a.solution > b.solution) return 1;
      return 0;
    });
    return data;
  }

  selectComplaint(event:any){
    this.params.Complaint.Complaint = "";
    this.complaint = this.complaintTemp.filter((x:any) => x.complaint_id == event.target.value);
    this.getCountOfComplaint();
  }


  //********* Assignee *************//

  async getAssigneeCount(){
    await this.feedbackService.assigneeCountReport(this.params.Assignee).subscribe((data:any) => {
      this.assigneeDataExist = (data.length > 0);
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
    // Assuming 'assigneeData' has been pre-processed to include an 'Others' category and exclude 'Grand Total'

    // Labels now represent each assignee
    const labels = assigneeData.map(item => item.assignee || 'Others');

    // Create datasets for 'Pending' and 'Solved' counts
    const pendingDataset = {
      label: 'Pending',
      data: assigneeData.map(item => item.pending_count),
      backgroundColor: '#f53d3d', // Example color for Pending
      borderColor: '#f53d3d', // Example border color for Pending
      borderWidth: 1
    };

    const solvedDataset = {
      label: 'Solved',
      data: assigneeData.map(item => item.solved_count),
      backgroundColor: '#5b5bf5', // Example color for Solved
      borderColor: '#5b5bf5', // Example border color for Solved
      borderWidth: 1
    };

    // Compile the datasets for the chart
    const datasets = [pendingDataset, solvedDataset];

    // Return the restructured data for the chart
    return { labels, datasets };
  }

  assigneeTableData(assigneeData: any[]) {
    const tableHeader = ['Assignee', 'Pending', 'Solved', 'Total'];

    // Initialize totals for the grand summary
    let totalPending = 0;
    let totalSolved = 0;

    // Process each assignee's data, calculate totals, and handle null assignees
    const tableBody = assigneeData.map(item => {
      // Label null assignees as "Others"
      const assigneeName = item.assignee || 'Others';

      // Sum up for grand totals
      totalPending += item.pending_count;
      totalSolved += item.solved_count;

      // Calculate this item's total
      const total = item.pending_count + item.solved_count;


      // Return the item's data including its total
      return {
        assignee: assigneeName,
        pending_count: item.pending_count,
        solved_count: item.solved_count,
        total: total
      };
    });

    // Calculate the grand total for all rows
    const grandTotal = totalPending + totalSolved;

    // Append the "Grand Total" row to tableBody
    tableBody.push({
      assignee: 'Grand Total',
      pending_count: totalPending,
      solved_count: totalSolved,
      total: grandTotal
    });

    this.assigneecardCount = totalPending;

    // Format data for the chart, including the grand total information
    const formattedData = this.formatDataForBarChart(assigneeData);

    // Return the structured data including the new "Grand Total" row
    return { tableHeader, tableBody, chartData: formattedData };
  }


  //********* Return *************//

  async getReturnCount(){
    await this.feedbackService.returnCountReport(this.params.Return).subscribe((data:any) => {
      this.returnTableDataFormate = this.returnTableData(data);
      const trueCount = data[0].return_true_count;
      const falseCount = data[0].return_false_count;
      this.returnChartLabels = ['Return', 'No-Return'];
      this.returnChartData = [
        {
          data: [trueCount, falseCount],
          backgroundColor: ['#f53d3d', '#5b5bf5'],
          borderWidth: 0,
        }
      ];
      this.returnDataExist = (trueCount > 0 || falseCount > 0);
    });
  }

  returnTableData(returnData:any){
    const tableHeader = ['Status', 'Count of Return'];
    const tableBody:any[] = [
      {
        'name':'No Return',
        'return_false_count':returnData[0].return_false_count
      },
      {
        'name':'Returns',
        'return_true_count':returnData[0].return_true_count
      },
      {
        'name':'Grand Total',
        'return_total_count':returnData[0].return_true_count+returnData[0].return_false_count
      }
    ];


    this.returncardCount = returnData[0].return_true_count;

    return {'tableHeader':tableHeader, 'tableBody':tableBody};
  }


  //********* Source *************//

  async getSourceCount(){
    await this.feedbackService.sourceCountReport(this.params.Source).subscribe((data:any) => {
      data.map((d:any) => {
        (d.source == null) ? d.source = 'Others' : '';
      });
      // Add the "Grand Total" row to the data array
      this.sourceTableDataFormate = this.getFormatedSourceTable(data);
      const formattedData = this.formatDataForBarChartSource(data);
      this.sourceChartLabels = formattedData.labels;
      this.sourceChartData = formattedData.datasets;
      this.sourceDataExist = (data.length > 0);
    });
  }

  getFormatedSourceTable(data:any){
    const sourceIds = [2, 1];
    let sourceCount = 0;
    const tableHeader = ['Label', 'Pending', 'Solved', 'Grand Total'];
    let sourceDataTable = [...data];
    sourceDataTable.map((d:any) => {
      d.grand_total = d.pending_count + d.solved_count;
      if(sourceIds.includes(d.id)){
        sourceCount += d.pending_count;
      }
      d = delete d.id;

    });


    this.sourcecardCount = sourceCount;

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


  //********* MIO *************//

  async getMIOCOunt(){
    await this.feedbackService.mioCountReport(this.params.MIO).subscribe((data:any) => {
      data.map((d:any) => {
        d.mio = (d.mio == 'true') ? 'Multiple-Order': 'Single-Order';
      });
      // Add the "Grand Total" row to the data array
      this.mioTableDataFormate = this.formatMIOTableData(data);
      const formattedData = this.formatDataForBarChartMIO(data);
      this.mioChartLabels = formattedData.labels;
      this.mioChartData = formattedData.datasets;
      this.mioDataExist = (data.length > 0);
    });
  }

  formatMIOTableData(data:any){
    const tableHeader = ["Label", "Full-Order", "SKU", "Grand Total"]
    let mioDataTable = [...data];
    let mioCount = 0;
    mioDataTable.map((d:any) => {
      d.grand_total = d.full_order_count + d.sku_count;
      if(d.mio == 'Multiple-Order'){
        mioCount = d.grand_total;
      };
    });


    this.miocardCount = mioCount;


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



  //********* Country *************//

  async getCountryCount(){
    await this.feedbackService.countryCountReport(this.params.Country).subscribe((data:any) => {
      data.map((d:any) => {
        d.canada = (d.canada == 'true') ? 'Canada': 'USA';
      });

      this.countryTableDataFormate = this.formateCountryTableData(data);

      const formattedData = this.formatDataForBarChartCountry(data);
      this.countryChartLabels = formattedData.labels;
      this.countryChartData = formattedData.datasets;

      this.countryDataExist = (data.length > 0);
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

    this.countrycardCount = totalGrandTotal;

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
      const fullOrderPercentage:number = (item.full_order_count / totalFullOrder) * 100;
      const skuPercentage = (item.sku_count / totalSKU) * 100;

      return {
        data: [fullOrderPercentage, skuPercentage],
        label: item.canada,
        backgroundColor: this.color.getBackgroundColor(index),
      };
    });

    return { labels, datasets };
  }


//********* Complaint Type *************//

  async getComplaintTypeCount(){
    await this.feedbackService.complaintTypeCountReport(this.params.ComplaintType).subscribe((data:any) => {
      this.complaintTypeDataExist = (data?.length > 0);
      const formattedData = this.formatDataForBarChartComplaintType(data);
      this.complaintTypeChartLabels = formattedData.labels;
      this.complaintTypeChartData = formattedData.datasets;
    });
  }

  formatDataForBarChartComplaintType(data: any[]): { labels: string[], datasets: any[] } {

    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }
    // Extract unique solutions
    const uniqueSolutions = Array.from(new Set(data.map((item: any) => item.solution)));

    // Use solutions as labels
    const labels = uniqueSolutions;


    // Extract unique complaint types for creating datasets
    const uniqueComplaintTypes = Array.from(new Set(data.map((item: any) => item.complaint_type)));

    // Generate a color for each unique complaint
    const complaintColors = new Map<string, string>();
    uniqueComplaintTypes.forEach(complaint => {
      complaintColors.set(complaint, this.color.getRandomHexColor());
    });

    const datasets = uniqueComplaintTypes.map(complaintType => {
        const dataForComplaintType = uniqueSolutions.map(solution =>
            data.filter((item: any) => item.solution === solution && item.complaint_type === complaintType)
                .reduce((acc, curr) => acc + (curr.count || 0), 0)
        );
        const backgroundColor = uniqueComplaintTypes.map(complaint => complaintColors.get(complaint));
        return {
            data: dataForComplaintType,
            label: complaintType, // Now the label for each dataset is the complaint type
            backgroundColor: backgroundColor, // Assuming you have a method to generate random colors
        };
    });

    return { labels, datasets };
  }


  async getComplaintTypeCountTable(){
    const complaint:any = {
      FromDate:this.params.ComplaintType.FromDate,
      ToDate:this.params.ComplaintType.ToDate,
      Solution:''
    };
    await this.feedbackService.complaintTypeCountReport(complaint).subscribe((data:any) => {
      this.complaintTypeTableData = this.formatComplaintTypeTableData(data);
    });
  }

  formatComplaintTypeTableData(data: any) {
    // Extract unique solutions for table headers
    const uniqueSolutions: string[] = Array.from(new Set(data.map((item: any) => item.solution)));
    const tableHeader: string[] = ["Complaint Type", ...uniqueSolutions, "Total"];

    // Extract unique complaint types
    const uniqueComplaintTypes: string[] = Array.from(new Set(data.map((item: any) => item.complaint_type)));

    // Create table body
    let complaintTypeTableData = uniqueComplaintTypes.map((complaintType) => {
      const row: { [key: string]: any } = { "Complaint Type": complaintType };

      // Initialize counts for each solution
      uniqueSolutions.forEach(solution => {
        row[solution] = 0;
      });

      // Aggregate counts for each solution
      data.forEach((item: any) => {
        if (item.complaint_type === complaintType) {
          row[item.solution] += item.count;
        }
      });

      // Calculate total count for the complaint type
      row["Total"] = uniqueSolutions.reduce((sum, solution) => sum + row[solution], 0);

      return row;
    });

    // Calculate grand totals for each solution
    const grandTotalRow: { [key: string]: any } = { "Complaint Type": "Grand Total" };
    uniqueSolutions.forEach(solution => {
      grandTotalRow[solution] = complaintTypeTableData.reduce((sum, row) => sum + row[solution], 0);
    });
    grandTotalRow["Total"] = uniqueSolutions.reduce((sum, solution) => sum + grandTotalRow[solution], 0);

    this.complaintTypecardCount = grandTotalRow["Total"];

    // Add the grand total row to the data array
    complaintTypeTableData.push(grandTotalRow);

    return { 'tableHeader': tableHeader, 'tableBody': complaintTypeTableData };
  }


  //********* Complaint *************//

  async getCountOfComplaint(){
    await this.feedbackService.complaintCountReport(this.params.Complaint).subscribe((data:any) => {
      data.map((d:any) => {
        (d.complaint == null) ? d.complaint = 'Others' : '';
      });
      const complaitData = this.formatDataForBarChartComplaint(data);
      this.complaintChartLabels = complaitData.labels;
      this.complaintChartData = complaitData.datasets;
      this.complaintDataExist = (data?.length > 0);
    });
  }

  formatDataForBarChartComplaint(data: any[]): { labels: string[], datasets: any[] } {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }
    const uniqueComplaints = Array.from(new Set(data.map((item: any) => item.complaint)));
    const uniqueSolutions = Array.from(new Set(data.map((item: any) => item.solution)));

    // Generate a color for each unique complaint
    const complaintColors = new Map<string, string>();
    uniqueComplaints.forEach(complaint => {
      complaintColors.set(complaint, this.color.getRandomHexColor());
    });

    const labels = uniqueComplaints.map(complaint => `${complaint}`);

    const datasets = uniqueSolutions.map(solution => {
      const dataForSolution = uniqueComplaints.map(complaint => {
        const item = data.find((d: any) => d.complaint === complaint && d.solution === solution);
        return item ? item.count : 0;
      });

      // Map each solution to a set of colors based on the complaint
      const backgroundColor = uniqueComplaints.map(complaint => complaintColors.get(complaint));

      return {
        data: dataForSolution,
        label: solution,
        backgroundColor: backgroundColor,
      };
    });

    return { labels, datasets };
  }


  async getCountOfComplaintTable(){
    const complaint = {FromDate:this.params.Complaint.FromDate, ToDate:this.params.Complaint.ToDate, ComplaintType:"", Complaint:""};
    await this.feedbackService.complaintCountReport(complaint).subscribe((data:any) => {
      data.map((d:any) => {
        (d.complaint == null) ? d.complaint = 'Others' : '';
      });
      this.complaintTableData = this.formatComplaintTableData(data);
    });
  }


  formatComplaintTableData(data: any) {

    // Extract unique solutions for table headers
    const uniqueSolutions: string[] = Array.from(new Set(data.map((item: any) => item.solution)));
    const tableHeader: string[] = ["Complaint Type", ...uniqueSolutions, "Total"];

    // Extract unique complaints
    const uniqueComplaints: string[] = Array.from(new Set(data.map((item: any) => item.complaint)));

    // Create formatted data
    const formattedData = uniqueComplaints.map((complaintType) => {
      const row: { [key: string]: any } = { "Complaint Type": complaintType };

      // Initialize counts for each solution
      uniqueSolutions.forEach(solution => {
        row[solution] = this.getTableComplaintDataFormate(solution, complaintType, data);
      });

      // Calculate total count for the complaint type
      row["Total"] = uniqueSolutions.reduce((sum, solution) => sum + row[solution], 0);

      return row;
    });

    // Calculate grand totals for each solution
    const grandTotalRow: { [key: string]: any } = { "Complaint Type": "Grand Total" };
    uniqueSolutions.forEach(solution => {
      grandTotalRow[solution] = formattedData.reduce((sum, row) => sum + row[solution], 0);
    });
    grandTotalRow["Total"] = uniqueSolutions.reduce((sum, solution) => sum + grandTotalRow[solution], 0);

    this.complaintcardCount = grandTotalRow["Total"];

    // Add the grand total row to the formatted data array
    formattedData.push(grandTotalRow);

    // Set the formatted data for use in the template
    return { 'tableHeader': tableHeader, 'tableBody': formattedData };
  }

  getTableComplaintDataFormate(solution: string, complaintType: string, data: any[]): number {
    return data.filter(item => item.solution === solution && item.complaint === complaintType).length;
  }


  //********* SKU *************//

  async getSKUCountReport(){
    await this.feedbackService.skuCountReport(this.params.SKU).subscribe((res:any) => {
      const complaitData = this.formatDataForBarChartsku(res);
      this.skuChartLabels = complaitData.labels;
      this.skuChartData = complaitData.datasets;
      this.skuDataExist = (res?.length > 0);
    });
  }

  formatDataForBarChartsku(data: any[]): { labels: string[], datasets: any[] } {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }
    // Extract unique SKUs
    const uniqueSKUs = Array.from(new Set(data.map((item: any) => item.sku)));

    // Extract unique complaint types
    const uniqueComplaintTypes = Array.from(new Set(data.map((item: any) => item.complaint_type)));

    // Create a map to hold the total count for each SKU
    let skuTotalCountMap:any = {};

    uniqueSKUs.forEach(sku => {
      skuTotalCountMap[sku] = data.filter(item => item.sku === sku)
                                  .reduce((total, item) => total + item.count, 0);
    });

    // Sort SKUs based on total count in descending order
    uniqueSKUs.sort((a, b) => skuTotalCountMap[b] - skuTotalCountMap[a]);

    const labels = uniqueSKUs.map(sku => `${sku}`);

    const datasets = uniqueComplaintTypes.map(complaintType => {
      const dataForComplaintType = uniqueSKUs.map(sku => {
        const item = data.find((d: any) => d.sku === sku && d.complaint_type === complaintType);
        return item ? item.count : 0;
      });

      return {
        data: dataForComplaintType,
        minBarThickness: 500,
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


  changeSKUParams(event:any){
    this.params.SKU.Complaint = "";
    this.skuComplaint = this.complaintTemp.filter((x:any) => x.complaint_id == event.target.value);
    this.getSKUCountReport();
  }

  async getCountOfSKUTable(){
    const SKU = {FromDate:this.params.SKU.FromDate, ToDate:this.params.SKU.ToDate, ComplaintType:"", Complaint:""};
    await this.feedbackService.skuCountReport(SKU).subscribe((data:any) => {
      data.map((d:any) => {
        (d.complaint == null) ? d.complaint = 'Others' : '';
      });
      this.skuTableData = this.formatSKUTableData(data);
    });
  }

  formatSKUTableData(data: any) {
    // Extract unique complaint types for table headers
    const uniqueComplaintTypes: string[] = Array.from(new Set(data.map((item: any) => item.complaint)));
    const tableHeader: string[] = ["SKU", ...uniqueComplaintTypes, "Total"];

    // Extract unique SKUs
    const uniqueSKUs: string[] = Array.from(new Set(data.map((item: any) => item.sku)));

    // Create formatted data
    const formattedData = uniqueSKUs.map((sku) => {
        const row: { [key: string]: any } = { "SKU": sku };

        // Initialize counts for each complaint type
        uniqueComplaintTypes.forEach(complaintType => {
            row[complaintType] = this.getTableSKUDataFormate(sku, complaintType, data);
        });

        // Calculate total count for the SKU
        row["Total"] = uniqueComplaintTypes.reduce((sum, complaintType) => sum + row[complaintType], 0);

        return row;
    });

    // Calculate grand totals for each complaint type
    const grandTotalRow: { [key: string]: any } = { "SKU": "Grand Total" };
    uniqueComplaintTypes.forEach(complaintType => {
        grandTotalRow[complaintType] = formattedData.reduce((sum, row) => sum + row[complaintType], 0);
    });
    grandTotalRow["Total"] = uniqueComplaintTypes.reduce((sum, complaintType) => sum + grandTotalRow[complaintType], 0);

    this.skucardCount = grandTotalRow["Total"];

    // Add the grand total row to the formatted data array
    formattedData.push(grandTotalRow);

    // Set the formatted data for use in the template
    return { 'tableHeader': tableHeader, 'tableBody': formattedData };
  }

  getTableSKUDataFormate(sku: string, complaintType: string, data: any[]): number {
      return data.filter(item => item.sku === sku && item.complaint === complaintType).length;
  }


}
