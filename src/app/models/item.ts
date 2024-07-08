export class Item {
  public  item_id: number;
  public description: string;
  public item_images: [];
  public selected:boolean;

  constructor(item_id: number, description: string, item_images:[] = [], selected: boolean = false) {
      this.item_id = item_id;
      this.description = description;
      this.item_images = item_images;
      this.selected = selected;
  }
}
