
/* ----Modo Mapeo----- */
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var objects = [];
var coordinates = document.getElementById("coordinates");

let canvas = document.getElementById('game'); 
let ctx = canvas.getContext('2d');
canvas.addEventListener("mousemove", e => {
    coordinates.innerText = "X: "+e.clientX + " Y: " + e.clientY;
});
canvas.addEventListener("mousedown", e => {
    console.log("Down: ",e);
    startX = e.clientX;
    startY = e.clientY;
});
canvas.addEventListener("mouseup", e => {
    console.log("Up: ",e);
    endX = e.clientX;
    endY = e.clientY;
    ctx.beginPath();
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    ctx.closePath();
    objects.push({x:startX, y: startY -20, width: endX - startX, height: endY - startY})
});

var button = document.getElementById("endDraw");
button.addEventListener("click", e =>{
    var fileText = JSON.stringify(objects);
    var file = new Blob([fileText], {type : 'text/json'});
    let a = document.createElement("a");
    let url = URL.createObjectURL(file);
    a.href = url;
    a.download = "ObjectsWord1.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0);
});