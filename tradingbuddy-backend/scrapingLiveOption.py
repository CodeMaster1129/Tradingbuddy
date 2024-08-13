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

# Set the path to the Chrome driver executable

# set url
url = f'https://dashboard.tradealgo.com/live-options/35000/15'
options = webdriver.ChromeOptions()
options.add_argument("--disable-extensions")
options.add_argument('--disable-gpu')
options.add_argument('--disable-application-cache')
options.add_argument("--no-sandbox")
options.add_argument("--disable-setuid-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--headless")

driver = webdriver.Chrome(options=options)

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

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div/div[3]/div/div/div/div/div[3]/div/table/tbody/tr")

rawArray= []
for row in table_rows:
    DateTime = row.find_elements(By.XPATH, "./th/span")[0].text
    Ticker = row.find_elements(By.XPATH, "./th/span")[1].text
    ExpiryDate = row.find_elements(By.XPATH, "./th/span")[2].text
    Strike = row.find_elements(By.XPATH, "./th/span")[3].text
    OptionType = row.find_elements(By.XPATH, "./th/span")[4].text
    Spot = row.find_elements(By.XPATH, "./th/span")[5].text
    Bid = row.find_elements(By.XPATH, "./th/span")[6].text
    Details = row.find_elements(By.XPATH, "./th/span")[7].text
    Ask = row.find_elements(By.XPATH, "./th/span")[8].text
    OrderType = row.find_elements(By.XPATH, "./th/span")[9].text
    Premium = row.find_elements(By.XPATH, "./th/span")[10].text

    rawArray.append({
        "DateTime":DateTime, "Ticker":Ticker, "ExpiryDate":ExpiryDate, "Strike":Strike, "OptionType":OptionType,"Spot":Spot, "Bid":Bid, "Details":Details, "Ask":Ask, "OrderType":OrderType, "Premium":Premium,
    })
current_year = str(datetime.datetime.now().year)
current_month = str(datetime.datetime.now().month)
current_day = str(datetime.datetime.now().day)

for array in rawArray:
    DateTime = array["DateTime"]
    Ticker = array["Ticker"]
    ExpiryDate = array["ExpiryDate"]
    Strike = array["Strike"]
    OptionType = array ["OptionType"]
    Spot = array["Spot"]
    Bid = array["Bid"]
    Details = array["Details"]
    Ask = array["Ask"]
    OrderType = array ["OrderType"]
    Premium = array ["Premium"]
    
    select_query = "SELECT * from TALiveOptions WHERE Ticker = %s AND ExpiryDate = %s AND Strike = %s AND OptionType = %s AND Spot = %s AND Bid = %s AND Details = %s AND Ask = %s AND OrderType = %s AND Premium = %s"
    select_option = Ticker, ExpiryDate, Strike, OptionType, Spot, Bid, Details, Ask, OrderType, Premium
    cursor.execute(select_query, select_option)
    myresult = cursor.fetchall()
    if len(myresult) == 0:
        insert_query = (
            "INSERT INTO TALiveOptions "
            "(DateTime, Ticker, ExpiryDate, Strike, OptionType, Spot, Bid, Details, Ask, OrderType, Premium) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )

        if '/' in DateTime:
            Date = DateTime.split(' ')[0]
            Time = DateTime.split(' ')[1]
            Type = DateTime.split(' ')[2]
            CurrentDateTime = Date + '/' + current_year + ' ' + Time + ' ' + Type
        else:
            CurrentDateTime = current_month + '/' + current_day + '/' + current_year + ' ' + DateTime
        data_tuple = (
            CurrentDateTime, Ticker, ExpiryDate, Strike, OptionType, Spot, Bid, Details, Ask, OrderType, Premium
        )
        cursor.execute(insert_query, data_tuple)
        connection.commit()
        print("Scraping success!!!")
    else:
        print("Duplicate entry.")

cursor.close()
connection.close()