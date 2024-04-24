import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import Chrome, ChromeOptions
from contextlib import contextmanager
import mysql.connector
from datetime import datetime
import pytz

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
url = f'https://app.tradersconnect.com/dashboard'
options = webdriver.ChromeOptions()
options.add_argument("--headless")

# Create a Chrome driver instance using the Service object
driver = webdriver.Chrome(options=options)

driver.get(url)

# login to website
wait = WebDriverWait(driver, 10) # waits up to 10 seconds
username_input = wait.until(EC.presence_of_element_located((By.ID, 'email-login')))
wait = WebDriverWait(driver, 10) # waits up to 10 seconds
password_input = wait.until(EC.presence_of_element_located((By.ID, '-password-login')))

#email-login
username_input.send_keys("tonywakley@gmail.com")
password_input.send_keys("tradersconnect0510!")

# Submit the login form
submit_button = driver.find_element(By.XPATH, '/html/body/div/div/div/div[1]/div/div/div[2]/div/div/div[2]/form/div/div[3]/div/button')
submit_button.click()

time.sleep(30)

current_url = driver.current_url

table_rows = driver.find_elements(By.XPATH, "/html/body/div[1]/div/main/div[2]/div[1]/div[4]/div[2]/div/div/div/div/div/table/tbody/tr")
rawArray= []

for row in table_rows:
    td_elements = row.find_elements(By.XPATH, "./td")
    if len(td_elements) >= 10:  # Check if there are at least 10 td elements
        Status = td_elements[0].text
        Account = td_elements[1].text
        Balance = td_elements[2].text
        Equity = td_elements[3].text
        OpenTrade = td_elements[4].text
        OpenPL = td_elements[5].text
        DayPL = td_elements[6].text
        WeekPL = td_elements[7].text
        MonthlyPL = td_elements[8].text
        TotalPL = td_elements[9].text
        rawArray.append({
            "Status":Status, "Account":Account, "Balance":Balance, "Equity":Equity, "OpenTrade":OpenTrade, "OpenPL":OpenPL, "DayPL":DayPL, "WeekPL":WeekPL, "MonthlyPL":MonthlyPL, "TotalPL":TotalPL,
        })
    else:
        print(f"Row with less than 10 td elements found: {td_elements}")


est = pytz.timezone('US/Eastern')
# Get current date and time in EST
est_time = datetime.now(est)
# Format datetime
CurrentDateTime = est_time.strftime('%Y-%m-%d %H:%M:%S')

for array in rawArray:
    Status = array["Status"]
    Account = array["Account"]
    Balance = array["Balance"]
    Equity = array["Equity"]
    OpenTrade = array ["OpenTrade"]
    OpenPL = array["OpenPL"]
    DayPL = array["DayPL"]
    WeekPL = array["WeekPL"]
    MonthlyPL = array["MonthlyPL"]
    TotalPL = array ["TotalPL"]
      
    insert_query = (
        "INSERT INTO TCBotAccountsSummary "
        "(DateTime, Status, Account, Balance, Equity, OpenTrades, OpenPL, DayPL, WeekPL, MonthlyPL, TotalPL) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )

    data_tuple = (
        CurrentDateTime, Status, Account, Balance, Equity, OpenTrade, OpenPL, DayPL, WeekPL, MonthlyPL, TotalPL
    )
    cursor.execute(insert_query, data_tuple)
    connection.commit()
    print("Scraping success!!!")
    
cursor.close()
connection.close()