class Game{
    

    constructor(alph){

        this.ALPHABET = alph
        this.MAXTURNS = 10
        this.LEN = 4
        this.KEY = this._random_key()

        this.turns = this.MAXTURNS
        this.curr_el = 0
        this.key = this.KEY   
    }

    _random_key(){
        let key = []
        for(let i = 0; i < this.LEN; i++){
            key.push(Math.floor(Math.random() * this.ALPHABET.length))
        }
        return new Int8Array(key)
    }

    _matches(num){
        if (this.key[this.curr_el] == -1) {
            this.curr_el += 1
            if (this.curr_el == this.LEN) {
                this.curr_el = 0
                this.turns -= 1
                if (this.turns == 0) {
                    console.alert("Game over")
                    return null
                }
            }
            return this._matches();
        }

        if (num == this.key[this.curr_el]) {
            this.key[this.curr_el] = -1
            return true
        } else {
            for (let i = 0; i < this.KEY.length; i++) {
                if (this.KEY[i] == num) {
                    return false
                }
            }
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
        if (this.curr_el == this.LEN) {
            this.curr_el = 0
            this.turns -= 1
            if (this.turns == 0) {
                window.alert("Game over")
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

    finish(){
        this.curr_el += 1
    }


    
}


