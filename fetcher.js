const request = require('request');
const fs = require('fs');

const URI = process.argv.slice(2, 3).toString();
const FILEPATH = process.argv.slice(3, 4).toString();

console.log('URI:', URI);
console.log('FILEPATH:', FILEPATH);


request(URI, (error, response, body) => {
  console.log('error:', error); // Print the error if one occurred

  if (!error) {
    fs.writeFile(`./${FILEPATH}`, `${body}`, (err) => {
      if (!err) {
        console.log(`Downloaded and saved 1235 bytes to ${FILEPATH}. `);
    
      } else {
        console.log('error:', err);
        throw err;
      }
    });
  }


  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
