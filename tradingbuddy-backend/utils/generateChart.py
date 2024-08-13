from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
import time
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=chrome_options)
def generateChart(symbol):
    driver.get(f"https://tradingbuddytools.com/api/render/{symbol}") 
    time.sleep(2)
    iframe = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.chart-container iframe'))
    )
    driver.switch_to.frame(iframe)
    copyright_element = driver.find_element(By.CSS_SELECTOR, '.tv-widget-chart__copyrightingContainer')
    driver.execute_script("arguments[0].style.display = 'none';", copyright_element)
    div_element = driver.find_element(By.CSS_SELECTOR, '.tv-widget-chart__page')
    div_screenshot_base64 = div_element.screenshot_as_base64
    return div_screenshot_base64
