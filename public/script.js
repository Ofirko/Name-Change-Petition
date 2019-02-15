let canv = document.getElementById("signature");
let draw = canv.getContext("2d");
var signing = false;
// draw.strokeStyle = "rebeccapurple";
// draw.beginPath();
// draw.arc(150, 150, 50, 0.5 * Math.PI, 2.5 * Math.PI);
// draw.lineTo(50, 50);
// draw.lineTo(150, 50);
// draw.moveTo(50, 150);
// draw.lineTo(50, 50);
// draw.moveTo(150, 150);
// draw.lineTo(150, 100);
// draw.lineTo(50, 50);
// draw.stroke();

canv.addEventListener("mousedown", function(e) {
    signing = true;
    draw.strokeStyle = "rebeccapurple";
    draw.beginPath();
    draw.moveTo(e.offsetX, e.offsetY);
});

canv.addEventListener("mousemove", function(e) {
    if (signing == true) {
        draw.lineTo(e.offsetX, e.offsetY);
        draw.stroke();
    }
});

canv.addEventListener("mouseup", function() {
    draw.stroke();
    signing = false;
});
