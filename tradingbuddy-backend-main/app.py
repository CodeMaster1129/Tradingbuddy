from api.config import app, mysql
from api import auth, match, mttools, activity, trade, alert
from apscheduler.triggers.cron import CronTrigger
from apscheduler.schedulers.background import BackgroundScheduler
from flask import request, jsonify
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from datetime import datetime
from bs4 import BeautifulSoup

flag = 0

scheduler = BackgroundScheduler()

def wait_for_local_storage_item(driver, key, timeout=10):
    try:
        WebDriverWait(driver, timeout).until(
            lambda d: d.execute_script(f"return window.localStorage.getItem('{key}');") is not None
        )
    except TimeoutException:
        print(f"Timed out waiting for local storage item '{key}'")

def recordPrometheusRating():
    global flag
    try:
        with app.app_context():
            options = webdriver.ChromeOptions()
            options.add_argument("--headless")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-gpu")
            options.add_argument("--disable-application-cache")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-setuid-sandbox")
            options.add_argument("--disable-dev-shm-usage")

            with webdriver.Chrome(options=options) as driver:
                print("Scraping start---")
                driver.get(
                    "https://investorplace.com/aitrader/ipa-login/?ipa_from=https://investorplace.com/aitrader/"
                )
                driver.implicitly_wait(2)
                html_content = driver.page_source
                loginSoup = BeautifulSoup(html_content, "html.parser")
                loginbodypart = loginSoup.find("body")
                loginpart = loginbodypart.find("div", {"class": "iam-login__wrapper"})
                if loginpart:
                    usernameInput = driver.find_element(By.ID, "TAuserId")
                    passwordInput = driver.find_element(By.ID, "TApassword")
                    submitForm = driver.find_element(By.ID, "pir_login")
                    wait = WebDriverWait(driver, 10)
                    usernameInput.send_keys("petermcguirk@gmail.com")
                    passwordInput.send_keys("Murphyandmax2$")
                    submitForm.submit()
                    targetURL = "https://investorplace.com/aitrader/"
                    driver.get(targetURL)
                    currentURL = driver.current_url
                    wait.until(EC.url_to_be(targetURL))
                    if currentURL == targetURL:
                        storage_key = '/ipm/stock-score/v1/tickers/get-all'
                        wait_for_local_storage_item(driver, storage_key)
                        data = driver.execute_script(
                            "return JSON.parse(window.localStorage.getItem('/ipm/stock-score/v1/tickers/get-all')).value;"
                        )
                        cursor = mysql.connection.cursor()
                        insert_query = "INSERT INTO `Pscore` (`DateTime`, `Symbol`, `Pscore`) VALUES (%s, %s, %s)"
                        currentTime = datetime.now()
                        for x in data:
                            print(currentTime, x["ticker"], x["score"])
                            cursor.execute(
                                insert_query, (currentTime, x["ticker"], x["score"])
                            )
                        mysql.connection.commit()
                        cursor.close()
                        mysql.connection.close()
                        flag = 1
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        flag = 0

scheduler.add_job(
    recordPrometheusRating, 
    trigger=CronTrigger(day_of_week='mon-fri', hour=0, minute=0)
)
scheduler.start()

if __name__ == "__main__":
    print(datetime.now())
    app.run(host="0.0.0.0", port=5000, debug=False)
