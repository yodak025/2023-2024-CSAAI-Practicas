
function init() {
    console.log("Ejecutando JS...");

    const canvas = document.getElementById("canvas");

    //-- Definir el tamaño del canvas
    canvas.width = 1000;
    canvas.height = 500;

    stone = new CanvasElement("canvas", null,[10,5,1,1] );

    window.requestAnimationFrame(step);
}

function step(i) {
    stone.draw()    
    window.requestAnimationFrame(step);
}



class CanvasElement {
    constructor(canvas_id, id = null, pos) {
        this._canvas_id = canvas_id;
        this._id = id;

        this.canvas = document.getElementById(this._canvas_id);

        this.position = {
            x: pos[0],
            y: pos[1]
        }

        this.size = {
            width: pos[2],
            height: pos[3]
        }

        this.ctx = this.canvas.getContext("2d");
        this.draw(10,10,5);

    }


    _get_ctx() {
        return 
    }

    draw() {

        this.ctx.beginPath();

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
        this.ctx.closePath();

        this.ctx.beginPath();
            this.ctx.rect(
                this.canvas.width * (this.position.x - this.size.width/2) / 20,
                this.canvas.height * (this.position.y - this.size.height/2) / 10, 
                this.canvas.width * this.size.width / 20,
                this.canvas.height * this.size.height / 10 
                
            );

            this.ctx.fillStyle = 'blue';

            this.ctx.fill();

            this.ctx.stroke();
        this.ctx.closePath();
    }

    colision(other) {
        return false;
    }
}

class TimeScore extends CanvasElement{
    constructor(canvas_id, id = null, pos = [18,9,1,0.4]) {
        super(canvas_id, id, pos);
        this.time = new Chrono()
    }

    setTime(){
        this.ctx.beginPath();

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
        this.ctx.closePath();
        
        



        this.ctx.beginPath();
            this.ctx.fillText("Time: " + this.time,
                this.canvas.width * (this.position.x - this.size.width/2) / 20,
                this.canvas.height * (this.position.y - this.size.height/2) / 10, 
                this.canvas.width * this.size.width / 20,
                this.canvas.height * this.size.height / 10 
                
            );

            this.ctx.fillStyle = 'blue';

            this.ctx.fill();

            this.ctx.stroke();
        this.ctx.closePath();
    }
}