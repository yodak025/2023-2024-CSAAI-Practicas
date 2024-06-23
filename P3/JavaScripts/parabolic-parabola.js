import { CanvasElement, OneStone, TimeScore, Twobirds } from "./parabolic-classes.js";

let v_frame = 0;

const drawingPadController = {

    isDrawable: true,
    isDrawing: false,

    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,

    xAux: 0,
    yAux: 0,

    //Lo admito, lo de atan2 ni de coña se me ha ocurrido a mi. 
    //Podría despejar la pendiente de la ecuación de la recta y luego calcular el ángulo, 
    //pero el tiempo apremia y no tengo ganas de perderlo con asquerosas matemáticas. Mejor desarrollar el juego.
    getInitialSpeed: function(stone) {
        const dx = this.x1 - this.x0;
        const dy = this.y0 - this.y1;
        const strength = Math.sqrt(dx * dx + dy * dy);
        const theta = Math.atan2(dy, dx);

        stone.setInitialSpeed(
            [strength * Math.cos(theta), strength * Math.sin(theta)]
        );
    }


}

console.log("Ejecutando JS...");

const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const drawingPad = document.getElementById("drawing-pad");
drawingPad.width = window.innerWidth / 4;
drawingPad.height = window.innerHeight / 2;

const drawingLimits = [drawingPad.width, drawingPad.height];


drawingPad.addEventListener("mousedown", function (e) {
    if (drawingPadController.isDrawable && !drawingPadController.isDrawing) {
        drawingPadController.isDrawing = true;
        drawingPadController.x0 = e.offsetX;
        drawingPadController.y0 = e.offsetY;
        drawingPadController.xAux = e.offsetX;
        drawingPadController.yAux = e.offsetY;
    }
});

drawingPad.addEventListener("mousemove", function (e) {
    if (drawingPadController.isDrawable && drawingPadController.isDrawing) {
        const ctx = drawingPad.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(drawingPadController.xAux, drawingPadController.yAux);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        drawingPadController.xAux = e.offsetX;
        drawingPadController.yAux = e.offsetY;

        if (drawingPadController.xAux > drawingLimits[0] || drawingPadController.yAux > drawingLimits[1]) {
            drawingPadController.isDrawing = false;
            drawingPadController.isDrawable = false;
            drawingPadController.x1 = drawingPadController.xAux;
            drawingPadController.y1 = drawingPadController.yAux;
            drawingPadController.getInitialSpeed(stone);
        }
    }
});

const screen = new CanvasElement("canvas", "Screen", [0.5, 0.525, 1.0, 0.95, 1.0, 0.95]);
const stone = new OneStone("canvas", "Stone", [0.1, 0.1, 0.2, 0.2, 0.1, 0.1], 9.81);

drawingPad.addEventListener("mouseup", function (e) {
    if (drawingPadController.isDrawable & drawingPadController.isDrawing) {
        drawingPadController.isDrawing = false;
        drawingPadController.isDrawable = false;
        drawingPadController.x1 = drawingPadController.xAux;
        drawingPadController.y1 = drawingPadController.yAux;
        drawingPadController.getInitialSpeed(stone);
    }
});

const timer = new TimeScore("canvas", "TimeScore", [0.95, 0.85, 0.4, 0.2, 0.4, 0.2]);
const blue_bird = new Twobirds("canvas", "BlueBird", [0.5, 0.5, 0.15, 0.15, 0.05 / 2, 0.10]);
const green_bird = new Twobirds("canvas", "GreenBird", [0.7, 0.4, 0.15, 0.15, 0.05 / 2, 0.10]);

stone.colisioner.add0(screen.colider())
stone.colisioner.add(blue_bird.colider())
stone.colisioner.add(green_bird.colider())




window.requestAnimationFrame(step);




function step(i) {

    v_frame += 1;

    screen.clear()

    //console.log(stone.colisioner.is_colision(stone.colider()))
    timer.setTime()
    stone.parabol(v_frame / 1000, !drawingPadController.isDrawable)
    stone.draw("image")
    blue_bird.animate_bird(v_frame / 8)
    green_bird.animate_bird(v_frame / 6)
    window.requestAnimationFrame(step);

}


