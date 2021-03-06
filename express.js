"use strict";

var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var Omx = require("node-omxplayer");

const express = require("express");
const app = express();
const port = 3000;

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
  res.send("Hello World!");
  let channel = parseInt(req.query.servo) || null;
  let pulseLength = parseInt(req.query.position) || null;
  let playVideo = req.query.playVideo || null;
  let pauseVideo = req.query.pauseVideo || null;
  let volumeDown = req.query.volumeDown || null;
  let volumeUp = req.query.volumeUp || null;

  if (Number.isInteger(channel) && Number.isInteger(pulseLength)) {
    console.log("servo: " + channel + " posicio: " + pulseLength);
    //servoLoop();
    pwm.setPulseLength(channel, pulseLength);
  } else {
    console.log("Servo or position has bad values");
  }
  if (playVideo) {
    //  var player = Omx("/opt/vc/src/hello_pi/hello_video/test.h264");
    player.play();
    console.log("playing video test.h264");
  }
  if (pauseVideo) {
    //  var player = Omx("/opt/vc/src/hello_pi/hello_video/test.h264");
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
  // pwm = new Pca9685Driver(options, function startLoop(err, servo, posicio) {
  //   if (err) {
  //     console.error("Error initializing PCA9685");
  //     process.exit(-1);
  //   }

  //   //console.log("Starting servo loop...");
  //   console.log("cridant els servos amb: servo=" + servo + " posicio=" + posicio);
  //   // servoLoop();
  //   moveServo(servo, posicio)
  // });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.use("/static", express.static("static"));

// pulse lengths in microseconds (theoretically, 1.5 ms
// is the middle of a typical servo's range)
var pulseLengths = [
  1800,
  1700,
  1600,
  1500,
  1400,
  1300,
  1200,
  1200,
  1300,
  1400,
  1500,
  1600,
  1700,
];
//var pulseLengths = [1800];
var steeringChannel0 = 1;
var steeringChannel1 = 2;
var steeringChannel2 = 3;

// variables used in servoLoop

var nextPulse = 0;
var timer;

function moveServo(channel, pulseLength) {
  pwm.setPulseLength(channel, pulseLength);
}

// loop to cycle through pulse lengths
function servoLoop() {
  timer = setTimeout(servoLoop, 100);

  pwm.setPulseLength(steeringChannel0, pulseLengths[nextPulse]);
  nextPulse = (nextPulse + 1) % pulseLengths.length;
  pwm.setPulseLength(steeringChannel1, pulseLengths[nextPulse]);
  nextPulse = (nextPulse + 1) % pulseLengths.length;
  pwm.setPulseLength(steeringChannel2, pulseLengths[nextPulse]);
  nextPulse = (nextPulse + 1) % pulseLengths.length;
  console.log("LABORATORIS ENGINYERIA 2020");
  console.log("...........................");
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
