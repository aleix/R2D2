var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var Omx = require("node-omxplayer");

var LED = new Gpio(21, 'out'); //use GPIO pin 4, and specify that it is output
var M1A = new Gpio(16, 'out'); //use GPIO pin 4, and specify that it is output
var M1B = new Gpio(20, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 2000); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
    if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
        LED.writeSync(1); //set pin state to 1 (turn LED on)
        M1A.writeSync(1);
        M1B.writeSync(0);
    } else {
        LED.writeSync(0); //set pin state to 0 (turn LED off)
        M1A.writeSync(0);
        M1B.writeSync(1);
    }
}

function endBlink() { //function to stop blinking
    clearInterval(blinkInterval); // Stop blink intervals
    LED.writeSync(0); // Turn LED off
    M1A.writeSync(0);
    M1B.writeSync(0);
    LED.unexport(); // Unexport GPIO to free resources
    M1A.unexport();
    M1B.unexport();
}

setTimeout(endBlink, 10000); //stop blinking after 5 seconds
setTimeout(function(){
    const player = Omx('/home/pi/R2D2/mp3/r2d2.mp3');
},8000)