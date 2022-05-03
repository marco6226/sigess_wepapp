

export class FileUtils {
  public static csvSeparator = ',';

  public static exportToCsv(data: any[], columns: any[], fileName?: string) {
    let exportFilename = fileName + new Date().toISOString();

    let csv = '\ufeff';
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      if (column.header != null || column.field != null) {
        csv += '"' + (column.header || column.field) + '"';

        if (i < (columns.length - 1)) {
          csv += FileUtils.csvSeparator;
        }
      }
    }

    data.forEach((record, i) => {
      csv += '\n';
      for (let i = 0; i < columns.length; i++) {
        let column = columns[i];
        if (column.field != null) {
          let cellData = record[column.field];
          if (column.type != null && column.type == "date") {
            cellData = (<string>new Date(cellData).toISOString()).substring(0, 19);
          }
          if (cellData != null) {
            cellData = String(cellData).replace(/"/g, '""');
          } else {
            cellData = '';
          }
          csv += '"' + cellData + '"';
          if (i < (columns.length - 1)) {
            csv += FileUtils.csvSeparator;
          }
        }
      }
    });

    let blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportFilename + '.csv');
    } else {
      let link = document.createElement("a");
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', exportFilename + '.csv');
        link.click();
      }
      else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }

  }

}