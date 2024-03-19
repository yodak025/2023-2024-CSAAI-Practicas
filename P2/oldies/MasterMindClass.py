import random
import subprocess as terminal
import time

# esqueleto inicial
class MasterMindGame:
    # declaramos las variables que vamos a utilizar

    keyLenght = 4
    MMC = {}  # diccionario de colores válidos.

    secretCode = []  # código secreto que tenemos que adivinar.

    validColors = "rgybkw"  # colores mastermind permitidos

    maxTurns = 10  # máximo número de turnos para acertar la clave.
    currentTurn = 0  # turno actual.



    # construimos la función para iniciar la clase
    def __init__(self, combiCode: str = "nocombiCode", key = 0, turns = 0):
        # iniciamos el diccionario de colores
        self.MMC["red"]     = "🔴"
        self.MMC["green"]   = "🟢"
        self.MMC["yellow"]  = "🟡"
        self.MMC["blue"]    = "🔵"
        self.MMC["black"]   = "⚫"
        self.MMC["white"]   = "⚪"

        if key != 0:
            self.keyLenght = key
        if turns != 0:
            self.maxTurns = turns
        if combiCode == "noCombiCode":
            self.secretCode = self.randomCode(self.keyLenght)
        else:
            try:
                self.secretCode = self.toMasterMindColorCombination(combiCode)
            except:
                self.secretCode = self.randomCode(self.keyLenght)



    def randomCode(self, n: int):   # genera un código aleatorio
        colorlist = list(self.validColors)
        passCode = random.choices(colorlist, k=n)
        return self.toMasterMindColorCombination(passCode)

    def MasterMindColor(self, color: str):  # convertir cadenas en colores
        rcolor = "Color no encontrado."

        if   color == "r" or color == "R" or color == "🔴":
             rcolor = self.MMC["red"]
        elif color == "g" or color == "G" or color == "🟢":
             rcolor = self.MMC["green"]
        elif color == "b" or color == "B" or color == "🔵":
             rcolor = self.MMC["blue"]
        elif color == "y" or color == "Y" or color == "🟡":
             rcolor = self.MMC["yellow"]
        elif color == "k" or color == "K" or color == "⚫":
             rcolor = self.MMC["black"]
        elif color == "w" or color == "W" or color == "⚪":
             rcolor = self.MMC["white"]
        else:
             raise KeyError(rcolor)

        return rcolor

    def toMasterMindColorCombination(self, combi: list):  # obtener una cadena de colores mastermind
        return list(map(lambda n: self.MasterMindColor(n), combi))

    def countExactMatches(self, keyToTest: list,):
        compResult = list(map(lambda x, y: x == y, keyToTest, self.secretCode))     #Crea una lista con el resultado bool de comparar cada elemento de las listas
        count = len(list(filter(lambda x: x is True, compResult)))      #Devuelve el número de valores True
        return count


    def countPartialMatches(self, keyToTest: list):   #Una implementacion un tanto rebuscada.
        #Creo dos listas auxiliares para manipularlas en el proceso, y de primeras elimino los aciertos de ambas.

        count = 0       #variable que almacena la cuenta
        both = list(map(lambda x, y: (x, y), keyToTest, self.secretCode))   #Agrupo cada elemento de las listas originales en una dupla, y dichas duplas en esta lista.
        bothWithoutsExactMatches = list(filter(lambda x: x[0] is not x[1], both))   #Filtro las duplas que tengan elementos iguales (aciertos)
        keyWithoutExactMatches = list(map(lambda x: x[0], bothWithoutsExactMatches))    #Desempaqueto las duplas en dos listas
        codeWithoutExactMatches = list(map(lambda x: x[1], bothWithoutsExactMatches))

        for key in keyWithoutExactMatches:      #Comparo cada elemento de key con todos los elementos de code
            for code in codeWithoutExactMatches:
                if key == code:     #Cuando un elemento coincide tenemos un semiacierto que incrementa count en 1.
                    count += 1
                    codeWithoutExactMatches.remove(code)    #Este color puede darnos resultados duplicados en el futuro, y ya no es necesario
                    break   #Por las mismas razones se debe salir del bucle

        return count    #Al final de este proceso, count ha almaceado todos los semiaciertos



    def newturn(self, key):     #Gestiona cada turno
        MMKey = []
        try:                #Filtra error combinacion incorrecta
             MMKey = self.toMasterMindColorCombination(key)

        except:
            print("Por favor, introduce una clave de colores")
            return

        if len(key) != self.keyLenght:          #Filtra error numero de colores incorrecto
            print(f"Introduce una clave de {self.keyLenght} elementos.")
            return

        else:                                   #Informacion de cada turno
            self.currentTurn += 1
            print("")
            print("")
            print(f"Tu turno: {self.currentTurn}")
            print(f"Tu combinación es: {MMKey}")
            print(f"Número de aciertos: {self.countExactMatches(MMKey)}")
            print(f"Número de semiaciertos: {self.countPartialMatches(MMKey)}")
            if MMKey == self.secretCode:                #Mensaje de victoria
                print(f"Enhorabuena!!! Has ganado en el turno {self.currentTurn}. Sabia que lo lograrias ;)")
                self.currentTurn = self.maxTurns
            else:
                print("")
                print("")
                print("Lo siento... La clave es incorrecta.")
                if (self.maxTurns - self.currentTurn) < 4 and (self.maxTurns - self.currentTurn) > 1:                   #Mensaje personalizado ultimos turnos
                    print(f"Oye... No quisiera presionarte, pero solo te quedan {self.maxTurns - self.currentTurn} turnos...")
                    print("Animo, tu puedes!!!")
                elif (self.maxTurns - self.currentTurn) == 1:                                                           #Mensaje personalizado turno final
                    print("Bueno... La suerte está echada...")
                    print("Yo confio :) . A POR LA VICTORIAAAAAAAAA!!!!!!!!")
                elif self.maxTurns == self.currentTurn:                                                                 #Mensaje game over que invita a modificar los ajustes
                    print("")
                    print("")
                    print("Vaya...")
                    time.sleep(1)
                    print("Parece que no tienes lo que hay que tener.")
                    print("Menuda decepcion...")
                    time.sleep(1)
                    print("Supongo que es mi culpa por hacerme ilusiones.")
                    print("Pulsa cualquier tecla para volver al menú.")
                    time.sleep(1)
                    print("Puedes cambiar la dificultad en el menú aumentando el numero de turnos o recortando el tamaño de la clave...")
                    print("O puedes simplemente volver a intentarlo. ;)")
                else:                                                                                                   #Mensaje turno generico
                    print(f"Vamos, no te rindas!!! Aun te quedan {self.maxTurns - self.currentTurn} turnos!!!")




    def gameProcessor(self):                #Gestiona la partida
        while True:
            self.newturn(input())
            if self.currentTurn == self.maxTurns:
                break
