//Idea & DEV: Roman Tauler
//DEV: David Luna, David Fonellosa, Laura Gutierrez

var GoProTagger = require('./gopro-tagging.js');
var fs = require('fs');
var util = require('util')
var exec = require('child_process').exec;
var dive = require('dive');

var argPath = process.argv.slice(2);
var line = '';
var lines = '';
var child;
var fileName = '';
var separator = ':';

//TIME CONVERTION FUNCTIONS
function milToMin (mil){
    return (mil/1000/60) << 0;
}

function milToSec (mil){
    return (mil/1000) % 60;
}

function getFormattedTime(mil){
    return milToMin(mil)+separator+milToSec(mil); 
}

//MAIN FUNCTION

//Prepare argument path as variable
filePath = argPath.join();

//1st loop to create txt's
dive(filePath, { files: true, /*recursive: true,*/ ignore: /^(?!G.*\d{4}\.MP4$).*/,}, function(err, filePath, stat) {
  if (err) throw err;

    //generate correct name for .txt file
    fileName = filePath.match(/(\/G.+\d{4})/gm);

    //generate variables for generate .txt via command on terminal
    finalExecute = './GoProInfo/GoProInfo ' + filePath + ' > ' + filePath + '.txt';

    //execute generate .txt via command on terminal
    child = exec(finalExecute, function (error) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

});


//2nd loop to apply tags
dive(filePath, { files: true, /*recursive: true,*/ ignore: /^(?!G.*\d{4}\.MP4$).*/,}, function(err, filePath, stat) {
  if (err) throw err;
    //view whats going on
    // console.log(filePath)

    //read mp4 related txt
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(filePath + '.txt')
    });

    lineReader.on('line', function (line) {
      //generate variables to apply tag via command on terminal
      lines += getFormattedTime(line) + ",";
      finalExecute2 = "tag -a" + lines + " " + filePath;
      
      //apply tag
      child = exec(finalExecute2, function (error) {

        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });  
  });
    console.log(filePath + " Done!");
});

//3d loop delete .txt's
setTimeout(function() {
    console.log('All Done and clean');

     dive(filePath, { files: true, /*recursive: true,*/ ignore: /^(?!G.*\d{4}\.MP4\.txt$).*/,}, function(err, filePath, stat) {
      if (err) throw err;

      finalExecute3 = "rm " + filePath;

      //apply tag
      child = exec(finalExecute3, function (error) {

        if (error !== null) {
            console.log('exec error: ' + error);
        }

    }); 
  });

}, 500);




