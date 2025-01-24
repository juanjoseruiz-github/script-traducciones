const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Directorios
const jsonDir = path.join(__dirname, 'JsonEmpty');
const excelDir = path.join(__dirname, 'ExcelEmpty');

if (!fs.existsSync(excelDir)){
    fs.mkdirSync(excelDir);
}

function jsonToExcel(jsonData, outputFile) {
  const flattenJson = (data, parentKey = '', result = {}) => {
    for (let key in data) {
      let fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        flattenJson(data[key], fullKey, result);
      } else {
        result[fullKey] = data[key];
      }
    }
    return result;
  };
  const flatJson = flattenJson(jsonData);
  const sheetData = [["Key", "Español", "Catalán", "Euskera", "Gallego", "Portugués"]];
  for (let key in flatJson) {
    sheetData.push([key, flatJson[key], "", ""]);
  }
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Traducciones');
  XLSX.writeFile(workbook, outputFile);
  console.log(`Archivo Excel guardado como ${outputFile}`);
}


fs.readdir(jsonDir, (err, files) => {
  if (err) {
    console.error(`No se pudo leer el directorio ${jsonDir}: `, err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const jsonFilePath = path.join(jsonDir, file);
      const excelFileName = path.basename(file, '.json') + '.xlsx';
      const excelFilePath = path.join(excelDir, excelFileName);

      fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`No se pudo leer el archivo ${jsonFilePath}: `, err);
          return;
        }

        try {
          const jsonData = JSON.parse(data);
          jsonToExcel(jsonData, excelFilePath);
        } catch (err) {
          console.error(`Error al parsear el archivo JSON ${jsonFilePath}: `, err);
        }
      });
    }
  });
});
