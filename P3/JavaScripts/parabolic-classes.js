export class CanvasElement {
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
                            this._canvas_.width * (k[0]) - this._reaxe_(k[1] / 2, "x", "resize"),
                        ]
                    case "y":
                        return [
                            this._canvas_.height * (1 - k[0]) - this._reaxe_(k[1] / 2, "y", "resize")
                        ]
                }

            case "rh_corner":
                switch (axis) {
                    case "x":
                        return [
                            this._canvas_.width * (k[0]) + this._reaxe_(k[1] / 2, "x", "resize"),
                        ]
                    case "y":
                        return [
                            this._canvas_.height * (1 - k[0]) + this._reaxe_(k[1] / 2, "y", "resize")
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

    clear() {
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
        let lbx = this._position_.x - this._position_.cx / 2
        let lby = this._position_.y - this._position_.cy / 2
        let rbx = this._position_.x + this._position_.cx / 2
        let rby = this._position_.y + this._position_.cy / 2

        let x = [lbx, rbx]
        let y = [lby, rby]
        let _obj = this

        return [x, y, _obj]
    }
}


export class TimeScore extends CanvasElement {
    constructor(canvas_id, id = null, pos = [0.5, 0.5, 0, 0]) {
        super(canvas_id, id, pos);
        this._time_ = new Crono()
        this._score_ = 0;
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

    increaseScore() {
        this._score_ += 100
    }
}


export class OneStone extends CanvasElement {
    constructor(canvas_id, id = null, pos, grv) {
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
            x: 0,
            y: 0,

        }

        this._MAX_BOINGS_ = 0;

        this._boings = 0

        this.colisioner = {

            x: [],
            y: [],
            objs: [],

            x0: [],
            y0: [],
            objs0: [],

            timeScore: null,

            len: 0,

            addTimeScore: function (ts) {
                this.timeScore = ts;
            },

            clear: function () {
                this.x = [];
                this.y = [];
            },

            add: function (mat) {
                this.x.push(mat[0]);
                this.y.push(mat[1]);
                this.objs.push(mat[2]);
                this.len += 1;
            },

            add0: function (mat) {
                this.x0.push(mat[0]);
                this.y0.push(mat[1]);
                this.objs0.push(mat[2]);
            },

            is_colision: function (mat) {
                let bx = false;
                let by = false;
                let description = "";

                if ((mat[0][0] < this.x0[0][0]) || (mat[0][1] > this.x0[0][1]))
                    bx = true;
                description = "edges";

                if ((mat[1][0] < this.y0[0][0]) || (mat[1][1] > this.y0[0][1]))
                    by = true;
                description = "edges";

                for (let i = 0; i < this.len; i++) {

                    if (((mat[0][0] > this.x[i][0]) & (mat[0][0] < this.x[i][1])
                        | (mat[0][1] > this.x[i][0]) & (mat[0][1] < this.x[i][1]))
                        & ((mat[1][0] > this.y[i][0]) & (mat[1][0] < this.y[i][1])
                            | (mat[1][1] > this.y[i][0]) & (mat[1][1] < this.y[i][1]))) {

                        bx = true;
                        by = true;
                        if (!this.objs[i].is_dead)
                            this.timeScore.increaseScore();

                        this.objs[i].is_dead = true;
                        description = "object";
                        
                    }
                }



                return [bx, by, description]
            }
        }


        this._gravity_ = -1 / 2 * grv

        this.isStopped = false 
    }

    setDifficulty(diff) {
        switch (diff) {
            case "easy":
                this._MAX_BOINGS_ = 15;
                break;
            case "hard":
                this._MAX_BOINGS_ = 5;
                break;
            case "insane":
                this._MAX_BOINGS_ = 1;
                break;
        }

    }

    setInitialSpeed(spd) {
        this._speed_.x = 20 * spd[0];
        this._speed_.y = 42.9 * spd[1];
    }

    parabola(t) {

        if (this._boings > this._MAX_BOINGS_) {
            this.isStopped = true;
            return
        }

        this._speed_.y += this._gravity_ * t

        this._position_.x += this._speed_.x / 500
        this._position_.y += this._speed_.y / 500

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

    parabol(t, isOn) {
        if (isOn) {
            this.parabola(t)
        }
    }

}


export class Twobirds extends CanvasElement {
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
