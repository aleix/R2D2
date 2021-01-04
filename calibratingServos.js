var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var Omx = require("node-omxplayer");

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};
const servos = [10, 11,12, 13, 14, 15 ];
const happyMove = [{
    'position': 1400,
    'time': 100
}, {
    'position': 1500,
    'time': 100
},
{
    'position': 1700,
    'time': 100
}, {
    'position': 1800,
    'time': 200
}, {
    'position': 1350,
    'time': 100
}]
const pwm = new Pca9685Driver(options, function (err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");
});

// pwm.setPulseRange(1, 125, 255, function (err) {
//     if (err) {
//         console.error("Error setting pulse range.");
//     } else {
//         console.log("Pulse range set to servo 1step 125 to 255 ");
//     }
// });
function moveServo(servo, position) {
    console.log(`Moure servo: ${servo} position: ${position}`);
    pwm.setPulseLength(servo, position);
}
function play(index, servo, moviments) {
    let position = moviments[index];
    let length = moviments.length;
    if (index < length) {
        setTimeout(function () {
            moveServo(servo, position.position);
            index++;
            play(index, servo, moviments);
        }, position.time, index, position);
    }
}

const player = Omx('/home/pi/R2D2/mp3/r2d2.mp3');
setTimeout(function () {
    play(0, 12, happyMove);
    play(0, 10, happyMove);
}, 3000)
setTimeout(function () {
    play(0, 13, happyMove);
    play(0, 14, happyMove);
}, 2000)
//play(0, 4, happyMove);

//play(0, 6, happyMove);-->borken servo


//play (index,servo,movement Type)