



function init() {
    alph = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var MMG = new Game(alph)
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
        MMG = new Game(alph)
        document.getElementsByClassName("selected")[0].classList.remove("selected");
        displays[0].classList.add("selected");
    }




    for (let i = 0; i < 10; i++) {

        buttons[i] = document.getElementById(String(i));;
        buttons[i].onclick = () => {


            if (started) {
                let pointer = false
                for (let j = MMG.curr_el; !pointer; j++) {

                    if (j >= MMG.LEN - 1) {
                        j -= MMG.LEN;
                    }
                    if (MMG.key[j + 1] != -1) {
                        document.getElementsByClassName("selected")[0].classList.remove("selected");
                        displays[j + 1].classList.add("selected");
                        pointer = true;
                        break;
                    }
                }

                TurnProcessor(i);

                MMG.finish()
            }
        }

    }

    function TurnProcessor(x) {
        switch (MMG.game(x)) {

            case "++":
                MMG.finish()
                TurnProcessor(x);
                break;

            case "*":
                displays[MMG.curr_el].innerHTML = "*";
                displays[MMG.curr_el].classList.add("mistake");
                displays[MMG.curr_el].classList.remove("match");
                displays[MMG.curr_el].classList.remove("demimatch");
                break;

            case "-":
                displays[MMG.curr_el].innerHTML = "-";
                displays[MMG.curr_el].classList.add("demimatch");
                displays[MMG.curr_el].classList.remove("match");
                displays[MMG.curr_el].classList.remove("mistake");
                break;

            case "+":
                displays[MMG.curr_el].innerHTML = x;
                displays[MMG.curr_el].classList.add("match");
                displays[MMG.curr_el].classList.remove("mistake");
                displays[MMG.curr_el].classList.remove("demimatch");
                break;
        }
    }


}


