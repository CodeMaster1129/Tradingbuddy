import time
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import mysql.connector
from mysql.connector import Error
from datetime import datetime

db_user = 'admin'
db_password = 'RDStradingbuddydb0510!'
db_host = 'tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com'
db_database = 'trading'

credentials = Credentials.from_service_account_file('credentials.json')
service = build('sheets', 'v4', credentials=credentials)
spreadsheet_id = '1gFxFEtsDEOuaaEUwebgbATgfznl8KJrFGnzxjMcEuG4'

range_name_output = 'Dashboard!A4'

try:
    connection = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("SELECT Symbol FROM vwSymbolsListNASDAQ_AtoC")
        results = cursor.fetchall()
        results = results[600:800] #1129
        for result in results:
            body = {
            'values': [[result[0]]]
            }
            symbol = result[0]
            request1 = service.spreadsheets().values().update(spreadsheetId=spreadsheet_id, range=range_name_output, valueInputOption='RAW', body=body)
            response1 = request1.execute()
            time.sleep(30)   #reduce sleep time
            get_range_names = ['A14', 'G17', 'G18', 'G19', 'F19']
            request2 = service.spreadsheets().values().batchGet(spreadsheetId=spreadsheet_id, ranges=get_range_names)
            response2 = request2.execute()
            data = [i['values'][0][0] for i in response2['valueRanges']]
            print("---", data)
            current_datetime = datetime.now()
            score = data[0]
            if score == "#DIV/0!":
                score = 0
            avarage_value_estimate = data[1]
            if avarage_value_estimate == "#DIV/0!":
                avarage_value_estimate = 0
            last_closing_price = data[2]
            if last_closing_price == "#DIV/0!":
                last_closing_price = 0
            overvalued = data[4]
            if overvalued == "#DIV/0!":
                overvalued = None
            value_percent = data[3]
            if value_percent == "#DIV/0!":
                value_percent = 0
            else: 
                value_percent = float(value_percent.replace('%', '')) / 100

            print("data-->", current_datetime, symbol, score, avarage_value_estimate, last_closing_price, overvalued, value_percent)
            insert_query = (
                "INSERT INTO StockValuationScores"
                "(DateTime, Symbol, ValueScore, AvgValueEstimate, ClosingPrice, ValuationDescription, ValuePercent)"
                "VALUES (%s, %s, %s, %s, %s, %s, %s)"
                )
            data_tuple = (
            current_datetime, symbol, score, avarage_value_estimate, last_closing_price, overvalued, value_percent)
            cursor.execute(insert_query, data_tuple)
            connection.commit()
            print("Success!!")

except Error as e:
    print("Error while connecting to MySQL", e)

finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()