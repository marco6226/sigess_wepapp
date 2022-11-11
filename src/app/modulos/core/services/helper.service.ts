import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class HelperService {

    private message = new BehaviorSubject<any>('En espera...');
    public customMessage = this.message.asObservable();

    constructor(){
    }

    public changeMessage(msg: any): void{
        this.message.next(msg);
    }

}