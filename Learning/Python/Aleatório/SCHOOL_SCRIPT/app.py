import requests
from bs4 import BeautifulSoup
import csv
import smtplib
import os
from dotenv import load_dotenv

# GETTING SENSITIVE DATA
load_dotenv()
USER_LOGIN = os.getenv("USER_LOGIN")
USER_PASSWORD = os.getenv("USER_PASSWORD")
EMAIL_LOGIN = os.getenv("EMAIL_LOGIN")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")

# DOING THE LOGIN AND GETTING THE DATA!

PORT = True
timesLooped = 0
while PORT:
    timesLooped += 1
    with requests.Session() as s:
        headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36 OPR/70.0.3728.106'
            }
        url = 'https://sigaa.ufrrj.br/sigaa/logar.do?dispatch=logOn'
        login_data = {
            'width': '1366',
            'height': '768',
            'urlRedirect': '',
            'subsistemaRedirect': '',
            'acao': '',
            'acessibilidade': '', 
            'user.login': USER_LOGIN,
            'user.senha': USER_PASSWORD
        }
        r = s.post(url, data=login_data, headers=headers)
        
        url = 'https://sigaa.ufrrj.br/sigaa/portais/discente/discente.jsf'
        data = {
            'menu:form_menu_discente': 'menu:form_menu_discente',
            'id': '3264',
            'jscook_action': 'menu_form_menu_discente_j_id_jsp_1051466817_98_menu:A]#{ portalDiscente.emitirBoletim }',
            'javax.faces.ViewState': 'j_id1'
        }
        s.post(url, data=data, headers=headers)

        url = 'https://sigaa.ufrrj.br/sigaa/ensino/tecnico_integrado/boletim/selecao.jsf'
        data = {
            'form': 'form',
            'javax.faces.ViewState': 'j_id2',
            'form:j_id_jsp_16163784_7j_id_2': 'form:j_id_jsp_16163784_7j_id_2',
            'anoEscolar': '2020'
        }
        r = s.post(url, data=data, headers=headers)


    # PRETTIFYING THE DATA THAT I GOT
    soup = BeautifulSoup(r.content, 'lxml')
    table = soup.find_all('table') #the second one is the one that matters
    tr = table[1].find_all('tr')
    materias = []
    r = 0
    for i in tr:
        r += 1
        if (2 <= r <= len(tr)-2):
            materia = i.text.split()
            materias.append(materia)

    changed = False

    def send_email(materia, nota):
        sender_email = EMAIL_LOGIN
        sender_password = EMAIL_PASSWORD
        receiver_email = EMAIL_RECEIVER
        body = f'Sua nota de {materia} foi atualizada para {nota}'
        message = f'Subject: Nota de {materia} atualizada!\n\n{body}'

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message)

    def clean_data(materia):
        if len(materia) == 13:
            materia.pop(3)
        for i in range(11, 7, -1):
            materia.pop(i)
        materia.pop(5)
        materia.pop(2)
        materia.pop(1)
        return materia


    for materia in materias:
        materia = clean_data(materia)
        with open('escola.csv', 'r+') as csv_file:
            cvs_reader = csv.reader(csv_file)
            cvs_writer = csv.writer(csv_file)
            for line in cvs_reader:
                if line[0] == materia[0]:
                    for i in range(1,5):
                        if not line[i] == materia[i]:
                            changed = True
                            PORT = False
                            send_email(materia[0], materia[i])


    #after comparing all the fields, create a new csv file, replacing the old one with the new data.
    if changed:
        with open('escola.csv', 'w', errors='ignore', encoding='utf-8') as csv_file:
            for materia in materias:
                if materia[0] == 'SCA0003':
                    csv_writer = csv.writer(csv_file, delimiter=',', lineterminator='')
                else:
                    csv_writer = csv.writer(csv_file, delimiter=',', lineterminator='\n')
                csv_writer.writerow(materia)
    print(timesLooped)