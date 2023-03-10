import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def pegar_contatos(driver, wait, grupo):

    pesquisar = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"side\"]/div[1]/div/label/div/div[2]")))
    pesquisar.click()
    pesquisar.send_keys(grupo)
    achar_grupo = wait.until(EC.element_to_be_clickable(("xpath", f"//span[@title='{grupo}']")))
    achar_grupo.click()
    time.sleep(3)
    get_info = driver.find_element_by_xpath("//*[@id=\"main\"]/header/div[2]/div[2]/span").text.split(", ")
    try:
        get_info.remove("You")
    except:
        get_info.remove("Você")
    driver.refresh()

    return get_info # uma lista a ser usada tanto para salvar os contatos quanto para enviar.


def enviar_grupos(driver, wait, grupo_nome, grupo_info, mensagem, admin):

    cached_grupo = []
    try:
        for pessoa in grupo_info:
            pesquisar = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"side\"]/div[1]/div/label/div/div[2]")))
            pesquisar.click()
            pesquisar.send_keys(grupo_nome)
            achar_grupo = wait.until(EC.element_to_be_clickable(("xpath", f"//span[@title='{grupo_nome}']")))
            achar_grupo.click()
            logo = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"main\"]/header/div[2]")))
            if logo.is_displayed:
                logo.click()
            else:
                achar_grupo.click()
                logo.click()
            search = wait.until(EC.element_to_be_clickable(("xpath", "//span[@data-icon='search']")))
            if search.is_displayed:
                search.click()
            else:
                logo.click()
                search.click()
            search_bar = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"app\"]/div/span[2]/div/div/div/div/div/div/div/div[1]/div/label/div/div[2]")))
            if search_bar.is_displayed:
                search_bar.click()
                search_bar.send_keys(pessoa)
                time.sleep(0.3)
            else:
                search.click()
                search_bar.click()
                search_bar.send_keys(pessoa)
                time.sleep(0.3)
            element = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"app\"]/div/span[2]/div/div/div/div/div/div/div/div[2]/div[1]/div/div/div/div/div/div[2]")))
            if element.is_displayed:
                element.click()
            else:
                search_bar.click()
                search_bar.send_keys(pessoa)
                time.sleep(1)
                element.click()
            if admin == "1":
                elemento_enviar = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"app\"]/div/span[4]/div/ul/li[3]")))
                elemento_enviar.click()
            else:
                elemento_enviar = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"app\"]/div/span[4]/div/ul/li/div")))
                elemento_enviar.click()
            chat_box = wait.until(EC.element_to_be_clickable(("xpath", "//*[@id=\"main\"]/footer/div[1]/div[2]/div")))
            chat_box.click()
            for linha in mensagem:
                chat_box.send_keys(linha)
                chat_box.send_keys(Keys.SHIFT + Keys.RETURN)
            send = wait.until(EC.element_to_be_clickable(("xpath", "//span[@data-icon='send']")))
            send.click()
            cached_grupo = cached_grupo + [pessoa]
    except:
        driver.refresh()
        cached_grupo = [pessoa for pessoa in grupo_info if pessoa not in cached_grupo]
        enviar_grupos(driver, wait, grupo_nome, cached_grupo, mensagem, admin)


def user_input():

    driver = webdriver.Chrome("C:\Program Files (x86)\chromedriver.exe")
    wait = WebDriverWait(driver, 10)
    driver.get("https://web.whatsapp.com")

    grupo = input("Qual o grupo em questão?\n")
    admin = input("Use '1' para sim e '2' para não\nVocê é ADM desse grupo? ")
    mensagem = input("Qual a Mensagem?\n").split("¨¨")
    get_info = pegar_contatos(driver, wait, grupo) # "get_info" é uma lista contendo os contatos de um grupo.
    enviar_grupos(driver, wait, grupo, get_info, mensagem, admin)


user_input()