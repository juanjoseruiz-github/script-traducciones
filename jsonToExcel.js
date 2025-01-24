const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const jsonBaseDir = path.join(__dirname, 'JsonEmpty');
const excelDir = path.join(__dirname, 'ExcelEmpty');

const languages = ['es', 'ca', 'pt', 'gl', 'eu'];

if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir);
}

function flattenJson(data, parentKey = '', result = {}) {
    for (let key in data) {
        let fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            flattenJson(data[key], fullKey, result);
        } else {
            result[fullKey] = data[key];
        }
    }
    return result;
}

function mergeJsonData(baseDir) {
    let mergedData = {};

    languages.forEach(lang => {
        const langDir = path.join(baseDir, lang);
        if (fs.existsSync(langDir)) {
            const files = fs.readdirSync(langDir);
            files.forEach(file => {
                if (path.extname(file) === '.json') {
                    if (!mergedData[file]) {
                        mergedData[file] = {};
                    }
                    const filePath = path.join(langDir, file);
                    const data = fs.readFileSync(filePath, 'utf8');
                    try {
                        const jsonData = JSON.parse(data);
                        const flatJson = flattenJson(jsonData);
                        Object.keys(flatJson).forEach(key => {
                            if (!mergedData[file][key]) {
                                mergedData[file][key] = {};
                            }
                            mergedData[file][key][lang] = flatJson[key];
                        });
                    } catch (err) {
                        console.error(`Error al parsear el archivo JSON ${filePath}: `, err);
                    }
                }
            });
        }
    });

    return mergedData;
}

async function jsonToExcel(jsonData, outputFile) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Traducciones');


    worksheet.addRow(["Key", "Español", "Catalán", "Portugués", "Gallego", "Euskera"]);


    for (let key in jsonData) {
        const row = [key];
        languages.forEach(lang => {
            row.push(jsonData[key][lang] || "");
        });
        worksheet.addRow(row);
    }


    worksheet.getRow(1).height = 28.35; 


    worksheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' } 
    };


    for (let i = 2; i <= worksheet.rowCount; i++) {
        const cell = worksheet.getRow(i).getCell(1);
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF003366' } 
        };
    }


    worksheet.columns.forEach(column => {
        column.width = 37.80; 
    });


    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
        const row = worksheet.getRow(rowIndex);
        for (let colIndex = 2; colIndex <= languages.length + 1; colIndex++) {
            const cell = row.getCell(colIndex);
            if (cell.value) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFC6EFCE' } 
                };
            }
        }
    }

    await workbook.xlsx.writeFile(outputFile);
    console.log(`Archivo Excel guardado como ${outputFile}`);
}

const mergedData = mergeJsonData(jsonBaseDir);

Object.keys(mergedData).forEach(fileName => {
    const excelFilePath = path.join(excelDir, `${path.basename(fileName, '.json')}.xlsx`);
    jsonToExcel(mergedData[fileName], excelFilePath);
});
