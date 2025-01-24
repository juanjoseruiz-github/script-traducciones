const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelDir = path.join(__dirname, 'CompleteExcel');
const jsonCompleteDir = path.join(__dirname, 'JsonComplete');

const languages = ['es', 'cat', 'pt', 'gal', 'eus'];
languages.forEach(lang => {
  const langDir = path.join(jsonCompleteDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  console.log(`Directorio ${langDir} asegurado.`);
});

function setNestedProperty(obj, key, value) {
  const keys = key.split('.');
  const lastKey = keys.pop();
  let tempObj = obj;

  keys.forEach(subKey => {
    if (!tempObj[subKey]) {
      tempObj[subKey] = {};
    }
    tempObj = tempObj[subKey];
  });

  tempObj[lastKey] = value;
}

function excelToJson(inputFile) {
  const workbook = XLSX.readFile(inputFile);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: "" });

  const translations = jsonData.slice(1);
  let jsonObjects = languages.map(() => ({}));

  translations.forEach(row => {
    const key = row[0];
    row.slice(1).forEach((value, index) => {
      setNestedProperty(jsonObjects[index], key, value);
    });
  });

  return jsonObjects;
}

fs.readdir(excelDir, (err, files) => {
  if (err) {
    console.error(`No se pudo leer el directorio ${excelDir}: `, err);
    return;
  }

  console.log(`Archivos encontrados en ${excelDir}:`, files);

  files.forEach(file => {
    if (path.extname(file) === '.xlsx') {
      const excelFilePath = path.join(excelDir, file);
      const baseFileName = path.basename(file, '.xlsx');

      try {
        const jsonObjects = excelToJson(excelFilePath);

        jsonObjects.forEach((jsonObj, index) => {
          const lang = languages[index];
          const jsonFilePath = path.join(jsonCompleteDir, lang, `${baseFileName}.json`);

          fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
          console.log(`Archivo JSON guardado como ${jsonFilePath}`);
        });
      } catch (err) {
        console.error(`Error al convertir el archivo Excel ${excelFilePath}: `, err);
      }
    } else {
      console.log(`Archivo ${file} no es un archivo Excel, se omite.`);
    }
  });
});
