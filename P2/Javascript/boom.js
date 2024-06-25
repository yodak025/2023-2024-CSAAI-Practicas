

var phase2 = false;
var message = null

function init() {

    var alph = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var boom = new Game(alph, turns=Infinity)
    var chrono = new Crono(document.getElementsByClassName("chrono")[0]);

    var started = false;

    var buttons = []
    var displays = []

    for (let i = 0; i < 4; i++) {
        displays[i] = document.getElementById("d" + String(i));
    }

    displays[0].classList.add("selected");

    var start = document.getElementById("Start");
    var stop = document.getElementById("Stop");
    var reset = document.getElementById("Reset");


    window.alert('¡Bienvenido! Por desgracia, la pagina está vacía... Lo lamento. Así que márchate, ¿vale?')

    start.onmousedown = () => {
        chrono.start();
        if (!started) {
            started = true;
        }
        start.classList.add("pressed");
    }

    start.onmouseup = () => {
        start.classList.remove("pressed");
    }

    stop.onmousedown = () => {
        chrono.stop();
        if (started) {
            started = false;
        }
        stop.classList.add("pressed");
    }
    stop.onmouseup = () => {
        stop.classList.remove("pressed");
    }

    reset.onmousedown = () => {
        chrono.stop();

        chrono.reset();
        boom = new Game(alph)
        document.getElementsByClassName("selected")[0].classList.remove("selected");
        displays[0].classList.add("selected");
        for (let n = 0; n < 4; n++) {
            displays[n].innerHTML = "*";
            displays[n].classList.remove("mistake");
            displays[n].classList.remove("match");
            displays[n].classList.remove("demimatch");
        }
        started = false;
        reset.classList.add("pressed");
    }
    reset.onmouseup = () => {
        reset.classList.remove("pressed");
    }




    for (let i = 0; i < 10; i++) {

        buttons[i] = document.getElementById(String(i));;
        buttons[i].onmousedown = () => {
            buttons[i].classList.add("pressed");

            if (started) {
                let pointer = false
                for (let j = boom.curr_el; !pointer; j++) {

                    if (j >= boom.LEN - 1) {
                        j -= boom.LEN;
                    }
                    if (boom.key[j + 1] != -1) {
                        document.getElementsByClassName("selected")[0].classList.remove("selected");
                        displays[j + 1].classList.add("selected");
                        pointer = true;
                        break;
                    }
                }

                TurnProcessor(i);

                boom.finish()

                if (allElementsAre(boom.key, -1)) {

                    if (phase2) {
                        window.alert("Vaya, has ganado de nuevo... De acuerdo, te enseñaré mi secreto.");
                        let btn = document.getElementById("MMButton")
                        btn.style.display = "inline"

                    } else {
                        phase2 = true;
                        window.alert("Vaya, has ganado... Supongo que no me queda alternativa...");

                        chrono.stop();
                        chrono.invert();

                        boom = new Game(alph);

                        document.getElementsByClassName("selected")[0].classList.remove("selected");
                        displays[0].classList.add("selected");
                        for (let n = 0; n < 4; n++) {
                            displays[n].innerHTML = "*";
                            displays[n].classList.remove("mistake");
                            displays[n].classList.remove("match");
                            displays[n].classList.remove("demimatch");
                        }

                    }

                    
                } else if (boom.curr_el === 1 && boom.MAXTURNS - boom.turns === 0 && !phase2) {
                    window.alert("¡Para! ¿Que crees que haces? Esto no funciona. Vete de aquí por favor.");
                }



            }/* else if (!message) {

                message = window.prompt("¡¿Lo ves?! La página está rota. ¿Por qué sigues aquí?");

                if (message == "MasterMind") {
                    window.alert("...");
                    window.alert("Pe.. Pero, ¿cómo lo supiste?");
                    let btn = document.getElementById("MMButton")
                    btn.style.display = "inline"  
            }}*/
        }
        buttons[i].onmouseup = () => {
            buttons[i].classList.remove("pressed");
        }

    }

    function TurnProcessor(x) {
        switch (boom.game(x)) {

            case "++":
                boom.finish()
                TurnProcessor(x);
                break;

            case "*":
                displays[boom.curr_el].innerHTML = "*";
                displays[boom.curr_el].classList.add("mistake");
                displays[boom.curr_el].classList.remove("match");
                displays[boom.curr_el].classList.remove("demimatch");

                if (phase2) {
                    // Si, si falla se le resta un poco de tiempo a la cuenta
                    chrono.sus();
                }
                break;

            case "-":
                displays[boom.curr_el].innerHTML = "-";
                displays[boom.curr_el].classList.add("demimatch");
                displays[boom.curr_el].classList.remove("match");
                displays[boom.curr_el].classList.remove("mistake");
                break;

            case "+":
                displays[boom.curr_el].innerHTML = x;
                displays[boom.curr_el].classList.add("match");
                displays[boom.curr_el].classList.remove("mistake");
                displays[boom.curr_el].classList.remove("demimatch");
                break;
        }
    }


}

function allElementsAre(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != val) {
            return false
        }
    }
    return true
}

