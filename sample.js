
const canvas = document.querySelector("#tategaki-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = 200;
canvas.height = 200;

context.fillStyle = "#98fb98";
context.fillRect(0, 0, canvas.width, canvas.height);



