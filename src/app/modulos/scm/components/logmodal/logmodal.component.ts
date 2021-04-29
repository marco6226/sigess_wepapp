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
    Entity = {
        fechaCreacion: { name: "Fecha de crecion", type: "Date" },
        fechaSeg: { name: "Fecha de seguimiento", type: "Date" }
    }
    constructor() { }

    ngOnInit() {
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
        console.log(log);
        for (const key in log) {
            if (Object.prototype.hasOwnProperty.call(log, key)) {
                const info = log[key];

                this.verifyDataType(log[key], key);


                if (typeof log[key] == 'object' && info != null) {
                    this.logFile.push(` ${key}  ==> `);
                    for (const t in log[key]) {

                        const element = log[t];
                        this.logFile.push(` ${t},  : ${element || 'vacio'}`);
                    }
                    this.logFile.push(` <==`);

                    continue
                }
                console.log(this.Entity[key]);
                this.logFile.push(`${this.verifyDataType(key, info)}`);

            }
        }
    }

    comparador(anterior, editado) {
        anterior = JSON.parse(anterior.json); editado = JSON.parse(editado.json)
        for (const key in anterior) {
            if (Object.prototype.hasOwnProperty.call(anterior, key)) {
                const sinEditar = anterior[key];
                const edit = editado[key];

                if (sinEditar != edit) {
                    this.logFile.push(`Cambio en ${this.Entity[key] || key}, antes  : ${sinEditar || 'vacio'} despues : ${edit || 'vacio'}`);
                }
            }
        }
    }

    verifyDataType(key, info) {

        if (this.Entity[key]) {


            switch (this.Entity[key].type) {
                case "Date":
                    info = new Date(info);
                    break;

                default:
                    break;
            }



            return `${key},  : ${info || 'vacio'}`
        };


        return `${key},  : ${info || 'vacio'}`


    }

}


