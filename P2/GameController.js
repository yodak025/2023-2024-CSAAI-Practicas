class GameController {

    
    
    constructor(alphabet, length, max_turns) {    
        this.properties = {
            ALPHABET: alphabet,
            LEN : length,
            MAX_TURNS: max_turns
        };

        this.turns = max_turns;
        this.key = new Chain(this._generate_key(), 
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
        this.guess = null;
        this._matches()
    }

    _matches(){
        let matches = this.key.values.map(x => x == this.guess.values.indexOf(x));
        return matches;

    }

    _generate_key(){
        let key = [];
        for(let i = 0; i < this.properties.LEN; i++){
            key.push(Math.floor(Math.random() * this.properties.ALPHABET.length));
        }
        return new Int8Array(key);
    }

    _new_guess(guess){
        this.guess = new Chain(guess, this.properties.ALPHABET);
    }

    new_turn(guess){
        this.turns -= 1;
        this._new_guess(guess);
        let matches = this._matches();
        
    }



}

function Chain(key, alph = null) {
    this.ALPHABET = alph;
    
    if (key instanceof Int8Array){
        this.values = key;
    }
    else if(this.ALPHABET){
        this.values = new Int8Array(key.length);
        for(let i = 0; i < key.length; i++){
            this.values[i] = _idx(this.ALPHABET, key[i]);;
        }
        
    }else{
        console.log("Error in Chain constructor");
        return null;
    }

    function _idx(a, b){
        for (let i = 0; i < a.length; i++){
            if(a[i] == b){
                return i;
            }
        }
    }


    
    this.code = key;

    
}



x = new GameController("abc", 9, 10);
console.log(x.key.values);