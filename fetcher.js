const request = require('request');
const fs = require('fs');
const readline = require('readline');

//check how many arguments are passed in.
//should only be 2
if (process.argv.slice(2).length > 2) {
  console.log('Invalid number of parameters entered.');
  process.exit();
}

//seperate out FILEPATH and the URI
const URI = process.argv.slice(2, 3).toString();
const FILEPATH = process.argv.slice(3, 4).toString();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



request(URI, (error, response, body) => {
  //start writing file with checkIfExists as the callback
  const checkIfExists = function(err) {
    //no error if file doesn't exist
    if (!err) {
      //just confirm it is written
      confirmation();
      //make sure to close rl so we don't hang if not overwriting
      rl.close();
    } else {
      //file exists...
      console.log('File exists...');
      
      //handle already exists error code
      if (err.code === 'EEXIST') {
        //handle overwrite confirmation input
        rl.question('File already exists. Do you want to overwrite ([y]es/[n]o):', (answer) => {
          if (answer === 'yes' || answer === 'y') {
            //if yes write file.
            fs.writeFile(`./${FILEPATH}`, `${body}`, confirmation);
          } else if (answer === 'no' || answer === 'n') {
            console.log(`File ${FILEPATH} not overwritten.`);
          } else {
            console.log('Invalid input.');
          }
          rl.close();
        });
      } else
        throw err;
    }
  };

  //first step:
  //if no error in request, start writing file.
  if (!error) {
    console.log('Downloading...');
    fs.writeFile(`./${FILEPATH}`, `${body}`, {flag: 'wx'}, checkIfExists);
  } else {
    // Print the error if one occurred
    console.log('error:', error);
  }
});

const confirmation = function() {
  let STATS = fs.statSync(FILEPATH);
  console.log(`Downloaded and saved ${STATS.size} bytes to ./${FILEPATH}. `);
};