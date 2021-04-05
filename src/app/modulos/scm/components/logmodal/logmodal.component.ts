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
    logFile = [];
    constructor() { }

    ngOnInit() {
        //  console.log(this.log, "aja", this.log.entity)
        if ((this.log.action as string).includes("Creacion")) {

            this.isCreation(this.log.json)
            return
        }
        //  console.log(this.logList);

        this.arrayByentity = this.logList.filter(logU => logU.entity === this.log.entity);
        let index = this.arrayByentity.findIndex(logU => logU.id == this.log.id)
        this.comparador(this.arrayByentity[index - 1], this.log);
    }


    isCreation(log) {
        log = JSON.parse(log)
        for (const key in log) {
            if (Object.prototype.hasOwnProperty.call(log, key)) {
                const l = log[key];

                console.log(typeof log[key]);
                if (typeof log[key] == 'object' && l != null) {
                    this.logFile.push(` ${key}  ==> `);

                    for (const t in log[key]) {

                        const element = log[t];
                        this.logFile.push(` ${t},  : ${element || 'vacioa'}`);
                    }
                    this.logFile.push(` <==`);

                    continue
                }
                this.logFile.push(` ${key},  : ${l || 'vacio'}`);

            }
        }
    }

    comparador(anterior, editado) {
        anterior = JSON.parse(anterior.json); editado = JSON.parse(editado.json)
        console.log(anterior, editado);

        for (const key in anterior) {
            if (Object.prototype.hasOwnProperty.call(anterior, key)) {
                const sinEditar = anterior[key];
                const edit = editado[key];

                if (sinEditar != edit) {
                    this.logFile.push(`Hubo cambio en ${key}, antes estaba asi : ${sinEditar || 'vacio'}  y ahora esta asi : ${edit || 'vacio'}`);
                }
            }
        }
    }
}
