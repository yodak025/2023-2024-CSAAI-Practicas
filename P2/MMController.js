class MasterMind {
    constructor(canvas_id) {
        this.ctx = this._set_context(canvas_id);
        this.position = new function () {
            this.x = 0.0;
            this.y = 0.0;
            this.scale = 0.0
            this.roof_x = 0.0;
            this.roof_y = 0.0;
            this.roof_theta = 0.0;
            this.found_left = 0.0;
            this.found_right = 0.0;
        }

        this._set_shaders("vertexShader", "fragmentShader");
        this.draw_game();
    }

    _set_context(id) {
        // Gets the webGL context, and sets the clean black canvas.
        let canvas = document.getElementById(id);
        var gl = canvas.getContext("webgl");
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return gl;
    }


    _set_shaders(vertex_id, fragment_id) {

        // Create a vertex shader object and a fragment shader object.
        let vertex = document.getElementById(vertex_id).innerHTML;
        let fragment = document.getElementById(fragment_id).innerHTML;

        var vertex_shader = this.ctx.createShader(this.ctx.VERTEX_SHADER);
        this.ctx.shaderSource(vertex_shader, vertex);
        this.ctx.compileShader(vertex_shader);
        if (!this.ctx.getShaderParameter(vertex_shader, this.ctx.COMPILE_STATUS)) {
            alert("Error compiling shader: " + this.ctx.getShaderInfoLog(vertex_shader));
            return;
        }
        var fragment_shader = this.ctx.createShader(this.ctx.FRAGMENT_SHADER);
        this.ctx.shaderSource(fragment_shader, fragment);
        this.ctx.compileShader(fragment_shader);
        if (!this.ctx.getShaderParameter(fragment_shader, this.ctx.COMPILE_STATUS)) {
            alert("Error compiling shader: " + this.ctx.getShaderInfoLog(fragment_shader));
            return;
        }

        // Create a program object
        let program = this.ctx.createProgram();
        this.ctx.attachShader(program, vertex_shader);
        this.ctx.attachShader(program, fragment_shader);
        this.ctx.linkProgram(program);
        this.ctx.useProgram(program);
        this.ctx.program = program;
        return true;
    }




    _set_buffer(points, size) {
        let dim = 3;
        var vert = new Float32Array(points);

        var buffer = this.ctx.createBuffer();
        if (!buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, vert, this.ctx.STATIC_DRAW);

        // Assign the vertices in buffer object to gl_Position variable
        var gl_Position = this.ctx.getAttribLocation(this.ctx.program, "a_Position");

        if (gl_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        this.ctx.vertexAttribPointer(gl_Position, dim, this.ctx.FLOAT, false, 0, 0);
        this.ctx.enableVertexAttribArray(gl_Position);

        var gl_PointSize = this.ctx.getUniformLocation(this.ctx.program, "u_Size");

        if (gl_PointSize < 0) {
            console.log('Failed to get the storage location of a_PointSize');
            return -1;
        }
    
        this.ctx.uniform1f(gl_PointSize, size);

        // Return number of vertices
        return vert.length / dim;
    }


    draw_box(){
        // Draws the box.
        let box = [
            -0.9, -0.9, 0,
            0.9, -0.9, 0,

            0.9, -0.9, 0,
            0.9, 0.9, 0,

            0.9, 0.9, 0,
            -0.9, 0.9, 0,

            -0.9, 0.9, 0,
            -0.9, -0.9, 0,
        ]

        this.ctx.drawArrays(
            this.ctx.LINES, 0,
            this._set_buffer(box, 30)
        );
        

    }

    draw_color(position, size) {
        this.ctx.drawArrays(
            this.ctx.POINTS, 0,
            this._set_buffer(position, size)
        )
    }






    draw_game() {

        // Draws the home.
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
        this.draw_box();
        let turns = 10
        let sec_len = 4
        for (let i = 0; i < turns; i++) {
            for (let j = 0; j < sec_len; j++) {
                this.draw_color([0.8*(j/2 - 1), 0.8*(i/5 - 1), 0], 10)
            }


        }

        this.draw_color([], 5.0);
    }


}
function init() {
    
    MM = new MasterMind("Canvas");

    MM.draw_game()

}