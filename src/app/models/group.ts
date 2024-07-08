import { Item } from "./item";

export class Group {
    public group_key: string;
    public group_name: string;
    public editDescription: boolean;
    public item_attributes: Item[];
    public is_verified:boolean;
    public major_category_id: string;
    public major_category: string;
    public minor_category_id: string;
    public minor_category: string;
    

    constructor(group_key: string = '', group_name: string, editDescription:boolean, item_attributes:Item[] = [], is_verified: boolean = false, major_category_id:string, major_category:string, minor_category_id:string, minor_category:string) {
        this.group_key = group_key;
        this.group_name = group_name;
        this.editDescription = editDescription;
        this.item_attributes = item_attributes;
        this.is_verified = is_verified;
        this.major_category_id = major_category_id;
        this.major_category = major_category;
        this.minor_category_id = minor_category_id;
        this.minor_category = minor_category;
    }
}