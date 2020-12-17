const servos = [1, 2, 3, 4, 5, 6, 7];
function cridaServo(e) {
    e.preventDefault();
    let servo = document.querySelector("#numServo").value,
        posicio = document.querySelector("#valorServo").value;
    fetch(`/?servo=${servo}&posicio=${posicio}`);
}
function printPosition(obj) {
    let position = 2000 - (obj.value * 10);
    let degrees = obj.value*-1;
    let servo = parseInt(obj.id.slice(5));//removing servo from id
    console.log(`Moving servo ${servo} to position ${position} - Aperture of ${obj.value} % `);
    fetch(`/?servo=${servo}&position=${position}`);
    document.querySelector(".line").style.transform=`rotate(${degrees}deg)`;
}
function resetServos() {
    let numServos = servos.length;
    let zeroPosition=1800;
    console.log(`Reseting servos from ${servos[0]} to ${numServos}`)
    for (let index = 0; index < numServos; index++) {
        console.log(`Reseting servo ${index}`);
        fetch(`/?servo=${index}&position=${zeroPosition}`);
    }
}