
function init() {

    console.log("Ejecutando JS...");

    const canvas = document.getElementById("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    screen = new CanvasElement("canvas", "Screen");
    stone = new OneStone("canvas", "Stone", [0.1, 0.9,0.1,0.1], [1, 1], 9.81);
    timer = new TimeScore("canvas", "TimeScore")

    window.requestAnimationFrame(step);
}


function step(i) {

    screen.clear()
    timer.setTime()
    stone.parabol(i/10000)
    stone.draw()
    window.requestAnimationFrame(step);

}



class CanvasElement {
    constructor(canvas_id, id = null, pos = [0.5, 0.5, 0.5, 0.5]) {
        this._RATIO_ = null;

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
                        this._recalc_window_()
                        return [
                            this._canvas_.width * k / this._RATIO_,
                        ]
                    case "y":
                        return [
                             this._canvas_.height * (k) 
                        ]
                }

            case "lb_origin":
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
        }9


    }

    clear(){
        this._ctx_.clearRect(0, 0, this._canvas_.width, this._canvas_.height);
    }

    draw() {

        this._ctx_.beginPath();
        this._ctx_.rect(
            this._reaxe_([this._position_.x, this._size_.width], "x", "lb_origin"),
            this._reaxe_([this._position_.y, this._size_.height], "y", "lb_origin"),
            this._reaxe_(this._size_.width, "x", "resize"),
            this._reaxe_(this._size_.height, "y", "resize")
        );

        this._ctx_.fillStyle = 'blue';

        this._ctx_.fill();

        this._ctx_.stroke();
        this._ctx_.closePath();
    }



    colision(other) {
        return false;
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
            this._canvas_.width * (this._position_.x - this._size_.width / 2) / 20,
            this._canvas_.height * (this._position_.y + this._size_.height / 2) / 10
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

        this._gravity_ = -1 / 2 * grv
    }

    parabol(t) {

        this._position_.x = this._position_.x0 + this._speed_.x * t
        this._position_.y = this._position_.y0 + this._speed_.y * t + this._gravity_ * t * t


    }

}