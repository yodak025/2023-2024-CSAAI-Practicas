//boom = GameController("0123456789", 4, 10);

//boom.new_turn("0101")



function init() {
    var buttons = []

    var count = 0
    var displays = []
    for (let i = 0; i < 4; i++) {
        displays[i] = document.getElementById("d" + String(i));
        
    }

    for (let i = 0; i < 10; i++) {
        buttons[i] = document.getElementById(String(i));;
        buttons[i].onclick = () => {
            displays[count].innerHTML = String(i);
            count += 1;
        }
    }
    
    displays = []
    for (let i = 0; i < 4; i++) {
        displays[i] = document.getElementById("d" + String(i));
        
    }

}


