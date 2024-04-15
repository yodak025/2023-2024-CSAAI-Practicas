v_frame = 0;

function init() {

    console.log("Ejecutando JS...");

    const canvas = document.getElementById("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    screen = new CanvasElement("canvas", "Screen", [0.5, 0.525, 1.0, 0.95]);
    stone = new OneStone("canvas", "Stone", [0.1, 0.9,0.2,0.2], [1, 1], 9.81);
    timer = new TimeScore("canvas", "TimeScore", [0.95, 0.85, 0.4, 0.2]);

    bird = new Twobirds("canvas", "Bird0", [0.5, 0.5, 0.15, 0.15]);

    stone.colisioner.add0(screen.colider())
    stone.colisioner.add(bird.colider())

    window.requestAnimationFrame(step);
    
}


function step(i) {

    v_frame += 1;

    screen.clear()
    
    //console.log(stone.colisioner.is_colision(stone.colider()))
    timer.setTime()
    stone.parabol(v_frame/1000)
    stone.draw("image")
    bird.animate_bird(Math.trunc(v_frame/15))
    window.requestAnimationFrame(step);

}



class CanvasElement {
    constructor(canvas_id, id = null, pos = [0.5, 0.5, 0.5, 0.5]) {
        this._RATIO_ = null;

        if (id != null) {
            this.tex = document.getElementById(id);
        }

        this._canvas_id_ = canvas_id;
        this._id_ = id;

        this._canvas_ = document.getElementById(this._canvas_id_);
        this._RATIO_ = this._canvas_.width / this._canvas_.height;

        this._position_ = {
            x: pos[0],
            y: pos[1]
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
        let lbx = this._position_.x - this._size_.width/2
        let lby = this._position_.y - this._size_.height/2
        let rbx = this._position_.x + this._size_.width/2
        let rby = this._position_.y + this._size_.height/2

        let x = [lbx, rbx]
        let y = [lby, rby]

        return [x, y]
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
            y0: pos[1]
        }
        this._speed_ = {
            x: spd[0],
            y: spd[1],

        }

        this.colisioner = {

            x: [],
            y: [],

            x0: [],
            y0: [],

            add: function (mat) {
                this.x.push(mat[0])
                this.y.push(mat[1])
            },

            add0: function (mat) {
                this.x0.push(mat[0])
                this.y0.push(mat[1])
            },

            clear: function(){
                this.x = []
                this.y = []
            },

            is_colision: function (mat){
                let bx = false
                let by = false

                if ((mat[0][0] < this.x0[0][0])||(mat[0][1] > this.x0[0][1]))
                    bx = true
                if ((mat[1][0] < this.y0[0][0])||(mat[1][1] > this.y0[0][1]))
                    by = true



            return [bx, by]
            }
         }


        this._gravity_ = -1 / 2 * grv
    }

    parabol(t) {

        this._position_.x = this._position_.x0 + this._speed_.x * t
        this._position_.y = this._position_.y0 + this._speed_.y * t + this._gravity_ * t * t

        let is_colided = this.colisioner.is_colision(this.colider())
        if (is_colided[0] ) {
            this._speed_.x = -this._speed_.x
        }
        if (is_colided[1]) {
            this._speed_.y = -this._speed_.y
        }



    }

}


class Twobirds extends CanvasElement {
    constructor(canvas_id, id = null, pos) {
        super(canvas_id, null, pos);

        if (id != null) {
            this.texs = document.getElementsByClassName(id);
            this.tex = this.texs[0]
        }
        
        

    }

    animate_bird(t) {

        this.tex = this.texs[t % 6]
        this.draw("image")
    }


}
