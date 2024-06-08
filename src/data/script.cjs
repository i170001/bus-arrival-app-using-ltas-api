const fs = require('fs');
const path = require('path');

let data = [];
for (let i = 1; i <= 11; i++) {
  let filePath = path.join(__dirname, `response${i}.json`);
  let fileData = fs.readFileSync(filePath, 'utf8');
  let jsonData = JSON.parse(fileData);
  data = data.concat(jsonData.value);
}

let combinedData = {
  "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#BusStops",
  "value": data
};

fs.writeFileSync('combined.json', JSON.stringify(combinedData, null, 2));