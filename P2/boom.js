



function init() {
    alph = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var boom = new Game(alph)
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


    start.onclick = () => {
        chrono.start();
        if (!started) {
            started = true;
        }
    }

    stop.onclick = () => {
        chrono.stop();
        if (started) {
            started = false;
        }
    }

    reset.onclick = () => {
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
        
    }




    for (let i = 0; i < 10; i++) {

        buttons[i] = document.getElementById(String(i));;
        buttons[i].onclick = () => {


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

                if (all_el(boom.key, -1)) {
                    window.alert("You win!")
                }
            }
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

function all_el (arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]!= val) {
            return false
        }
    }
    return true
}

function real_init() {
    init();
}

