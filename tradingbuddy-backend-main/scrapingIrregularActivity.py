import os
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import Chrome, ChromeOptions
from contextlib import contextmanager
import pymysql
import json
import mysql.connector
import datetime

db_user = 'admin'
db_password = 'RDStradingbuddydb0510!'
db_host = 'tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com'
db_database = 'trading'

# Establish database connection
connection = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_database
)
cursor = connection.cursor()

# set url
url = f'https://dashboard.tradealgo.com/alerts/Large/Down'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")

options.add_argument("--headless")

# s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(options=options)
# driver.maximize_window()
# opts = ChromeOptions()
# opts.add_argument("--window-size=800,600")

# driver = Chrome(options=opts)

driver.get(url)

# login to website
username_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(1) > input')
password_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(2) > input')


username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("delta0510")

# Submit the login form
submit_button = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(4) > button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div[3]/div/div/div[2]/table/tbody/tr")
current_year = str(datetime.datetime.now().year)
rawArray= []
for row in table_rows:
    time_entered = current_year +' '+ row.find_element(By.XPATH, "./th/div/span/div").text
    ticker = row.find_elements(By.XPATH, "./th/div/a")[0].text
    company_name = row.find_elements(By.XPATH, "./th/div/a")[1].text
    irr_items = row.find_elements(By.XPATH, "./th/div/span/span")
    irregular = irr_items[0].text
    price_items = row.find_elements(By.XPATH, "./th/div/div")
    price = price_items[0].text

    rawArray.append({
        "time_entered":time_entered, "ticker":ticker, "company_name":company_name, "irregular":irregular, "price":price,
    })

for array in rawArray:
    timeEntered_item = array["time_entered"]
    ticker_itme = array["ticker"]
    companyName_item = array["company_name"]
    irregular_item = array["irregular"]
    price_item = array ["price"]
    select_query = "SELECT * from TAIrregularActivity WHERE Category = 'Large Caps' AND TimeEntered = %s AND Ticker = %s AND CompanyName = %s AND IrregularVolume = %s AND PriceDetected = %s"
    select_option = (timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item)
    cursor.execute(select_query, select_option) 
    myresult = cursor.fetchall() 
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TAIrregularActivity"
            "(Category, TimeEntered, Ticker, CompanyName, IrregularVolume, PriceDetected, Trending)"
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        data_tuple = (
            "Large Caps", timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item, "Down"
        )
        cursor.execute(insert_query, data_tuple)
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

# set url
url = f'https://dashboard.tradealgo.com/alerts/Large/Up'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")

options.add_argument("--headless")

# s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(options=options)
# driver.maximize_window()
# opts = ChromeOptions()
# opts.add_argument("--window-size=800,600")

# driver = Chrome(options=opts)

driver.get(url)

# login to website
username_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(1) > input')
password_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(2) > input')


username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("delta0510")

# Submit the login form
submit_button = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(4) > button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div[3]/div/div/div[2]/table/tbody/tr")
current_year = str(datetime.datetime.now().year)
rawArray= []
for row in table_rows:
    time_entered = current_year +' '+ row.find_element(By.XPATH, "./th/div/span/div").text
    ticker = row.find_elements(By.XPATH, "./th/div/a")[0].text
    company_name = row.find_elements(By.XPATH, "./th/div/a")[1].text
    irr_items = row.find_elements(By.XPATH, "./th/div/span/span")
    irregular = irr_items[0].text
    price_items = row.find_elements(By.XPATH, "./th/div/div")
    price = price_items[0].text

    rawArray.append({
        "time_entered":time_entered, "ticker":ticker, "company_name":company_name, "irregular":irregular, "price":price,
    })

for array in rawArray:
    timeEntered_item = array["time_entered"]
    ticker_itme = array["ticker"]
    companyName_item = array["company_name"]
    irregular_item = array["irregular"]
    price_item = array ["price"]
    select_query = "SELECT * from TAIrregularActivity WHERE Category = 'Large Caps' AND TimeEntered = %s AND Ticker = %s AND CompanyName = %s AND IrregularVolume = %s AND PriceDetected = %s"
    select_option = (timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item)
    cursor.execute(select_query, select_option) 
    myresult = cursor.fetchall() 
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TAIrregularActivity"
            "(Category, TimeEntered, Ticker, CompanyName, IrregularVolume, PriceDetected, Trending)"
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        data_tuple = (
            "Large Caps", timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item, "Up"
        )
        cursor.execute(insert_query, data_tuple)
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

# set url
url = f'https://dashboard.tradealgo.com/alerts/Medium/Down'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")

options.add_argument("--headless")

# s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(options=options)
# driver.maximize_window()
# opts = ChromeOptions()
# opts.add_argument("--window-size=800,600")

# driver = Chrome(options=opts)

driver.get(url)

# login to website
username_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(1) > input')
password_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(2) > input')


username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("delta0510")

# Submit the login form
submit_button = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(4) > button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div[3]/div/div/div[2]/table/tbody/tr")
current_year = str(datetime.datetime.now().year)
rawArray= []
for row in table_rows:
    time_entered = current_year +' '+ row.find_element(By.XPATH, "./th/div/span/div").text
    ticker = row.find_elements(By.XPATH, "./th/div/a")[0].text
    company_name = row.find_elements(By.XPATH, "./th/div/a")[1].text
    irr_items = row.find_elements(By.XPATH, "./th/div/span/span")
    irregular = irr_items[0].text
    price_items = row.find_elements(By.XPATH, "./th/div/div")
    price = price_items[0].text

    rawArray.append({
        "time_entered":time_entered, "ticker":ticker, "company_name":company_name, "irregular":irregular, "price":price,
    })

for array in rawArray:
    timeEntered_item = array["time_entered"]
    ticker_itme = array["ticker"]
    companyName_item = array["company_name"]
    irregular_item = array["irregular"]
    price_item = array ["price"]
    select_query = "SELECT * from TAIrregularActivity WHERE Category = 'Medium Caps' AND TimeEntered = %s AND Ticker = %s AND CompanyName = %s AND IrregularVolume = %s AND PriceDetected = %s"
    select_option = (timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item)
    cursor.execute(select_query, select_option) 
    myresult = cursor.fetchall() 
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TAIrregularActivity"
            "(Category, TimeEntered, Ticker, CompanyName, IrregularVolume, PriceDetected, Trending)"
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        data_tuple = (
            "Medium Caps", timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item, "Down"
        )
        cursor.execute(insert_query, data_tuple)
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

# set url
url = f'https://dashboard.tradealgo.com/alerts/Medium/Up'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")

options.add_argument("--headless")

# s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(options=options)
# driver.maximize_window()
# opts = ChromeOptions()
# opts.add_argument("--window-size=800,600")

# driver = Chrome(options=opts)

driver.get(url)

# login to website
username_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(1) > input')
password_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(2) > input')


username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("delta0510")

# Submit the login form
submit_button = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(4) > button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div[3]/div/div/div[2]/table/tbody/tr")
current_year = str(datetime.datetime.now().year)
rawArray= []
for row in table_rows:
    time_entered = current_year +' '+ row.find_element(By.XPATH, "./th/div/span/div").text
    ticker = row.find_elements(By.XPATH, "./th/div/a")[0].text
    company_name = row.find_elements(By.XPATH, "./th/div/a")[1].text
    irr_items = row.find_elements(By.XPATH, "./th/div/span/span")
    irregular = irr_items[0].text
    price_items = row.find_elements(By.XPATH, "./th/div/div")
    price = price_items[0].text

    rawArray.append({
        "time_entered":time_entered, "ticker":ticker, "company_name":company_name, "irregular":irregular, "price":price,
    })

for array in rawArray:
    timeEntered_item = array["time_entered"]
    ticker_itme = array["ticker"]
    companyName_item = array["company_name"]
    irregular_item = array["irregular"]
    price_item = array ["price"]
    select_query = "SELECT * from TAIrregularActivity WHERE Category = 'Medium Caps' AND TimeEntered = %s AND Ticker = %s AND CompanyName = %s AND IrregularVolume = %s AND PriceDetected = %s"
    select_option = (timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item)
    cursor.execute(select_query, select_option) 
    myresult = cursor.fetchall() 
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TAIrregularActivity"
            "(Category, TimeEntered, Ticker, CompanyName, IrregularVolume, PriceDetected, Trending)"
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        data_tuple = (
            "Medium Caps", timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item, "Up"
        )
        cursor.execute(insert_query, data_tuple)
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

# set url
url = f'https://dashboard.tradealgo.com/alerts/Small/Down'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")

options.add_argument("--headless")

# s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(options=options)
# driver.maximize_window()
# opts = ChromeOptions()
# opts.add_argument("--window-size=800,600")

# driver = Chrome(options=opts)

driver.get(url)

# login to website
username_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(1) > input')
password_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(2) > input')


username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("delta0510")

# Submit the login form
submit_button = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(4) > button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div[3]/div/div/div[2]/table/tbody/tr")
current_year = str(datetime.datetime.now().year)
rawArray= []
for row in table_rows:
    time_entered = current_year +' '+ row.find_element(By.XPATH, "./th/div/span/div").text
    ticker = row.find_elements(By.XPATH, "./th/div/a")[0].text
    company_name = row.find_elements(By.XPATH, "./th/div/a")[1].text
    irr_items = row.find_elements(By.XPATH, "./th/div/span/span")
    irregular = irr_items[0].text
    price_items = row.find_elements(By.XPATH, "./th/div/div")
    price = price_items[0].text

    rawArray.append({
        "time_entered":time_entered, "ticker":ticker, "company_name":company_name, "irregular":irregular, "price":price,
    })

for array in rawArray:
    timeEntered_item = array["time_entered"]
    ticker_itme = array["ticker"]
    companyName_item = array["company_name"]
    irregular_item = array["irregular"]
    price_item = array ["price"]
    select_query = "SELECT * from TAIrregularActivity WHERE Category = 'Small Caps' AND TimeEntered = %s AND Ticker = %s AND CompanyName = %s AND IrregularVolume = %s AND PriceDetected = %s"
    select_option = (timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item)
    cursor.execute(select_query, select_option) 
    myresult = cursor.fetchall() 
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TAIrregularActivity"
            "(Category, TimeEntered, Ticker, CompanyName, IrregularVolume, PriceDetected, Trending)"
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        data_tuple = (
            "Small Caps", timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item, "Down"
        )
        cursor.execute(insert_query, data_tuple)
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

# set url
url = f'https://dashboard.tradealgo.com/alerts/Small/Up'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")

options.add_argument("--headless")

# s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(options=options)
# driver.maximize_window()
# opts = ChromeOptions()
# opts.add_argument("--window-size=800,600")

# driver = Chrome(options=opts)

driver.get(url)

# login to website
username_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(1) > input')
password_input = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(2) > input')


username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("delta0510")

# Submit the login form
submit_button = driver.find_element(By.CSS_SELECTOR, '#root > div > main > div > div > div.contact-form > div > div > form > div:nth-child(4) > button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div[3]/div/div/div[2]/table/tbody/tr")
current_year = str(datetime.datetime.now().year)
rawArray= []
for row in table_rows:
    time_entered = current_year +' '+ row.find_element(By.XPATH, "./th/div/span/div").text
    ticker = row.find_elements(By.XPATH, "./th/div/a")[0].text
    company_name = row.find_elements(By.XPATH, "./th/div/a")[1].text
    irr_items = row.find_elements(By.XPATH, "./th/div/span/span")
    irregular = irr_items[0].text
    price_items = row.find_elements(By.XPATH, "./th/div/div")
    price = price_items[0].text

    rawArray.append({
        "time_entered":time_entered, "ticker":ticker, "company_name":company_name, "irregular":irregular, "price":price,
    })

for array in rawArray:
    timeEntered_item = array["time_entered"]
    ticker_itme = array["ticker"]
    companyName_item = array["company_name"]
    irregular_item = array["irregular"]
    price_item = array ["price"]
    select_query = "SELECT * from TAIrregularActivity WHERE Category = 'Small Caps' AND TimeEntered = %s AND Ticker = %s AND CompanyName = %s AND IrregularVolume = %s AND PriceDetected = %s"
    select_option = (timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item)
    cursor.execute(select_query, select_option) 
    myresult = cursor.fetchall() 
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TAIrregularActivity"
            "(Category, TimeEntered, Ticker, CompanyName, IrregularVolume, PriceDetected, Trending)"
            "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        )
        data_tuple = (
            "Small Caps", timeEntered_item, ticker_itme, companyName_item, irregular_item, price_item, "Up"
        )
        cursor.execute(insert_query, data_tuple)
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

connection.commit()
cursor.close()
connection.close()