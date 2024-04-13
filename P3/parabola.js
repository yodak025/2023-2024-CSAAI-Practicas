
function init() {
    console.log("Ejecutando JS...");

    const canvas = document.getElementById("canvas");

    //-- Definir el tamaño del canvas
    canvas.width = 1000;
    canvas.height = 500;

    stone = new OneStone("canvas", null,[0,0,1,1], [10, 10], 9.81 );
    timer = new TimeScore("canvas")

    window.requestAnimationFrame(step);
}

function step(i) {

            
    timer.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    timer.setTime()
    stone.parabol(i/1000)
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

    }

    draw() {
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
    constructor(canvas_id, id = null, pos = [17,0.5,0,0]) {
        super(canvas_id, id, pos);
        this.time = new Crono()
        this.score = 100;
    }

    setTime(){

        
        this.time.start()

        this.ctx.font = "23px Arial";
        this.ctx.fillStyle = 'black'



            this.ctx.fillText(String(this.score) + "    " + this.time.disp,
                this.canvas.width * (this.position.x - this.size.width/2) / 20,
                this.canvas.height * (this.position.y + this.size.height/2) / 10 
            );

            this.ctx.fillStyle = 'blue';


    }
}

class OneStone extends CanvasElement {
    constructor(canvas_id, id = null, pos, spd, grv) {
        super(canvas_id, id, pos);

        this.position = {
            x: pos[0],
            y: pos[1],
            x0: pos[0],
            y0: pos[1]
        }
        this.speed = {
            vx: spd[0],
            vy: spd[1]
        }

        this.gravity = -1/2 * grv
    }
    
    parabol(t){
        this.position.x = this.position.x + 1/2*Math.sin(2*Math.PI* t )
        this.position.y = this.position.y + 1/4*Math.sin(2*Math.PI* t )

        //this.position.x = this.position.x + this.position.vx*t;
        //this.position.y = this.position.y + this.position.vy*t + this.gravity*t*t;

    }
    
}