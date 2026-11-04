const fs = require("fs");
const path = require("path");

function logError(message) {
  const errorFilePath = path.resolve("./logs/error.log");

  fs.appendFile(
    errorFilePath,
    `${new Date().toISOString()}: ${message}\n`,
    (err) => {
      if (err) {
        console.error("failed to log error", err);
      }
    }
  );
}

module.exports = logError;