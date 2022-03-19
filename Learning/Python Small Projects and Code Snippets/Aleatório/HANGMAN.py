#escolher uma letra, se for igual achá-la e exibí-la no console, se for errada "perder vida" e exibí-la no console de letras já chutadas
import random

def criptografar(word):
    new_word = ""
    r = 0
    for i in range(len(word)):
        if word[i] == " ":
            new_word += word[i]
            r += 1
        else:
            new_word += "-"
    return new_word.upper()

def resolver():
    with open("words.txt", "r") as file:
        word = file.read().split()
    word = random.choice(word).upper()
    new_word = criptografar(word)
    tentativas = ""
    vida = 6
    while vida >= 0 and new_word != word:
        letter = input("Escolha uma letra:\n").upper()
        if len(letter) == 1:
            if letter not in new_word and letter not in tentativas:
                if letter in word:
                    for i in range(len(word)):
                        if word[i] == letter:
                            new_word = letter.join((new_word[:i], new_word[i+1:]))
                    print(new_word)
                    print("_______________________________________")
                else:
                    print("\nEssa letra não está na palavra.\n")
                    vida -= 1
                    tentativas += letter + ", "
                    print(new_word)
                    print("Tentativas: "+tentativas)
                    print("_______________________________________")
            else:
                print("\n{} já foi usada! Tente outra.\n".format(letter))
                if tentativas != "":
                    print("\nTentativas: "+tentativas+"\n")
                print(new_word)
                print("_______________________________________")
        else:
            print("\nPor favor, escolha uma letra!")
    if new_word != word:
        print("\n\nA palavra era: {}. Você morreu e não acertou, perdendo o jogo\n\n".format(word))
        play_again = input("Quer jogar novamente?\n").upper()
        if play_again == "SIM":
            print("\n\n\n")
            resolver()
    else:
        print("\n\nA palavra era: {}. Parabéns, você acertou e ganhou o jogo!\n\n".format(word))
        play_again = input("Quer jogar novamente?\n").upper()
        if play_again == "SIM":
            print("\n\n\n")
            resolver()



resolver()
