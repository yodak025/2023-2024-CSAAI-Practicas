



function init() {
    alph = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var MMG = new Game(alph)
    var chrono = new Crono(document.getElementsByClassName("chrono")[0]);

    var buttons = []
    var displays = []

    for (let i = 0; i < 4; i++) {
        displays[i] = document.getElementById("d" + String(i));      
    }


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
        buttons[i].onclick = () => {

            
            
            switch(MMG.game(i)){

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
            
        }
    }


}


