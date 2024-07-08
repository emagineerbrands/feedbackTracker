
export class RetrunsSkuGroup {
  public sku: string;
  public qtyReturned: number;
  public qtyDamaged: number;


  constructor(sku: string = '', qtyReturned: number = 0, qtyDamaged:number = 0) {
      this.sku = sku;
      this.qtyReturned = qtyReturned;
      this.qtyDamaged = qtyDamaged;
  }
}

