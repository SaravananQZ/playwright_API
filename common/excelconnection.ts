import * as XLSX from 'xlsx';


export  class xlscls{
    excelfile:"";
    sheetname:"";
    rows;
    constructor(filename,sheetname){
        this.excelfile = filename;
        this.sheetname = sheetname;
        this.rows=null;

    }
   getRowsExcel(){
    // Load workbook
        const workbook = XLSX.readFile(this.excelfile);

        // Select first sheet
        // const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[this.sheetname];

        // Convert to JSON
        this.rows = XLSX.utils.sheet_to_json(sheet);
        return this.rows;
   }
//    getTestcaseDetails(tcname,testtype='API'){
    getTestcaseDetails(tcname){
    const filtered = this.rows.filter(row => row.TC_Name === tcname);
    const result = filtered.reduce((acc, row) => {
        acc[row.Attribute] = row.Value;
        return acc;
      }, {} as Record<string, string | number>);
    return result;
   }
}




// // Filter like pandas
// const filtered = rows.filter(row => row.Status === 'Fail');

// console.log(filtered);
