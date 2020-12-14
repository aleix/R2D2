/*
 * examples/servo.js
 * https://github.com/101100/pca9685
 *
 * Example to turn a servo motor in a loop.
 * Javascript version.
 *
 * Copyright (c) 2015-2016 Jason Heard
 * Licensed under the MIT license.
 */

"use strict";

var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
//var Pca9685Driver = require("../").Pca9685Driver;


// PCA9685 options
var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: true
};


// pulse lengths in microseconds (theoretically, 1.5 ms
// is the middle of a typical servo's range)
var pulseLengths = [1800,1700,1600,1500,1400,1300,1200,1100,1200,1300,1400,1500,1600,1700];
//var pulseLengths = [1800];
var steeringChannel0 = 0;
var steeringChannel1 = 1;
var steeringChannel2 = 2;


// variables used in servoLoop
var pwm;
var nextPulse = 0;
var timer;


// loop to cycle through pulse lengths
function servoLoop() {
    timer = setTimeout(servoLoop, 100);

    pwm.setPulseLength(steeringChannel0, pulseLengths[nextPulse]);
    nextPulse = (nextPulse + 1) % pulseLengths.length;
    pwm.setPulseLength(steeringChannel1, pulseLengths[nextPulse]);
    nextPulse = (nextPulse + 1) % pulseLengths.length;
    pwm.setPulseLength(steeringChannel2, pulseLengths[nextPulse]);
    nextPulse = (nextPulse + 1) % pulseLengths.length;
}


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
pwm = new Pca9685Driver(options, function startLoop(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }

    console.log("Starting servo loop...");
    servoLoop();
});