v_frame = 0;

function init() {

    console.log("Ejecutando JS...");

    const canvas = document.getElementById("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    screen = new CanvasElement("canvas", "Screen", [0.5, 0.525, 1.0, 0.95, 1.0, 0.95]);
    stone = new OneStone("canvas", "Stone", [0.1, 0.9, 0.2, 0.2, 0.1, 0.1], [3, 10], 9.81);
    timer = new TimeScore("canvas", "TimeScore", [0.95, 0.85, 0.4, 0.2, 0.4, 0.2]);

    blue_bird = new Twobirds("canvas", "BlueBird", [0.5, 0.5, 0.15, 0.15, 0.05/2, 0.10]);
    green_bird = new Twobirds("canvas", "GreenBird", [0.7, 0.4, 0.15, 0.15, 0.05/2, 0.10]);

    stone.colisioner.add0(screen.colider())
    stone.colisioner.add(blue_bird.colider())
    stone.colisioner.add(green_bird.colider())


    

    window.requestAnimationFrame(step);
    
}


function step(i) {

    v_frame += 1;

    screen.clear()
    
    //console.log(stone.colisioner.is_colision(stone.colider()))
    timer.setTime()
    stone.parabola(v_frame/1000)
    stone.draw("image")
    blue_bird.animate_bird(v_frame/8)
    green_bird.animate_bird(v_frame/6)
    window.requestAnimationFrame(step);

}



class CanvasElement {
    constructor(canvas_id, id = null, pos) {
        this._RATIO_ = null;

        if (id != null) {
            this.tex = document.getElementById(id);
        }

        this._canvas_id_ = canvas_id;
        this._id_ = id;

        this._canvas_ = document.getElementById(this._canvas_id_);
        this._RATIO_ = this._canvas_.width / this._canvas_.height;

        this.is_dead = false;



        this._position_ = {
            x: pos[0],
            y: pos[1],
            cx: pos[4],
            cy: pos[5]

        }

        this._size_ = {
            width: pos[2],
            height: pos[3]
        }

        this._ctx_ = this._canvas_.getContext("2d");

    }

    _recalc_window_() {
        this._canvas_.width = window.innerWidth;
        this._canvas_.height = window.innerHeight;
        this._RATIO_ = this._canvas_.width / this._canvas_.height;
    }

    _reaxe_(k, axis = "x", type = "default") {
        switch (type) {
            case "resize":
                switch (axis) {
                    case "x":
                        
                        return [
                            this._canvas_.width * k / this._RATIO_,
                        ]
                    case "y":
                        return [
                             this._canvas_.height * (k) 
                        ]
                }

            case "lb_corner":
                switch (axis) {
                    case "x":
                        return [
                            this._canvas_.width * (k[0]) - this._reaxe_(k[1]/2, "x", "resize"),
                        ]
                    case "y":
                        return [
                            this._canvas_.height * (1 - k[0]) - this._reaxe_(k[1]/2, "y", "resize")
                        ]
                }

                case "rh_corner":
                    switch (axis) {
                        case "x":
                            return [
                                this._canvas_.width * (k[0]) + this._reaxe_(k[1]/2, "x", "resize"),
                            ]
                        case "y":
                            return [
                                this._canvas_.height * (1 - k[0]) + this._reaxe_(k[1]/2, "y", "resize")
                            ]
                    }


            default:
                switch (axis) {
                    case "x":
                        return [
                            this._canvas_.width * k
                        ]
                    case "y":
                        return [
                            this._canvas_.height * k
                        ]
                }
        }


    }

    clear(){
        this._ctx_.clearRect(0, 0, this._canvas_.width, this._canvas_.height);
        this._recalc_window_()
    }

    draw(type = "rectangle") {

        if (this.is_dead) {
            return;
        }

        switch (type) {
            case "rectangle":
                this._ctx_.beginPath();
    
                this._ctx_.rect(
                    this._reaxe_([this._position_.x, this._size_.width], "x", "lb_corner"),
                    this._reaxe_([this._position_.y, this._size_.height], "y", "lb_corner"),
                    this._reaxe_(this._size_.width, "x", "resize"),
                    this._reaxe_(this._size_.height, "y", "resize"));
    
                this._ctx_.fillStyle = 'green';
    
                this._ctx_.fill();
    
                this._ctx_.stroke();
    
    
                this._ctx_.closePath();
                this._ctx_.save();
    
                break;
    
    
                
            case "image":
    
                this._ctx_.drawImage(this.tex,
                    this._reaxe_([this._position_.x, this._size_.width], "x", "lb_corner"),
                    this._reaxe_([this._position_.y, this._size_.height], "y", "lb_corner"),
                    this._reaxe_(this._size_.width, "x", "resize"),
                    this._reaxe_(this._size_.height, "y", "resize")
                );
                break;
        }

    }



    colider() {
        let lbx = this._position_.x - this._position_.cx/2
        let lby = this._position_.y - this._position_.cy/2
        let rbx = this._position_.x + this._position_.cx/2
        let rby = this._position_.y + this._position_.cy/2

        let x = [lbx, rbx]
        let y = [lby, rby]
        let _obj = this

        return [x, y, _obj]
    }
}


class TimeScore extends CanvasElement {
    constructor(canvas_id, id = null, pos = [0.5, 0.5, 0, 0]) {
        super(canvas_id, id, pos);
        this._time_ = new Crono()
        this._score_ = 100;
    }

    setTime() {


        this._time_.start()

        this._ctx_.font = "23px Arial";
        this._ctx_.fillStyle = 'black'



        this._ctx_.fillText(String(this._score_) + "    " + this._time_.disp,
        this._reaxe_([this._position_.x, this._size_.width], "x", "lb_corner"),
        this._reaxe_([this._position_.y, this._size_.height], "y", "lb_corner"),
        );

        this._ctx_.fillStyle = 'blue';


    }
}


class OneStone extends CanvasElement {
    constructor(canvas_id, id = null, pos, spd, grv) {
        super(canvas_id, id, pos);

        this._position_ = {
            x: pos[0],
            y: pos[1],
            x0: pos[0],
            y0: pos[1],
            cx: pos[4],
            cy: pos[5]
        }
        this._speed_ = {
            x: spd[0],
            y: spd[1],

        }

        this._boings = 0

        this.colisioner = {

            x: [],
            y: [],
            objs: [],

            x0: [],
            y0: [],
            objs0: [],

            len: 0,

            add: function (mat) {
                this.x.push(mat[0])
                this.y.push(mat[1])
                this.objs.push(mat[2])
                this.len += 1
            },

            add0: function (mat) {
                this.x0.push(mat[0])
                this.y0.push(mat[1])
                this.objs0.push(mat[2])
            },

            clear: function(){
                this.x = []
                this.y = []
            },

            is_colision: function (mat){
                let bx = false;
                let by = false;
                let description = "";

                if ((mat[0][0] < this.x0[0][0])||(mat[0][1] > this.x0[0][1]))
                    bx = true;
                    description = "edges"

                if ((mat[1][0] < this.y0[0][0])||(mat[1][1] > this.y0[0][1]))
                    by = true;
                    description = "edges"

                for (let i = 0; i < this.len; i++) {

                    if (((mat[0][0] > this.x[i][0])&(mat[0][0] < this.x[i][1])
                    | (mat[0][1] > this.x[i][0])&(mat[0][1] < this.x[i][1])) 
                    & ((mat[1][0] > this.y[i][0])&(mat[1][0] < this.y[i][1])
                    | (mat[1][1] > this.y[i][0])&(mat[1][1] < this.y[i][1]))){

                        bx = true;
                        by = true;

                        this.objs[i].is_dead = true;


                        description = "object"
                        
                    }
                }
                


            return [bx, by, description]
            }
         }


        this._gravity_ = -1 / 2 * grv
    }

    parabola(t) {

        //this._position_.x = this._position_.x0 + this._speed_.x * t
        //this._position_.y = this._position_.y0 + this._speed_.y * t + this._gravity_ * t * t

        if (this._boings > 5){
            return
        }

        this._speed_.y += this._gravity_ * t

        this._position_.x += this._speed_.x /500
        this._position_.y += this._speed_.y /500

        let is_colided = this.colisioner.is_colision(this.colider())

        switch (is_colided[2]) {
            case "edges":
                if (is_colided[0]) {
                    this._speed_.x = -this._speed_.x
                    return
                }
                if (is_colided[1]) {
                    this._speed_.y = -this._speed_.y
                    this._boings += 1
                    return
                }
            default:
                break;

        }
        



    }

    parabol(){

    }

}


class Twobirds extends CanvasElement {
    constructor(canvas_id, id, pos) {
        super(canvas_id, null, pos);
        this._id_ = id; 
        this.texs = [];

        for (let i = 0; i < 6; i++) {
            this.texs.push(document.getElementById(this._id_ + i))
        }
        
        this.__FRAMES__ = this.texs.length

        

    }

    animate_bird(x) {
        this.tex = this.texs[Math.trunc(x) % this.__FRAMES__]
        this.draw("image");

       
    }


}
