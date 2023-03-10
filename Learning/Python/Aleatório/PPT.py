import random

list = ["pedra", "papel", "tesoura"]

def comparar(user, other, nickname):
    if (user == "pedra" and other == "tesoura") or (user == "tesoura" and other == "papel") or (user == "papel" and other == "pedra"):
        print("A máquina escolheu: "+other+".")
        print("parabéns, {}, você ganhou!\n".format(nickname))
    elif user == other:
        replay = input("Houve um empate, deseja tentar novamente?\n")
        if replay == "sim":
            user_input(nickname, players)
    else:
        print("A máquina escolheu {}. {}, você perdeu :((\n".format(other, nickname))

def user_input(nickname, players):
    if players == "sozinho":
        escolha = input("Você quer pedra, papel ou tesoura?\n")
        escolha_other = random.choice(list)
        comparar(escolha, escolha_other, nickname)
    elif players == "amigo":
        escolha = input("Você quer pedra, papel ou tesoura?\n")
        escolha_other = input("E você?\n")
        comparar(escolha, escolha_other, nickname)


nickname = input("Qual seu nome?\n")
players = input("Jogará sozinho ou com um amigo?\n")
user_input(nickname, players)
