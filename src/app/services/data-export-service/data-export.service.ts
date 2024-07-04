import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {

  constructor() { }

  exportToCSV(data: any[], filename: string) {
    const csvData = this.convertToCSV(data);
    this.downloadCSV(csvData, filename);
  }

  exportToExcel(data: any[], filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  }

  private convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]);
    const rows = data.map(obj => header.map(key => obj[key]));
    return [header.join(','), ...rows.map(row => row.join(', '))].join('\n');
  }

  private downloadCSV(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
