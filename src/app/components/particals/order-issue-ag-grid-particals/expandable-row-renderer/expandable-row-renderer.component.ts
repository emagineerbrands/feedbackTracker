import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';


@Component({
  selector: 'app-expandable-row-renderer',
  templateUrl: './expandable-row-renderer.component.html',
  styleUrl: './expandable-row-renderer.component.css'
})
export class ExpandableRowRendererComponent implements ICellRendererAngularComp{
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  isExpanded = false;
  hasChildren = false;

  constructor(private elementRef: ElementRef) {}
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.hasChildren = this.params.data?.ticket_details.length > 1; // Check for children
  }

  /*toggleExpansion() {
    if (this.hasChildren) {
        this.isExpanded = !this.isExpanded;

        const gridApi = this.params.api; // Access grid API
        const parentNode = gridApi.getRowNode(this.params.node.id);

        if (this.isExpanded) {
            const subRowsData = this.params.data.ticket_details; // Get sub-rows

            // Update the grid data
            parentNode.setDataValue('children', subRowsData);
            gridApi.applyTransaction({
                add: subRowsData,
                addIndex: this.params.node.rowIndex + 1 // Insert after the parent row
            });
        } else {
            // Remove child rows when collapsed
            gridApi.applyTransaction({
                remove: parentNode.childrenAfterGroup
            });
            parentNode.setDataValue('children', []);
        }
    }
  }*/

  toggleExpansion() {
    console.log("Toggling expansion with row data:", this.rowData);
    this.rowData.expanded = !this.rowData.expanded;

    if (this.rowData.expanded) {
        console.log("Setting expanded row data value");
        this.gridApi.setRowData(this.rowData);
    } else {
        console.log("Setting collapsed row data value");
        this.gridApi.setRowData(this.rowData);
    }
}





}
