const fs = require('fs');
const path = require('path');
const {Parser}= require("json2csv");

//path to JSON file

const jsonFilePath = path.join(__dirname,'data.json');

//readt the JSON file

try{
    const jsonData = fs.readFileSync(jsonFilePath,'utf-8');
   // console.log(jsonData);
    const data = JSON.parse(jsonData);
    
    const jsonTocsvParser = new Parser();
    const csv = jsonTocsvParser.parse(data);

    //write csv data to file.

    const csvFilePath = path.join(__dirname,'convertedData.csv');
    fs.writeFileSync(csvFilePath, csv);
    console.log("Conversion Successful.")
}catch(error ){
    console.error("Error reading or converting to csv: ",error);
}