import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })


export class GlobalConstants{
    public admin:boolean = false;
    public STATUS_PENDING_ID : string = "SGHIGML7puHxnzPJXK9v";
    public STATUS_PROCESSING_ID : string = "DJGolQXHxr8VWbTxDiDK";
    public STATUS_COMPLETED_ID : string = "cZS0voro3bkWTbFALiTL";

    public STATUS_PENDING : string = "Pending";
    public STATUS_PROCESSING : string = "Processing";
    public STATUS_COMPLETED : string = "Completed";

    public TYPE_VISITING_CARDS : string = "A7jq2plq1aGx16t8ptLM";
    public TYPE_WEDDING_CARDS : string = "jYCAo4pF8C4LO9eykZrE";
}