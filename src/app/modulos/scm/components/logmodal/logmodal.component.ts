import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-logmodal',
    templateUrl: './logmodal.component.html',
    styleUrls: ['./logmodal.component.scss']
})
export class LogmodalComponent implements OnInit {

    @Input() log: any;
    @Input() logList = [];
    arrayByentity = [];
    constructor() { }

    ngOnInit() {
        //console.log(this.log, "aja", this.log.entity)
        //  console.log(this.logList);
        this.arrayByentity = this.logList.filter(logU => logU.entity === this.log.entity);
        let index = this.arrayByentity.findIndex(logU => logU.id == this.log.id)
        this.comparador(this.arrayByentity[index - 1], this.log);
    }

    
    comparador(anterior, editado) {
        anterior = JSON.parse(anterior.json); editado = JSON.parse(editado.json)
        console.log(anterior, editado);

        for (const key in anterior) {
            if (Object.prototype.hasOwnProperty.call(anterior, key)) {
                const sinEditar = anterior[key];
                const edit = editado[key];

                if (sinEditar != edit) {
                    console.log(`Hubo cambio en ${key}, antes estaba asi : ${sinEditar} y ahora esta asi : ${edit}`);
                }
            }
        }
    }
}
