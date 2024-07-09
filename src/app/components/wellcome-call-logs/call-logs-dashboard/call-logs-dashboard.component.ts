import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Numbers } from '../../../enum/Numbers.enum';
import { WelcomeCallLogService } from '../../../services/welcome-call-log-service/welcome-call-log.service';
import { ColorService } from '../../../services/color-service/color.service';
import { DateConvertService } from '../../../services/date-convert-service/date-convert.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { CallLogsDashboardParams } from '../../../interface/CallLogsDashboardParams';
import { DateRange } from '../../../interface/DateRange';


interface TableEntry {
  SKU: string;
  ProductType: string;
  [key: string]: any;
}

@Component({
  selector: 'app-call-logs-dashboard',
  templateUrl: './call-logs-dashboard.component.html',
  styleUrl: './call-logs-dashboard.component.css'
})
export class CallLogsDashboardComponent implements OnInit{

  Numbers = Numbers;
  pageTitle:string = 'WelCome Calls Dashboard';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': '', 'status':'active'},

  ];

  cardBackgroundInfo:string = 'card-info';

  constructor(
    private welcomeCallLogsService:WelcomeCallLogService,
    private color: ColorService,
    private dateRange: DateConvertService,
    public internalService: InternalService,
  ){
    Chart.register(ChartDataLabels);
  }

  ngOnInit(): void {
    this.params = this.internalService.initializeDateParams(this.params);
    this.getVolumeOfCallsCount();
    this.getDistributionOfCallsCount();
    this.getEngagementLevelOfCallsCount();
    this.getEngagementCallsPerProduct();
    this.getPickedUpCallsPerProductCount();
  }


  //Stacked Barchart Options
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

  //No-Stack Barchart Options
  public barChartOptionsNoStack: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      }
    }
    // Add other chart options as needed
  };


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

  public verticalBarChartOptionsStacked: ChartOptions = {
    indexAxis: 'y',
    scales: {
      x: {  // Bottom x-axis
        stacked: true,
        position: 'top'
      },
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


  //Volume Of calls
  public volumeOfCallsDataExist:boolean = true;
  public volumeOfCallsChartLabels: string[] = [];
  public volumeOfCallsChartData: (ChartDataset<"line"> | ChartDataset<"bar">)[] = [];
  public volumeOfcallsTableData:any;
  public volumeOfCallscardCountExist:boolean = false;
  public volumeOfCallscardCount:number = 0;


  //Distribution Of calls
  public distributionOfCallsDataExist:boolean = true;
  public distributionOfCallsChartLabels: string[] = [];
  public distributionOfCallsChartData: ChartDataset[] = [];
  public distributionOfcallsTableData:any;
  public distributionOfCallscardCountExist:boolean = false;
  public distributionOfCallscardCount:number = 0;


  //Engagement Level Of calls
  public engagementLevelOfCallsDataExist:boolean = true;
  public engagementLevelOfCallsChartLabels: string[] = [];
  public engagementLevelOfCallsChartData: ChartDataset[] = [];
  public engagementLevelOfcallsTableData:any;
  public engagementLevelOfCallscardCountExist:boolean = false;
  public engagementLevelOfCallscardCount:number = 0;


  //Pickedup Calls Per Product
  public pickedUpCallsPerProductDataExist:boolean = true;
  public pickedUpCallsPerProductChartLabels: string[] = [];
  public pickedUpCallsPerProductChartData: ChartDataset[] = [];
  public pickedUpCallsPerProductTableData:any;
  public pickedUpCallsPerProductcardCountExist:boolean = false;
  public pickedUpCallsPerProductcardCount:number = 0;
  public groupName:string[] = [];
  public groupAliasName:string[] = [];
  public productTypeData:any;
  public selectedProductTypeIndex:number = 0;


  //Engagement Calls Per Product
  public engagementProductTypeData:any;
  public engagementCallsPerProductSelect:number = 0;
  public engagementCallsPerProductTableData:any;
  public engagementCallsPerProductSKU:string = 'SKU';
  public engagementCallsPerProductSKUCount:number=0

  params:CallLogsDashboardParams = {
    VolumeOfCalls:{
      FromDate:'',
      ToDate:'',
    },
    DistributionOfCalls:{
      FromDate:'',
      ToDate:'',
    },
    EngagementLevelOfCalls:{
      FromDate:'',
      ToDate:'',
    },
    PickUpCallsPerProduct:{
      FromDate:'',
      ToDate:'',
    },
    EngagementCallsPerProduct:{
      FromDate:'',
      ToDate:'',
    }
  }


  dateFromChild(value: DateRange, chartCat:string){
    switch(chartCat){
      case 'VOLUME OF CALLS':
        this.params.VolumeOfCalls = value;
        this.getVolumeOfCallsCount();
        break;
      case 'CALLS DISTRIBUTION':
        this.params.DistributionOfCalls = value;
        this.getDistributionOfCallsCount();
        break;
      case 'ENGAGEMENT LEVELS':
        this.params.EngagementLevelOfCalls = value;
        this.getEngagementLevelOfCallsCount();
        break;
      case 'ENGAGEMENT CALLS PER PRODUCT':
        this.params.PickUpCallsPerProduct = value;
        this.getEngagementCallsPerProduct();
        break;
      case 'PICKED UP CALLS PER PRODUCT':
        this.params.PickUpCallsPerProduct = value;
        this.getPickedUpCallsPerProductCount();
        break;
      default:
        break;
    }
  }




  /******** Start Of Volume Of Calls ************/

  async getVolumeOfCallsCount(){
    await this.welcomeCallLogsService.getVolumeCallsCount(this.params.VolumeOfCalls).subscribe({
      next:(data) => {
        const complaitData = this.formatDataForVolumeOfCalls(data);
        this.volumeOfcallsTableData = this.formatTableData(data);
        this.volumeOfCallsChartLabels = complaitData.labels;
        this.volumeOfCallsChartData = complaitData.datasets;
        this.volumeOfCallsDataExist = (data?.length > 0);

      },
      error: (error) => {

      }
    });
  }

  formatDataForVolumeOfCalls(data:any) {
    if (!data || data.length === 0) {
        return { labels: [], datasets: [] };
    }

    // Extract labels according to the given rules
    const labels = data.map((item:any) => {
        if (item.Date) {
            return item.Date;
        } else if (item.Month) {
            return item.Month;
        } else if (item.WeekStartDate && item.WeekEndDate) {
            return `${item.WeekStartDate} - ${item.WeekEndDate}`;
        }
        return ''; // Default case, though you might want to handle this differently
    });

    // Prepare datasets
    // Assuming TotalCalls is the sum of UnAnsweredCalls and AnsweredCalls

    const answeredCallsData = data.map((item:any) => item.AnsweredCalls);
    const UnAnsweredCalls = data.map((item:any) => item.UnAnsweredCalls);
    const totalCallsData = data.map((item:any) => item.UnAnsweredCalls + item.AnsweredCalls);

    const datasets = [
      {
          type: 'line',
          data: UnAnsweredCalls,
          label: "UnAnswered Calls",
          backgroundColor: "#f53d3d", // Example color
          borderColor: "#f53d3d", // Example border color
          borderWidth: 1,
      } as ChartDataset<"line">,
      {
          type: 'line',
          data: answeredCallsData,
          label: "Answered Calls",

          backgroundColor: "#088a2b", // Example color
          borderColor: "#088a2b", // Example border color
          borderWidth: 1,
      } as ChartDataset<"line">,
      {
          type: 'bar',
          data: totalCallsData,
          label: "Total Calls",
          borderColor: "#5b5bf5", // Example border color
          borderWidth: 1,
      } as ChartDataset<"bar">
    ];

    return { labels, datasets };
  }

  formatTableData(data: any[]): { tableHeader: string[], tableBody: any[] }  {
    if (data.length === 0) return { tableHeader: [], tableBody: [] };

    // Determine the predominant type in the dataset (daily, weekly, monthly)
    let type = 'Daily'; // Default to 'Daily' if not otherwise set
    if (data.some(entry => entry.WeekStartDate && entry.WeekEndDate)) {
      type = 'Weekly';
    } else if (data.some(entry => entry.Month)) {
      type = 'Monthly';
    }

    let tableHeader = ['Date', 'UnAnsweredCalls', 'AnsweredCalls', 'Total'];
    if (type === 'Weekly') {
      tableHeader = ['Week Start Date', 'Week End Date', 'UnAnsweredCalls', 'AnsweredCalls', 'Total'];
    } else if (type === 'Monthly') {
      tableHeader = ['Month', 'UnAnsweredCalls', 'AnsweredCalls', 'Total'];
    }

    let totalUnAnsweredCalls = 0;
    let totalAnsweredCalls = 0;

    const tableBody = data.map(entry => {
      const row: any = {};
      totalUnAnsweredCalls += entry.UnAnsweredCalls || 0;
      totalAnsweredCalls += entry.AnsweredCalls || 0;

      if (type === 'Weekly') {
        row['Week Start Date'] = entry.WeekStartDate;
        row['Week End Date'] = entry.WeekEndDate;
      } else if (type === 'Monthly') {
        row['Month'] = entry.Month;
      } else {
        row['Date'] = entry.Date;
      }

      row['UnAnsweredCalls'] = entry.UnAnsweredCalls;
      row['AnsweredCalls'] = entry.AnsweredCalls;
      row['Total'] = entry.AnsweredCalls + entry.UnAnsweredCalls;

      return row;
    });

    this.volumeOfCallscardCount = totalUnAnsweredCalls+totalAnsweredCalls;


    // Append the Grand Total row
    tableBody.push({
      [tableHeader[0]]: 'Grand Total',
      UnAnsweredCalls: totalUnAnsweredCalls,
      AnsweredCalls: totalAnsweredCalls,
      Total: totalUnAnsweredCalls+totalAnsweredCalls
    });

    return { tableHeader, tableBody };
  }

  /******** End Of Volume Of Calls ************/



  /******** Start Of Distribution Of Calls ************/

  async getDistributionOfCallsCount(){
    await this.welcomeCallLogsService.getDistributionCallsCount(this.params.DistributionOfCalls).subscribe({
      next:(data) => {

        this.distributionOfCallscardCountExist = (data && data.length > 0);
        this.distributionOfcallsTableData = this.distributionTableData(data);
        // Prepare the labels and data for the pie chart
        const chartLabels = data.map(item => item.Pickedup);
        const chartData = data.map(item => item.TotalCalls);
        const chartColors = data.map(() => this.color.getRandomHexColor());
        // Set up your chart configuration
        this.distributionOfCallsChartLabels = chartLabels;
        this.distributionOfCallsChartData = [
          {
            data: chartData,
            backgroundColor: chartColors, // Add more colors as needed
           //backgroundColor: ['#6666d9', '#f53d3d', '#08c44d'], // Add more colors as needed
            borderWidth: 0,
          }
        ];
      },
      error: (error) => {

      }
    });
  }

  distributionTableData(data:any){
    const tableHeader = ['Pick Up', 'Calls Count'];
    const tableBody: any[] = [];
    let grandTotal = 0; // Initialize a variable to hold the sum of all calls
    let smsAndNoCallsTotal = 0;
    data.forEach((item: { Pickedup: string; PickedUpId: number; TotalCalls: number }) => {
      // Add each item's calls to the grand total
      grandTotal += item.TotalCalls;
      if (item.PickedUpId === 2 || item.PickedUpId === 3) {
        smsAndNoCallsTotal += item.TotalCalls;
      }

      // Convert each item into a row for the table body
      tableBody.push([item.Pickedup, item.TotalCalls]);
    });

    this.distributionOfCallscardCount = smsAndNoCallsTotal;

    // Add a final row for the grand total
    tableBody.push(['Grand Total', grandTotal]);

    return { tableHeader, tableBody };
  }

  /******** End Of Distribution Of Calls ************/



  /******** Start Of Engagement Level Of Calls ************/

  async getEngagementLevelOfCallsCount(){
    await this.welcomeCallLogsService.getEngagementLevelCallsCount(this.params.EngagementLevelOfCalls).subscribe({
      next:(data) => {
        this.engagementLevelOfCallscardCountExist = (data && data.length > 0);
        data = data.sort((a, b) => a.EngagementLevelId - b.EngagementLevelId);
        this.engagementLevelOfcallsTableData = this.engagementLevelTableData(data);
        // Prepare the labels and data for the pie chart
        const chartLabels = data.map(item => item.EngagementLevel);
        const chartData = data.map(item => item.TotalCalls);
        const chartColors = data.map(() => this.color.getRandomHexColor());
        // Set up your chart configuration
        this.engagementLevelOfCallsChartLabels = chartLabels;
        this.engagementLevelOfCallsChartData = [
          {
            data: chartData,
            backgroundColor: chartColors, // Add more colors as needed
           //backgroundColor: ['#f53d3d', '#ff4f4b', '#ebd650', '#1fd655', '#02b845'], // Add more colors as needed
            borderWidth: 0,
          }
        ];
      },
      error: (error) => {

      }
    });
  }

  engagementLevelTableData(data:any){
    const tableHeader = ['Engagement Level', 'Calls Count'];
    const tableBody: any[] = [];
    let grandTotal = 0; // Initialize a variable to hold the sum of all calls

    data.forEach((item: { EngagementLevel: string; EngagementLevelId: number; TotalCalls: number }) => {
      // Add each item's calls to the grand total
      grandTotal += item.TotalCalls;
      if(item.EngagementLevelId == 4){
        this.engagementLevelOfCallscardCount = item.TotalCalls;
      }
      // Convert each item into a row for the table body
      tableBody.push([item.EngagementLevel, item.TotalCalls]);
    });
    // Add a final row for the grand total
    tableBody.push(['Grand Total', grandTotal]);

    return { tableHeader, tableBody };
  }

  /******** End Of Engagement Level Of Calls ************/


  /******** Start Of Engagement calls per Product ************/

  async getEngagementCallsPerProduct(){
    await this.welcomeCallLogsService.getEngagementCallsPerProductCount(this.params.PickUpCallsPerProduct).subscribe({
      next: (data:any) => {
        this.engagementProductTypeData = this.aggrigateDataforEngagementCallsPerProduct(data);
        this.engagementCallsPerProductTableData = this.getEngagementCallsPerProductTableData(data);
      },
      error: (error) => {

      }
    });
  }

  getEngagementCallsPerProductTableData(data: any[]) {
    const tableHeader: string[] = ['SKU', 'ProductType'];  // Start with basic columns
    const dynamicColumns: Set<string> = new Set<string>();  // To hold unique reaction levels dynamically
    let tableBody: any[] = [];
    // Create a map to store aggregated data by SKU
    const aggregatedData: { [key: string]: any } = {};

    // First, identify all possible reaction levels and add to the dynamicColumns set
    data.forEach(item => {
      const { ReactionLevel } = item;
      dynamicColumns.add(ReactionLevel);
    });

    // Iterate through data to populate aggregated data map
    data.forEach(item => {
      const { SKU, ProductType, ReactionLevel, TotalCalls } = item;

      if (!aggregatedData[SKU]) {
        aggregatedData[SKU] = { SKU, ProductType };
        // Initialize all reaction levels to 0 for this SKU
        dynamicColumns.forEach(column => {
          aggregatedData[SKU][column] = 0;
        });
      }

      // Update counts for each reaction level
      aggregatedData[SKU][ReactionLevel] += TotalCalls;
    });

    // Convert dynamic columns to sorted array and add to table header
    const sortedDynamicColumns = Array.from(dynamicColumns).sort();
    tableHeader.push(...sortedDynamicColumns);
    tableHeader.push('TotalCalls');

    // Convert aggregated data to array for the table body
    tableBody = Object.values(aggregatedData).map(entry => {
      // Compute total calls by summing all reaction level counts
      const totalCalls = sortedDynamicColumns.reduce((sum, column) => sum + entry[column], 0);

      entry.TotalCalls = totalCalls;
      return entry;
    });

    return { tableHeader, tableBody };
  }

  aggrigateDataforEngagementCallsPerProduct(data: any): any {
    let productTypeDataMap: { [key: string]: { labels: string[], datasets: any[], productType: string } } = {};
    let statusIndex: { [key: string]: number } = {};


    this.engagementCallsPerProductSKU = '';
    this.engagementCallsPerProductSKUCount = 0;
    // Generate statusIndex dynamically from unique ReactionLevel values
    data.forEach((item:any) => {
        if (!statusIndex.hasOwnProperty(item.ReactionLevel)) {
            statusIndex[item.ReactionLevel] = Object.keys(statusIndex).length;
        }
    });

    // Setup initial datasets with dynamic status labels from statusIndex
    let datasetsInit = Object.keys(statusIndex).map(status => ({
        label: status,
        data: [],
        borderWidth: 1,
    }));

    data.forEach((item: any) => {
      let productType = item.ProductType || 'Others';
      productType = productType.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const productAlias = productType.toLowerCase().replace(/\s+/g, "_");

      // Ensure initialization of product type data structure
      if (!productTypeDataMap[productAlias]) {
        productTypeDataMap[productAlias] = {
          productType: productType,
          labels: [], // will be filled with SKUs
          datasets: JSON.parse(JSON.stringify(datasetsInit)) // Deep copy to reset data arrays
        };
      }

      // Add SKU to labels if not already present
      if (!productTypeDataMap[productAlias].labels.includes(item.SKU)) {
        productTypeDataMap[productAlias].labels.push(item.SKU);
        productTypeDataMap[productAlias].datasets.forEach(dataset => dataset.data.push(0));
      }

      let skuIndex = productTypeDataMap[productAlias].labels.indexOf(item.SKU);
      let reactionLevel = item.ReactionLevel;

      // Update the count for the corresponding status and SKU
      if (statusIndex.hasOwnProperty(reactionLevel)) {
        productTypeDataMap[productAlias].datasets[statusIndex[reactionLevel]].data[skuIndex] += item.TotalCalls;
      }
    });

    // Sort SKUs alphabetically within each product type and realign the corresponding datasets
    Object.values(productTypeDataMap).forEach(productType => {
      const sortedIndices = productType.labels.map((sku, index) => ({ sku, index }))
                                               .sort((a, b) => a.sku.localeCompare(b.sku))
                                               .map(sorted => sorted.index);

      productType.labels.sort((a, b) => a.localeCompare(b)); // Alphabetically sorting the SKUs
      productType.datasets.forEach(dataset => {
        let newData:any[] = [];
        sortedIndices.forEach(index => newData.push(dataset.data[index]));
        dataset.data = newData;
      });
    });

     // Calculate total calls for each SKU and determine the highest
    Object.values(productTypeDataMap).forEach(productType => {
      productType.labels.forEach((sku, index) => {
          const totalCalls = productType.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
          if (totalCalls > this.engagementCallsPerProductSKUCount) {
              this.engagementCallsPerProductSKUCount = totalCalls;
              this.engagementCallsPerProductSKU = sku;
          }
      });

    });

    // Convert map to array for further processing or display
    let productDataArray = Object.keys(productTypeDataMap).map(key => ({
      ProductAlias: key,
      ...productTypeDataMap[key]
    }));

    return productDataArray;
  }

  /******** End Of Engagement calls per Product ************/


  /******** Start Of Picked up calls per Product ************/

  async getPickedUpCallsPerProductCount(){
    await this.welcomeCallLogsService.getPickedUpCallsPerProductCount(this.params.PickUpCallsPerProduct).subscribe({
      next:(data) => {
        this.productTypeData = this.aggregateDataByProductType(data);
        this.pickedUpCallsPerProductTableData = this.getPickedUpCallsDataTableFormate(data);
      },
      error: (error) => {

      }

    });
  }

  aggregateDataByProductType(data: any): any {
    let productTypeDataMap: { [key: string]: { labels: string[], datasets: any[], productType: string } } = {};
    let dynamicStatuses: Set<string> = new Set();

    // First pass to collect all possible statuses
    data.forEach((item: any) => {
      dynamicStatuses.add(item.PickedUp);
    });

    let statusArray = Array.from(dynamicStatuses); // Convert set to array

    // Second pass to build data structure
    data.forEach((item: any) => {
      let productType = item.ProductType || 'Others';
      productType = productType.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const productAlias = productType.toLowerCase().replace(/\s+/g, "_");

      // Ensure initialization of product type data structure
      if (!productTypeDataMap[productAlias]) {
        productTypeDataMap[productAlias] = {
          productType: productType,
          labels: [],
          datasets: statusArray.map(status => ({
            label: status, data: [], borderWidth: 1
          }))
        };
      }

      // Add SKU to labels if not already present
      if (!productTypeDataMap[productAlias].labels.includes(item.SKU)) {
        productTypeDataMap[productAlias].labels.push(item.SKU);
      }

      // Sort SKUs alphabetically
      productTypeDataMap[productAlias].labels.sort();
    });

    // Third pass to populate data
    data.forEach((item: any) => {
      const productType = (item.ProductType || 'Others').replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const productAlias = productType.toLowerCase().replace(/\s+/g, "_");
      const skuIndex = productTypeDataMap[productAlias].labels.indexOf(item.SKU);
      const statusIndex = statusArray.indexOf(item.PickedUp);

      if (statusIndex !== -1) {
        productTypeDataMap[productAlias].datasets[statusIndex].data[skuIndex] = item.TotalCalls;
      }

      // Initialize missing data points as 0
      productTypeDataMap[productAlias].datasets.forEach(dataset => {
        if (dataset.data.length < productTypeDataMap[productAlias].labels.length) {
          dataset.data.push(0);
        }
      });
    });

    // Convert map to array if needed for further processing or display
    let productDataArray = Object.keys(productTypeDataMap).map(key => ({
      ProductAlias: key,
      ...productTypeDataMap[key]
    }));

    return productDataArray;
  }


  getPickedUpCallsDataTableFormate(data: any[]) {
    const tableHeader: string[] = ['SKU', 'ProductType'];  // Start with basic columns
    const dynamicColumns: Set<string> = new Set<string>();  // To hold unique reaction levels dynamically
    let tableBody: any[] = [];
    // Create a map to store aggregated data by SKU
    const aggregatedData: { [key: string]: any } = {};

    // First, identify all possible reaction levels and add to the dynamicColumns set
    data.forEach(item => {
      const { PickedUp } = item;
      dynamicColumns.add(PickedUp);
    });

    // Iterate through data to populate aggregated data map
    data.forEach(item => {
      const { SKU, ProductType, PickedUp, TotalCalls } = item;

      if (!aggregatedData[SKU]) {
        aggregatedData[SKU] = { SKU, ProductType };
        // Initialize all reaction levels to 0 for this SKU
        dynamicColumns.forEach(column => {
          aggregatedData[SKU][column] = 0;
        });
      }

      // Update counts for each reaction level
      aggregatedData[SKU][PickedUp] += TotalCalls;
    });

    // Convert dynamic columns to sorted array and add to table header
    const sortedDynamicColumns = Array.from(dynamicColumns).sort();
    tableHeader.push(...sortedDynamicColumns);
    tableHeader.push('TotalCalls');

    // Convert aggregated data to array for the table body
    tableBody = Object.values(aggregatedData).map(entry => {
      // Compute total calls by summing all reaction level counts
      const totalCalls = sortedDynamicColumns.reduce((sum, column) => sum + entry[column], 0);

      entry.TotalCalls = totalCalls;
      return entry;
    });

    return { tableHeader, tableBody };
  }


  /******** End Of Picked up calls per Product ************/

}
