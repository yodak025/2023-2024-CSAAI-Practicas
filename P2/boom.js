



function init() {
    alph = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var MMG = new MasterMind(alph)
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
            input = buttons[i].querySelector("h1").textContent
            displays[MMG.curr_el].innerHTML = MMG.game(input);
            
        }
    }


}


