const servos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
function cridaServo(e) {
    e.preventDefault();
    let servo = document.querySelector("#numServo").value,
        posicio = document.querySelector("#valorServo").value;
    fetch(`/?servo=${servo}&posicio=${posicio}`);
}
function printPosition(obj) {
    //let position = 2000 - (obj.value * 10);
    let position = 1600 + (obj.value * 10);
    console.log('position: ' + position);
    if (position > 2000) {
        position = 2000;
    }

    let degrees = obj.value * -1;
    let servo = parseInt(obj.id.slice(5));//removing servo from id
    removeAllActive();
    obj.parentNode.classList.add('active');
    console.log(`Moving servo ${servo} to position ${position} - Aperture of ${obj.value} % `);
    fetch(`/?servo=${servo}&position=${position}`);
    document.querySelector(".line").style.transform = `rotate(${degrees}deg)`;
}
function motorHeadTurnRight() {
    console.log('Motor Head Turn Right');
    fetch('/?motorHead=turnRight')
}
function motorHeadTurnLeft() {
    console.log('Motor Head Turn Left');
    fetch('/?motorHead=turnLeft')
}
function motorHeadStop(){
    console.log('Motor Head Stop');
    fetch('/?motorHead=stop')
}
function resetServos() {
    let numServos = servos.length;
    let zeroPosition = 1800;
    console.log(`Reseting servos from ${servos[0]} to ${numServos}`)
    for (let index = 0; index < numServos; index++) {
        console.log(`Reseting servo ${index}`);
        fetch(`/?servo=${index}&position=${zeroPosition}`);
    }
}

function blinkLedStart(){
    console.log('start blinking led');
    fetch(`/?ledBlink=true`);
}

function blinkLedStop(){
    console.log('stop blinking led');
    fetch(`/?ledBlink=false`);
}

function removeAllActive() {
    let servosLi = document.querySelectorAll('.servos li');
    for (let index = 0; index < servosLi.length; index++) {
        servosLi[index].classList.remove('active');
    }
}
function playVideo(video) {

    if (document.querySelector("#playPause").innerHTML === 'Play Video') {
        document.querySelector("#playPause").innerHTML = 'Pause Video';
        fetch('/?playVideo=true');
    } else {
        document.querySelector("#playPause").innerHTML = 'Play Video';
        fetch('/?pauseVideo=true');
    }

}
function volumeUp() {
    fetch('/?volumeUp=true');
}
function volumeDown() {
    fetch('/?volumeDown=true');
}