class Game{
    

    constructor(alph){

        this.ALPHABET = alph
        this.LEN = 4
        this.KEY = this._random_key()

        this.turns = 10
        this.curr_el = -1
        



    }

    _random_key(){
        let key = []
        for(let i = 0; i < this.LEN; i++){
            key.push(Math.floor(Math.random() * this.ALPHABET.length))
        }
        return new Int8Array(key)
    }

    _matches(num){
        if (num == this.KEY[this.curr_el]) {
            this.curr_el += 1
            return true
        } else {
            for (let i = 0; i < this.KEY.length; i++) {
                if (this.KEY[i] == num) {
                    this.curr_el += 1
                    return false
                }
            }
            this.curr_el += 1
            return null
        }

            
    }

    _translator(x){ 
        for (let i = 0; i < this.ALPHABET.length; i++){
            if (this.ALPHABET[i] == x) {
                return i 
            }
        }
        alert("Error in translation")
        return null
    }

    game(symb){
        let num = this._translator(symb)
        if (this.curr_el == this.LEN - 1) {
            this.curr_el = -1
            this.turns -= 1
            if (this.turns == 0) {
                console.alert("Game over")
            } 

        }
        let result = this._matches(num)
        if (result == null){
            return "*"
        } else if (result == true){
            return "+"
        } else {
            return "-"
        }
        

    }


    
}


