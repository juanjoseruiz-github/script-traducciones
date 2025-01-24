# JSON to Excel and Excel to JSON Converter

Este proyecto proporciona scripts para convertir archivos JSON a Excel y archivos Excel a JSON. Los scripts están diseñados para manejar múltiples archivos y mantener la estructura anidada de los objetos JSON.

## Estructura del Proyecto

```sh
json-excel-converter/
├── JsonEmpty/
├── ExcelEmpty/
├── CompleteExcel/
├── JsonComplete/
│ ├── es/
│ ├── cat/
│ ├── pt/
│ ├── gal/
│ └── eus/
├── jsonToExcel.js
├── excelToJson.js
├── package.json
└── README.md
```


## Instalación

1. Clona este repositorio o descarga los archivos en tu máquina local.
2. Navega al directorio del proyecto.
3. Instala las dependencias necesarias ejecutando:

    ```sh
    npm install
    ```

## Uso

### Convertir JSON a Excel

1. Coloca los archivos JSON en la carpeta `JsonEmpty`.
2. Ejecuta el siguiente comando para convertir los archivos JSON a Excel:

    ```sh
    npm run json-to-excel
    ```

    Los archivos Excel generados se guardarán en la carpeta `ExcelEmpty`.

### Convertir Excel a JSON

1. Coloca los archivos Excel en la carpeta `CompleteExcel`.
2. Ejecuta el siguiente comando para convertir los archivos Excel a JSON:

    ```sh
    npm run excel-to-json
    ```

    Los archivos JSON generados se guardarán en las subcarpetas correspondientes dentro de `JsonComplete`.

## Detalles Técnicos

### jsonToExcel.js

- Este script lee archivos JSON desde la carpeta `JsonEmpty`.
- Convierte los archivos JSON a un archivo Excel con las claves en la primera columna y los valores en las columnas siguientes.
- Aplica estilos a la primera fila y a la primera columna del Excel para una mejor visualización.
- Guarda los archivos Excel generados en la carpeta `ExcelEmpty`.

### excelToJson.js

- Este script lee archivos Excel desde la carpeta `CompleteExcel`.
- Convierte los archivos Excel a múltiples archivos JSON, uno por cada idioma (es, cat, pt, gal, eus).
- Asegura que las claves estén presentes en los archivos JSON generados, incluso si los valores están vacíos en el Excel.
- Guarda los archivos JSON generados en las subcarpetas correspondientes dentro de `JsonComplete`.

## Dependencias

- [xlsx](https://www.npmjs.com/package/xlsx)

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Autor

Juan José Ruiz - [Github](https://github.com/juanjoserusa)
