var twitter = require('mtwitter');
var colors = require('colors');
var moment = require('moment');
var newMessage = false;
var lastTweet = '21:35:5';

var twit = new twitter({
    consumer_key : 'xxxxx',
    consumer_secret : 'xxx',
    access_token_key : 'xxx',
    access_token_secret : 'xxxx'
});

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

var RedLED = new mraa.Gpio(5); 
RedLED.dir(mraa.DIR_OUT); //set the gpio direction to output 

var GreenLED = new mraa.Gpio(6); 
GreenLED.dir(mraa.DIR_OUT);   //set the gpio direction to output 

var BlueLED = new mraa.Gpio(7); 
BlueLED.dir(mraa.DIR_OUT);

var Buzzer = new mraa.Gpio(4);
Buzzer.dir(mraa.DIR_OUT);

console.log('Starting'.cyan);
setInterval(function() {
    twit.get('search/tweets', {q: '#iothackpdx'}, function(err, item) {
        if(item != null && item !== undefined) {
            console.log(item)
            console.log(item.statuses[0].created_at.substring(11, 18).cyan);
            console.log(lastTweet);
            console.log("From isNew(): ", newMessage);
            if(item.statuses[0].created_at.substring(11, 18) === lastTweet) {
                console.log("Not a new tweet. Not Lighting things up");
                newMessage = false;
            }
            else{
                newMessage = true
                console.log("New tweet. Lighting things up");
                lightUpThings(true);
                lastTweet = item.statuses[0].created_at.substring(11, 18);
            }  
        }
    });
 }, 30000);

function lightUpThings(flag){
    console.log("I am ready to light up");
    var totalLEDs = 3;              // total number of LEDs
    var totalRounds = 1;            // total rounds of LED lights blinking
    var totalLEDLightBlinks = totalLEDs * totalRounds;

    var seconds = 1;                // number of seconds we want to pause
    var pauseTime = 1000 * seconds; // number of milliseconds to pause

    // Blink each LED light: Green, Red, and Blue, one after another
    // in each round, for the total number of rounds specified in totalRounds
    // For a grand total of totalLEDLightBlinks
    // Pause for pauseTime between transitions
    var i = 0;
    var round = 1;
    var waiting = setInterval(function() {
        if (i == totalLEDLightBlinks) 
        {
            console.log("Rounds complete");
            GreenLED.write(0);
            RedLED.write(0);
            BlueLED.write(0);
            Buzzer.write(0);
                
            clearInterval(waiting);
        }
    
        else if (i % totalLEDs == 0)
        {
            console.log("Round number: " + round);    
            GreenLED.write(1);
            Buzzer.write(1);
            RedLED.write(0);
            BlueLED.write(0);        
            round++;
        }
        else if (i % totalLEDs == 1)
        {
            GreenLED.write(0);
            RedLED.write(1);
            BlueLED.write(0);
        }
        else // i % totalLEDs == 2
        {
            GreenLED.write(0);
            RedLED.write(0);
            BlueLED.write(1);
        }    
        i++;
    }, pauseTime);
 }