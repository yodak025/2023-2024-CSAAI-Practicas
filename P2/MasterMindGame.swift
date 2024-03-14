import Glibc



enum MasterMindColor {
    case red
    case green
    case yellow
    case blue
    case black
    case white
}


extension MasterMindColor {
    var emoji: String {
        switch self {
            case .red   : return "🔴"
            case .green : return "🟢"
            case .yellow: return "🟡"
            case .blue  : return "🔵"
            case .black : return "⚫"
            case .white : return "⚪"
        }
    }
}



enum MasterMindError: Error {
    case wrongCharacter    // The user supplied a wrong Character to `from`
}

public enum MasterMindUnvalidCode: Error{
        case NotAColorComb
        case wrongNumberOfColors
}
 
var MachinesPatienceCounter = 0
var codeSize = 4
var maxTurn = 10

extension MasterMindColor {
    static func from(emoji: Character) throws -> MasterMindColor {        
        switch emoji {
            case "🔴": return .red
            case "🟢": return .green
            case "🟡": return .yellow
            case "🔵": return .blue
            case "⚫": return .black
            case "⚪": return .white
            default: throw MasterMindError.wrongCharacter
        }
    }
}

extension MasterMindColor: CustomStringConvertible {
    public var description: String { return emoji }
}


extension MasterMindColor {
    static func from(letter: Character) throws -> MasterMindColor {        
        // Your code here
        switch letter {
        case "r","R": return .red
        case "g","G": return .green
        case "y","Y": return .yellow
        case "b","B": return .blue
        case "k","K": return .black
        case "w","W": return .white
        default  : return try MasterMindColor.from(emoji: letter)
        
        }
    }
}    


extension String {
    func toMasterMindColorCombination() throws -> [MasterMindColor] {
        return try self.map { try MasterMindColor.from(letter: $0) }
    }
}





struct MasterMindGame {
    public let secretCode: [MasterMindColor] 
    public var maxTurns : Int
    public var currentTurn = 0
    var lastKey : [MasterMindColor] = [] // he colocado aquí esta variable para que se mantenga la secuencia del intento previo 
    
    
    static func randomCode(colors: Int) -> [MasterMindColor] {
        // Your code here.
        var code : [Character] = []
        let colours = ["r","b","y","g","k","w"]
        for _ in 0..<colors {
            if let randomColor = colours.randomElement(){ 
            code += randomColor 
            }
        }
      return  try!String(code).toMasterMindColorCombination()
    }
    init(_ secretCode: String? = nil) {
        // Your code here.
            if let validCode = secretCode{
                do
                {try self.secretCode = validCode.toMasterMindColorCombination()}
                catch{self.secretCode = MasterMindGame.randomCode(colors: codeSize)}
            }
            else {
                self.secretCode = MasterMindGame.randomCode(colors: codeSize)}
    maxTurns = maxTurn
    }
}



extension MasterMindGame {
    func countExactMatches(_ keyToTest: [MasterMindColor]) -> Int{
        var count = 0
        for position in 0..<secretCode.count{
            if keyToTest[position] == secretCode[position]{
                count += 1
            }
        }
        return count
    }
}


extension MasterMindGame {
    func countPartialMatches(_ keyToTest: [MasterMindColor]) -> Int{
        var count = 0
        var keyWithoutRepeated : [MasterMindColor] = []
        var codeWithoutRepeated : [MasterMindColor] = []
        for commonPosition in 0..<secretCode.count{
            if keyToTest[commonPosition] != secretCode[commonPosition]{
               keyWithoutRepeated.append(keyToTest[commonPosition]) 
               codeWithoutRepeated.append(secretCode[commonPosition])
            }
        }
        
        for testPosition in 0..<keyWithoutRepeated.count{
           for secretPosition in 0..<codeWithoutRepeated.count{
                     if keyWithoutRepeated[testPosition] == codeWithoutRepeated[secretPosition]{
                        count += 1
                        codeWithoutRepeated.remove(at: secretPosition)
                        break
                     }      
                }
        }
     return count
    }
}










extension MasterMindGame {
    mutating func newTurn(_ guess: String) throws {
        // Your code here
 
        func errorFilter(_ key : String)throws -> Bool{
            let listOfValidChars = "RrBbKkYyWwGg🔴🟡🟢🔵⚫⚪"
            let validChars = Array(listOfValidChars)
            var keyIsAValidComb = true
            let keyArray = Array(key)
            
            for stringPosition in 0..<keyArray.count {
                if !validChars.contains(keyArray[stringPosition]){
                    keyIsAValidComb = false
                    break
                }
            }
            if keyIsAValidComb {
                if key.count != secretCode.count{
                throw MasterMindUnvalidCode.wrongNumberOfColors
            }
            return true
            }
            else{
                throw MasterMindUnvalidCode.NotAColorComb
            }
            
            
        }   
        
        func turnProcessor (_ key: String){
            if currentTurn == maxTurns || lastKey == secretCode{
                print("El juego ha terminado.")
            }
            else{
                currentTurn += 1
                lastKey = try! key.toMasterMindColorCombination()
                print("Tu turno: \(currentTurn)")
                print("Tu combinación es: \(lastKey)")
                print("Número de aciertos: \(countExactMatches(lastKey))")
                print("Número de semiaciertos: \(countPartialMatches(lastKey))")
                if lastKey == secretCode{
                    print("Has ganado en el turno \(currentTurn) !")
                }
                else{
                    print("Lo siento, has perdido. Otra vez será.")
                }
                
            }
        }
        
        
       // do{
            if try errorFilter(guess) == true{
                turnProcessor(guess)
            }
                
        //}
            
    }

    
}

func MachineOutOfPatience(){
    var string = ""
    for _ in (1...1000000){
        string = ""
        string.append(Character(UnicodeScalar( (0...255).randomElement()!)))
        print(string, terminator: "")
        usleep(1000)
    }
    

} 
func gameProcessor(_ testgame: MasterMindGame){
    var key = ""
    var testGame = testgame
        for _ in (1...11){
            key = readLine()!
            do{ 
                try testGame.newTurn(key)
                let keyComparator = try key.toMasterMindColorCombination()                                                //error
                if keyComparator == testGame.secretCode{
                    try!testGame.newTurn(key)
                break
                } 
            }catch MasterMindUnvalidCode.NotAColorComb{
                print("Combinación incorrecta. Por favor, prueba de nuevo.")
                MachinesPatienceCounter += 1
                if MachinesPatienceCounter == 5 {
                    sleep(1)
                    print("    Oye... Creo que no estás tomándote esto en serio... >:(.")
                    sleep(1)
                    print("    Espero que esta vez todo vaya bien...")
                }
                if MachinesPatienceCounter == 9 {
                    for _ in (1...200){
                    usleep(500)
                    print("      OYE... CREO QUE NO ESTÁS TOMÁNDOTE ESTO EN SERIO... >:(.")
                    usleep(300)
                    print("      ESPERO QUE ESTA VEZ TODO VAYA BIEN...")
                    }
                }
                if MachinesPatienceCounter == 10 {
                    MachineOutOfPatience()
                }

            }catch MasterMindUnvalidCode.wrongNumberOfColors{
                print("Debes hacer una apuesta con \(codeSize) colores. Por favor, prueba de nuevo.")
                MachinesPatienceCounter += 1
                if MachinesPatienceCounter == 5 {
                    sleep(1)
                    print("    Oye... Creo que no estás tomándote esto en serio... >:(.")
                    sleep(1)
                    print("    Espero que esta vez todo vaya bien...")
                }
                if MachinesPatienceCounter == 9 {
                    for _ in (1...200){
                    usleep(500)
                    print("      OYE... CREO QUE NO ESTÁS TOMÁNDOTE ESTO EN SERIO... >:(.")
                    usleep(300)
                    print("      ESPERO QUE ESTA VEZ TODO VAYA BIEN...")
                    }
                }
                if MachinesPatienceCounter == 10 {
                    MachineOutOfPatience()
                }
            }catch{print("Ha ocurrido un error desconocido. Por favor, vuelve a empezar")
            }
    }
 }   
    


    func mainMenu(){
    let menu: String
    system("clear")
    print("##   ##    ###     ###   #######   ####   ####        @@   @@   @   @@    @   @@@@   ")
    print("# # # #   #   #   #         #     #       #   #       @ @ @ @   @   @ @   @   @   @  ")
    print("#  #  #   #####    ###      #      ####   ####        @  @  @   @   @  @  @   @   @  ")
    print("#     #   #   #       #     #     #       #  #        @     @   @   @   @ @   @   @  ")
    print("#     #   #   #    ###      #      ####   #   #       @     @   @   @    @@   @@@@   ")
    print("                                                                                     ")
    print("                                                                                   ~By DSota")
    print("Elige un modo de juego (introduciendo el número correspondiente)")
    print("1) 1 Jugador")
    print("2) 2 Jugadores")
    print("3) Reglas y más información")
    print("4) Opciones")
    menu = readLine()!
    system("clear")

    switch menu{
        case "1": do{
            print("Has seleccionado el modo 1 jugador")
            print("La clave se ha generado aleatoriamente, intenta adivinarla")
            print("**Clave de colores**")
            print("Rojo     🔴  : Letra R")
            print("Azul     🔵  : Letra B")
            print("Amarillo 🟡  : Letra Y")
            print("Verde    🟢  : Letra G")
            print("Blanco   ⚪  : Letra W")
            print("Negro    ⚫  : Letra K")
            print("Introduce una clave con letras seguidas en el orden que elijas")
            let testGame = MasterMindGame()
            gameProcessor(testGame) 
        }


        case "2": do{
            print("Has seleccionado el modo 2 jugadores")
            print("El primer jugador debe introducir a continuación la clave, el otro intentará adivinarla")
            print("**Clave de colores**")
            print("Rojo     🔴  : Letra R")
            print("Azul     🔵  : Letra B")
            print("Amarillo 🟡  : Letra Y")
            print("Verde    🟢  : Letra G")
            print("Blanco   ⚪  : Letra W")
            print("Negro    ⚫  : Letra K")
            let keyToGuess: String = readLine()!
            print("Introduce una clave con letras seguidas en el orden que elijas")
            let testGame = MasterMindGame(keyToGuess)
            gameProcessor(testGame) 

        }


        case "3": do{
            print("")
            print("from https://es.wikipedia.org/wiki/Mastermind")
            print("")
            print("")
            sleep(2)
            print("Mastermind (Español 'Mente maestra') es un juego de mesa, de ingenio y reflexión, para dos jugadores.")
            print("")
            print("")
            sleep(2)
            print("Se juega en un tablero con fichas blancas y negras pequeñas y de otros colores, de un tamaño algo superior. Uno de los jugadores escoge un número de fichas de colores, 4 en el juego original, y pone un código secreto oculto del otro jugador. Este, tomando fichas de colores del mismo conjunto, aventura una posibilidad contestada con negras (fichas de color bien colocadas) o blancas (fichas de color con el color correcto, pero mal colocadas).")
            print("")
            print("")
            sleep(2)
            print("Termina al averiguarse la combinación (es decir, se consigue una combinación con cuatro negras), o bien se agota el tablero (depende del tamaño, aunque generalmente son 15 combinaciones).")
            print("")
            print("")
            sleep(2)
            print("Mastermind es actualmente una marca comercial propiedad de Pressman Toys; el origen puede derivar de un juego tradicional inglés denominado Toros y vacas, se jugaba sobre papel: los 'toros' equivalían a las fichas negras, y las 'vacas' a las blancas.")
            var loopExit = false
            repeat {
                    if  readLine() != nil{
                    loopExit = true
                    }
                    
            } while !loopExit
            system("clear")
            mainMenu()
        }


        case "4":do {
            print("Selecciona el ajuste introduciendo su número")
            print("1) Número máximo de turnos")
            print("2) Longitud de la cadena")
            let options = readLine()!

            switch options{
                case "1": do {var loopExit = false
                    repeat {
                        print("Introduce el número máximo de turnos")
                        print("actualmente la partida dura \(maxTurn) turnos ")
                        if let maxTurInt = Int(readLine()!){
                        maxTurn = maxTurInt
                        loopExit = true
                        print("Número de turnos modificado")
                        print("Ahora la partida dura \(maxTurn) turnos ")
                        } else {
                            print("ERROR: Has introducido un valor incorrecto... Vuelve a intentarlo.")
                        } 
                    } while !loopExit
                    system("clear")
                    mainMenu()}

                case "2": do {
                    var loopExit = false
                    repeat {
                        print("Introduce la longitud deseada para la cadena")
                        print("actualmente la cadena es de \(codeSize) colores ")
                        if let codeSizeInt = Int(readLine()!){
                        codeSize = codeSizeInt
                        loopExit = true
                        print("Longitud modificada")
                        print("Ahora la cadena es de \(codeSize) colores ")
                        } else {
                            print("ERROR: Has introducido un valor incorrecto... Vuelve a intentarlo.")
                        } 
                    } while !loopExit
                    system("clear")
                    mainMenu()
                }
                default: do {print("Tú tí@ asegurate de escribir bien el número, ")
            print("no te lo estás tomando en serio o que? 😒.")
            print("Ahora se cerrará el programa. ")
            print("Venga, ejecútalo de nuevo y vuelve a intentarlo 🙄.")}
            }
        }


        default: do{
            print("Tú tí@ asegurate de escribir bien el número, ")
            print("no te lo estás tomando en serio o que? 😒.")
            print("Ahora se cerrará el programa. ")
            print("Venga, ejecútalo de nuevo y vuelve a intentarlo 🙄.")
        }
    }


}
