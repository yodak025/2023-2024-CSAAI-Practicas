



function init() {
    alph = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"]

    var MMG = new MasterMind(alph)

    var buttons = []
    var displays = []

    for (let i = 0; i < 4; i++) {
        displays[i] = document.getElementById("d" + String(i));      
    }


    for (let i = 0; i < 10; i++) {
        buttons[i] = document.getElementById(String(i));;
        buttons[i].onclick = () => {
            input = buttons[i].querySelector("h1").textContent
            displays[MMG.curr_el].innerHTML = MMG.game(input);
            
        }
    }


}


