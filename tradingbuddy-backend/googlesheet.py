from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import mysql.connector
# from datetime import date
from datetime import datetime, timedelta

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

credentials = Credentials.from_service_account_file('credentials.json')
service = build('sheets', 'v4', credentials=credentials)
spreadsheet_id = '1TO9SVko2_d4z9Dzdmeo_T6LSfw_NNIgUMCyoCOqN7BQ'
range_names = ['A2:F14195']
try:
    request = service.spreadsheets().values().batchGet(spreadsheetId=spreadsheet_id, ranges=range_names)
    response = request.execute()
    googleSheetData = response['valueRanges'][0]['values']

    current_date = datetime.now()
    previous_day = current_date - timedelta(days=1)
    formatted_previous_day = previous_day.strftime("%-m/%-d/%Y")

    print(formatted_previous_day)
    if len(googleSheetData) != 0:
        for data in googleSheetData:
            if(data[0] == formatted_previous_day):
                print("currentData", data)
                if len(data) == 6:
                    date = data[0]
                    symbol = data[5]
                    score = data[2]
                    price = data[3]
                    print(date, symbol, score, price) 
                    insert_query = (
                    "INSERT INTO Escore"
                    "(Symbol, Date, Price, Score)"
                    "VALUES (%s, %s, %s, %s)"
                    )
                    data_tuple = (
                    symbol, date, price, score)
                    cursor.execute(insert_query, data_tuple)
                    connection.commit()
                    print("success")
                else:
                    print("Data in Google Sheets is not in the expected format")
    else:
        print("No Data in GoogleSheet")
except Exception as e:
    print("sheet_execute:", e)

cursor.close()
connection.close()
