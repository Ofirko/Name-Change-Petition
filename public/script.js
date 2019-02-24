let canv = document.getElementById("signature");
let curl = document.getElementById("imgUrl");
if (canv != null) {
    let draw = canv.getContext("2d");
    var signing = false;

    canv.addEventListener("mousedown", function(e) {
        signing = true;
        draw.strokeStyle = "black";
        draw.lineWidth = 3;
        draw.beginPath();
        draw.moveTo(e.offsetX, e.offsetY);
    });

    canv.addEventListener("mousemove", function(e) {
        if (signing == true) {
            draw.lineTo(e.offsetX, e.offsetY);
            draw.stroke();
            curl.value = canv.toDataURL();
        }
    });

    canv.addEventListener("mouseup", function() {
        draw.stroke();
        curl.value = canv.toDataURL();
        // console.log("canvas url:", canv.toDataURL());
        signing = false;
    });
}

let par = document.getElementsByClassName("paragraph");
for (var i = 0; i < par.length; i++) {
    par[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}
