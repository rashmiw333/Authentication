const fs = require("fs");

try{
    fs.appendFileSync('log.txt',`\n\n [TAG: INFO] New log entry: Data appended at 2:00 PM. [PRIORITY: INFO]`);
    console.log("data appended successfully");
}catch (error){
    console.log("Error: ", error);
}