



function init() {
    alph = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var MMG = new Game(alph)
    var chrono = new Crono(document.getElementsByClassName("chrono")[0]);

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
    }

    stop.onclick = () => {
        chrono.stop();
    }

    reset.onclick = () => {
        chrono.reset();
    }

    
    for (let i = 0; i < 10; i++) {

        buttons[i] = document.getElementById(String(i));;
        buttons[i].onclick = function f(){

            for (i = 0; i < MMG.LEN; i++){
                if (MMG.curr_el + i - 1 < MMG.LEN) {
                    if (MMG.key[MMG.curr_el + i]!== -1) {
                        document.getElementsByClassName("selected")[0].classList.remove("selected");
                        displays[MMG.curr_el + i].classList.add("selected");
                        break;
                    }
                } else {
                    if (MMG.key[MMG.curr_el - MMG.LEN + i]!== -1) {
                        document.getElementsByClassName("selected")[0].classList.remove("selected");
                        displays[MMG.curr_el - MMG.LEN + i].classList.add("selected");
                        break;
                    }
                }
            }
            
                

            switch(MMG.game(i)){

                case "++":
                    MMG.finish()
                    f();
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
                    displays[MMG.curr_el].innerHTML = i;
                    displays[MMG.curr_el].classList.add("match");
                    displays[MMG.curr_el].classList.remove("mistake");
                    displays[MMG.curr_el].classList.remove("demimatch");
                    break;
            }

            MMG.finish()
        }
    }


}


