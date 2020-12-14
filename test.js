var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};
pwm = new Pca9685Driver(options, function (err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");


    function moureServo(n) {
        console.log('moureServo: '+n);
        enviaPols(n);
    }
    function enviaPols(n) {
        console.log('aqui arriba un:'+n);
        pwm.setPulseRange(n, 42, 10*n, function () {
            if (err) {
                console.error("Error setting pulse range.");
            } else {
                console.log("Enviat pols a " + n);
            }
        });
    }

    function doSetTimeout(i){
        console.log('doSetTimeout arriba un: '+ i)
        setTimeout(() => {
            console.log('cridem amb un: '+i);
            moureServo(i);
        }, 1000*i);
    }
    // Set channel 0 to turn on on step 42 and off on step 255
    // (with optional callback)
    for (var i = 0; i < 15; i++) {
        doSetTimeout(i);        
    }



    pwm.setPulseRange(2, 42, 255, function () {
        if (err) {
            console.error("Error setting pulse range.");
        } else {
            console.log("Pulse range set.");
        }
    });


    // Set the duty cycle to 25% for channel 8
    //pwm.setDutyCycle(10, 0.25);

    // Turn off all power to channel 6
    // (with optional callback)


    // Turn on channel 3 (100% power)
    //pwm.channelOn(10);



});
