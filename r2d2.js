"use strict";

var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var Omx = require("node-omxplayer");
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

const LED = new Gpio(21, 'out'); //use GPIO pin 21 to control one red led, and specify that it is output
const M1A = new Gpio(16, 'out'); //use GPIO pin 16 to control motor of rotate head.
const M1B = new Gpio(20, 'out'); //use GPIO pin 20 to control motor of rotate head.
let blinkInterval = null;
const express = require("express");
const app = express();
const port = 80;

// PCA9685 options
var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: true,
};

const pwm = new Pca9685Driver(options, function (err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");
});
//const player = Omx("/opt/vc/src/hello_pi/hello_video/test.h264");
const player = Omx('/home/pi/video.mp4');
player.pause();

app.get("/", (req, res) => {
    res.send("Look in /static to play with R2D2");
    let channel = parseInt(req.query.servo) || null;
    let pulseLength = parseInt(req.query.position) || null;
    let playVideo = req.query.playVideo || null;
    let pauseVideo = req.query.pauseVideo || null;
    let volumeDown = req.query.volumeDown || null;
    let volumeUp = req.query.volumeUp || null;
    let motorHead = req.query.motorHead || null;
    let ledBlink = req.query.ledBlink || null;

    if (ledBlink) {
        console.log('Start Blinking Led');
        blinkLED();
    } else {
        console.log('Stop Blinking Led');
        endBlink();
    }
    //controlling motorHead
    if (motorHead === "turnRight") {
        // if (blinkInterval!= null) {
        //     endBlink();
        // }
        console.log('Turn right motor head');
        M1A.writeSync(1);
        M1B.writeSync(0);
        // blinkInterval = setInterval(blinkLED, 400); //run the blinkLED function every 250ms
    }
    if (motorHead === "turnLeft") {
        // if (blinkInterval!= null) {
        //     endBlink();
        // }
        console.log('Turn left motor head');
        M1A.writeSync(0);
        M1B.writeSync(1);
        //blinkInterval = setInterval(blinkLED, 200); //run the blinkLED function every 250ms
    }
    if (motorHead === "stop") {
        console.log('Stop motor head');
        M1A.writeSync(0);
        M1B.writeSync(0);
        //M1A.unexport();
        //M1B.unexport();
        // endBlink();
    }
    if (Number.isInteger(channel) && Number.isInteger(pulseLength)) {
        console.log("servo: " + channel + " posicio: " + pulseLength);
        pwm.setPulseLength(channel, pulseLength);
    } else {
        console.log("Servo or position has bad values");
    }
    if (playVideo) {
        player.play();
        console.log("playing video test.h264");
    }
    if (pauseVideo) {
        player.pause();
        console.log("pausing video test.h264");
    }
    if (volumeDown) {
        player.volDown();
        console.log("Volume Down");
    }
    if (volumeUp) {
        player.volUp();
        console.log("Volume Up");
    }

});

// blink led
function blinkLED() { //function to start blinking
    if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
        LED.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
        LED.writeSync(0); //set pin state to 0 (turn LED off)
    }
}
function endBlink() { //function to stop blinking
    clearInterval(blinkInterval); // Stop blink intervals
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport GPIO to free resources
}
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.use("/static", express.static("static"));


// set-up CTRL-C with graceful shutdown
process.on("SIGINT", function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    pwm.dispose();
});

// initialize PCA9685 and start loop once initialized
