from flask import request, jsonify
import os
# import mysql.connector
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
# from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from api.config import app, mysql
from contextlib import contextmanager
# import pymysql
import json
from decimal import Decimal
from datetime import date
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def decimal_to_float(data):
    if isinstance(data, Decimal):
        return float(data)
    else:
        return data

# Database connection
# Setup a context manager for managing DB cursors
@contextmanager
def get_cursor():
    cursor = mysql.connection.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        mysql.connection.commit()


@app.route("/activity/getsplithistory", methods=["POST"])
def get_splithistory():
    if (
        request.method == "POST"
        and "symbol" in request.form
    ):
        symbol = request.form["symbol"]
        url = f'https://www.stocksplithistory.com/?symbol={symbol}'
        print(url)
        options =  webdriver.ChromeOptions()
        options.add_argument("--disable-extensions")
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-application-cache')
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-setuid-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        options.add_argument("--headless")

        s=Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=s, options=options)
        print('Scraping start---')
        driver.get(url)
        table_element = driver.find_element(By.XPATH, '/html/body/center/div[4]/table[2]/tbody/tr/td[6]/table[1]')
        print(table_element)
        rows = table_element.find_elements(By.XPATH,'.//tbody/tr')
        rawArray= []
        i=0
        for row in rows:
            if i > 1:
                cells = row.find_elements(By.XPATH, './/td')
            else:
                i+=1
                continue
            j=0
            for cell in cells:
                rawArray.append(cell.text)
        print(rawArray)


        # split the even and odd values into separate lists
        even = []
        odd = []
        for i in range(len(rawArray)):
            if i % 2 == 0:
                even.append(rawArray[i])
            else:
                odd.append(rawArray[i])
        splitHistory = []
        for i in range(len(even)):
            obj = {"Date": even[i], "Ratio": odd[i]}
            splitHistory.append(obj)

        print('Scraping done')

        return json.dumps(splitHistory)

@app.route("/activity/getPrometheusRating", methods=["POST"])
def getPrometheusRating():
    if (request.method == "POST" and "symbol" in request.form):
        symbol = request.form["symbol"]
        sqlRead = "SELECT * FROM Pscore WHERE symbol = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlRead, (symbol,))
                datas = cursor.fetchall()
                sorted_data = sorted(datas, key=lambda x: x[0], reverse = True)
                results = []
                flags = []
                for x in sorted_data:
                    if x[0].strftime("%w") == "1":
                        results.append(x[2])
                        flags.append(1)
                        break
                if(len(flags) != 1):
                    results.append(0)
                    flags.append(1)
                for x in sorted_data:
                    if x[0].strftime("%w") == "2":
                        results.append(x[2])
                        flags.append(1)
                        break
                if(len(flags) < 2):
                    results.append(0)
                    flags.append(1)
                for x in sorted_data:
                    if x[0].strftime("%w") == "3":
                        results.append(x[2])
                        flags.append(1)
                        break
                if(len(flags) < 3):
                    results.append(0)
                    flags.append(1)
                for x in sorted_data:
                    if x[0].strftime("%w") == "4":
                        results.append(x[2])
                        flags.append(1)
                        break
                if(len(flags) < 4):
                    results.append(0)
                    flags.append(1)
                for x in sorted_data:
                    if x[0].strftime("%w") == "5":
                        results.append(x[2])
                        flags.append(1)
                        break
                if(len(flags) < 5):
                    results.append(0)
                    flags.append(1)
                return jsonify({'results': results})
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Database Error"})
    return jsonify({'message': 'failed'})

@app.route("/activity/technicalguage", methods=["POST"])
def technicalguage():
    if (
        request.method == "POST"
        and "symbol" in request.form
    ):
        symbol = request.form["symbol"]
        sqlRead = "SELECT * FROM syslistSymbols WHERE symbol = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlRead, (symbol,))
                results = cursor.fetchall()
                if len(results) == 0:
                    data = {
                    "broker" : "NASDAQ"
                    }
                    return jsonify({"data":data, "message": "error"})
                elif results:
                    symbolData = results[0]
                    sym = symbolData[0]
                    broker = symbolData[2]
                    data = {
                        "symbol": sym,
                        "broker": broker
                    }
                    return jsonify({"data":data, "message": "success"})
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "failed"})

@app.route("/activity/fetch_info", methods=["GET"])
def fetch_info():
    try:
        with get_cursor() as cursor:
            query = "SELECT infodescription, infovalue FROM vwWidgetInfo01"
            cursor.execute(query)
            info_data = cursor.fetchall()

        info_list = [{"infodescription": desc, "infovalue": value} for desc, value in info_data]

        return jsonify(info_list)
        # return jsonify({"data": "hello"})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/activity/getuser', methods=['GET'])
def get_user():
    try:
        # Create a cursor to execute the query
        with get_cursor() as cursor:
        # cursor = mysql.connection.cursor()

        # Fetch open orders data from the database
            query = "SELECT * FROM Users"
            cursor.execute(query)
            result = cursor.fetchall()

            # Prepare column names
            columns = [
                "id",
                "email",
                "firstName",
                "lastName",
                "password",
                "status",
                "createAt",
                "updateAt"
            ]

            # Convert data to list of dictionaries
            users_data = [dict(zip(columns, row)) for row in result]
            # json_data = {'user': open_orders_data}

            # cursor.close()  # Close the cursor
            json_data = json.dumps(
                users_data, ensure_ascii=False, default=str)
            return jsonify({
                "columns": columns,
                "data": json_data,
            }), 200
    except Exception as e:
        print(str(e)+"eeeeeeeeeeee")

@app.route('/activity/setapprove', methods=['POST'])
def setapprove():
    if (
        request.method == "POST"
        and "email" in request.form
    ):
        email = request.form["email"]
        sqlRead = "SELECT * FROM Users WHERE email = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlRead, (email,))
                results = cursor.fetchall()
                if len(results) > 1:
                    return jsonify({"message": "Double users"})
                elif len(results) == 0:
                    return jsonify({"message": "User not exist"})
                elif results:
                    userData = results[0]
                    status = userData[5]
                    if status == 0:
                        sqlUpdate = "UPDATE `Users` SET `status` = %s WHERE `email` = %s"
                        cursor.execute(
                            sqlUpdate,
                            (
                                1,
                                email
                            ),
                        )
                        mysql.connection.commit()
                        return jsonify({"message": "Approve success"})
                    # cursor.close()
        except Exception as e:
            print(e)
            return jsonify({"message": "Server Error"})
    else:
        return jsonify({"message": "Missing fields"})
    
    return jsonify({"message": "Authorized Users"})  # Add this line

@app.route('/activity/getsymbolid', methods=['POST'])
def getsymbolid():
    if (
        request.method == "POST"
        and "symbol" in request.form
    ):
        symbol = request.form["symbol"]
        sqlRead = "SELECT ID FROM APIfcsapiSymbolList WHERE SymbolAlt = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlRead, (symbol,))
                results = cursor.fetchall()
        except Exception as e:
            return jsonify({"message": "failed"})
        
        if results:  # Check if the results tuple is not empty
            return jsonify({"data": results[0], "message": "success"})
        else:
            return jsonify({"message": "No results found"})
    else:
        return jsonify({"message": "Sever Error"})
    
@app.route('/activity/savelayouts', methods=['POST'])
def savelayouts():
    if (
        request.method == "POST"
        and "email" in request.form
        and "layouts" in request.form
        and "layoutname" in request.form
    ):
        email = request.form["email"]
        layouts = request.form["layouts"]
        layoutname = request.form["layoutname"]
        try:
            sqlRegister = "INSERT INTO `UserDashboardLayoutSpec` (`useremail`, `Layouts`, `DashLayoutDesc`) VALUES (%s, %s, %s)"
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(
                    sqlRegister,
                    (
                        email,
                        layouts,
                        layoutname
                    ),
                )
                # mysql.connection.commit()
                cursor.execute("SELECT * FROM `UserDashboardLayoutSpec` WHERE useremail = %s || useremail = 'All'", (email,))
                results = cursor.fetchall()
                if len(results) == 0:
                    return jsonify({"message": "Layout Data not exist"})
                else:
                    layouts = []
                    for row in results:
                        layout_data = {
                            "id": row[1],
                            "useremail": row[0],
                            "layouts": row[3],
                            "layoutname":row[2]
                        }
                        layouts.append(layout_data)
                return jsonify({"message": "Layout Saved!", "data":layouts})
        except Exception as e:
            print(e)
            return jsonify({"message": "Server Error"})
    else:
        return jsonify({"message": "Missing fields"})

@app.route('/activity/getlayouts', methods=['POST'])
def getlayouts():
    if (
        request.method == "POST"
        and "email" in request.form
    ):
        email = request.form["email"]
        sqlRead = "SELECT * FROM UserDashboardLayoutSpec WHERE useremail = %s || useremail = 'All'"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlRead, (email,))
                results = cursor.fetchall()
                if len(results) == 0:
                    return jsonify({"message": "Layout Data not exist"})
                else:
                    layouts = []
                    for row in results:
                        layout_data = {
                            "id": row[1],
                            "useremail": row[0],
                            "layouts": row[3],
                            "layoutname":row[2]
                        }
                        layouts.append(layout_data)
                    return jsonify({"layouts": layouts, "message": "success"})    
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"})
    else:
        return jsonify({"message": "Missing fields"})
        
@app.route('/activity/deletelayout', methods=['POST'])
def deletelayout():
    if request.method == 'POST' and 'id' in request.form:
        id = request.form['id']
        sqlDelete = "DELETE FROM UserDashboardLayoutSpec WHERE DashLayoutID = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlDelete, (id,))
                mysql.connection.commit()
                return jsonify({"message": "success"})
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"})
    else:
        return jsonify({"message": "Missing fields"})

@app.route('/activity/gettradingviewurl', methods=['POST'])
def gettradingviewurl():
    if request.method == 'POST' and 'symbol' in request.form:
        symbol = request.form['symbol']
        sqlSELECT = "SELECT TradingViewChartLink FROM sysTradingViewChartLinks WHERE Symbol = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (symbol,))
                results = cursor.fetchall()
                if len(results) == 0:
                    return jsonify({"message": "TradingViewChartLinks not exist"}), 404
                else:
                    return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getirregularactivity', methods=['POST'])
def getirregularactivity():
    if request.method == 'POST' and 'tab' in request.form:
        tab = request.form['tab']
        sqlSELECT = "SELECT * FROM TAIrregularActivity WHERE Category = %s"
        try:
            with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (tab,))
                results = cursor.fetchall()
                if len(results) == 0:
                    return jsonify({"message": "No Data"}), 200
                else:
                    return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getirregularactivity_symbol', methods=['POST'])
def getirregularactivity_symbol():
    if request.method == 'POST' and 'symbol' in request.form:
        symbol = request.form['symbol']
        sqlSELECT = "SELECT * FROM TAIrregularActivity WHERE Ticker = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (symbol,))
                results = cursor.fetchall()

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getLiveOptions_symbol', methods=['POST'])
def getLiveOptions_symbol():
    if request.method == 'POST' and 'symbol' in request.form:
        symbol = request.form['symbol']
        sqlSELECT = "SELECT * FROM TALiveOptions WHERE Ticker = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (symbol,))
                results = cursor.fetchall()

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getirregularactivity_search', methods=['POST'])
def getirregularactivity_search():
    if (
        request.method == 'POST'
        and 'search' in request.form
        and 'category' in request.form
    ):
        search = request.form['search']
        category = request.form['category']
        sqlSELECT = "SELECT * FROM TAIrregularActivity WHERE Category = %s AND Ticker = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (category, search,))
                results = cursor.fetchall()

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400

@app.route('/activity/getliveoptions_search', methods=['POST'])
def getliveoptions_search():
    if (
        request.method == 'POST'
        and 'search' in request.form
    ):
        search = request.form['search']
        sqlSELECT = "SELECT * FROM TALiveOptions WHERE DateTime LIKE %s OR Ticker LIKE %s OR ExpiryDate Like %s OR Strike Like %s OR OptionType Like %s OR Spot Like %s OR Bid Like %s OR Details Like %s OR Ask Like %s OR OrderType Like %s OR Premium Like %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, ( '%'+search + '%', '%'+search + '%', '%'+search + '%','%'+search + '%','%'+search + '%','%'+search + '%', '%'+search + '%', '%'+search + '%', '%'+search + '%', '%'+search + '%', '%'+search + '%',))
                results = cursor.fetchall()

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400   
    
@app.route('/activity/getLiveOptionData', methods=['GET'])
def getLiveOptionData():
    if (
        request.method == 'GET'  
    ):
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM TALiveOptions")
            results = cursor.fetchall()
            if len(results) == 0:
                return jsonify({"message":"No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400

@app.route('/activity/getTradersConnectData', methods=['GET'])
def getTradersConnectData():
    if request.method == 'GET':
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwPropAccountSummary")
            raw_results = cursor.fetchall()
            column_names = [column[0] for column in cursor.description]
            results = [{key: decimal_to_float(value) for key, value in dict(zip(column_names, row)).items()} for row in raw_results]
            
            if len(results) == 0:
                return jsonify({"message": "No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getirregularactivitydata', methods=['GET'])
def getirregularactivitydata():
    if request.method == 'GET':
        sqlSELECT = "SELECT * FROM TAIrregularActivity"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT)
                results = cursor.fetchall()
                if len(results) == 0:
                    return jsonify({"message": "No Data"}), 200
                else:
                    return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getTraderConnect_account', methods=['POST'])
def getTraderConnect_account():
    if request.method == 'POST' and 'account' in request.form:
        account = request.form['account']
        sqlSELECT = "SELECT * FROM vwPropAccountSummary WHERE Account LIKE %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, ('%' + account + '%',))
                raw_results = cursor.fetchall()
                column_names = [column[0] for column in cursor.description]
                results = [{key: decimal_to_float(value) for key, value in dict(zip(column_names, row)).items()} for row in raw_results]

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getPscore_symbol', methods=['POST'])
def getPscore_symbol():
    if request.method == 'POST' and 'symbol' in request.form:
        symbol = request.form['symbol']
        sqlSELECT = "SELECT * FROM Pscore WHERE symbol = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (symbol,))
                results = cursor.fetchall()

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400

@app.route("/activity/getEscore_symbol", methods=["POST"])
def getEscore_symbol():
    if request.method == "POST" and "symbol" in request.form:
        symbol = request.form["symbol"]
        sqlSELECT = "SELECT * FROM Escore WHERE Symbol = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (symbol,))
                results = cursor.fetchall()

                # Fetch column names
                columns = [desc[0] for desc in cursor.description]

                # Create dictionaries for each row
                results = [
                    dict(zip(columns, row))
                    for row in results
                ]

                # Convert Decimal values to string
                results = [
                    {key: str(value) if isinstance(value, Decimal) else value for key, value in row.items()}
                    for row in results
                ]

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400
  
@app.route("/activity/getvwFxBotBuddyResultsGold", methods=["GET"])
def getvwFxBotBuddyResultsGold():
    if request.method == "GET":
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwFxBotBuddyResultsGold")
            results = cursor.fetchall()
            if len(results) == 0:
                return jsonify({"message": "No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route("/activity/getvwFxBotBuddyResultsOil", methods=["GET"])
def getvwFxBotBuddyResultsOil():
    if request.method == "GET":
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwFxBotBuddyResultsOil")
            results = cursor.fetchall()
            if len(results) == 0:
                return jsonify({"message": "No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route("/activity/getvwFxBotBuddyResultsForex", methods=["GET"])
def getvwFxBotBuddyResultsForex():
    if request.method == "GET":
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwFxBotBuddyResultsForex")
            raw_results = cursor.fetchall()
            column_names = [column[0] for column in cursor.description]
            results = [{key: decimal_to_float(value) for key, value in dict(zip(column_names, row)).items()} for row in raw_results]
            
            if len(results) == 0:
                return jsonify({"message": "No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route("/activity/setfeedback", methods=["POST"])
def setfeedback():
    if (
        request.method == "POST"
        and "email" in request.form
        and "feedbackReason" in request.form
        and "feedbackMethod" in request.form
        and "feedback" in request.form
    ):
        currentTime = date.today()
        email = request.form["email"]
        feedbackReason = request.form["feedbackReason"]
        feedbackMethod = request.form["feedbackMethod"]
        feedback = request.form["feedback"]
        s = smtplib.SMTP('smtp.gmail.com', 587)
        # start TLS for security
        s.starttls()
        # Authentication
        s.login("feedbacktingbuddy@gmail.com", "mbpgctyzzjjgkijr")
        # message to be sent
        body = f"email: {email}, Feedback Reason: {feedbackReason}, Feedback Method: {feedbackMethod}, Feedback: {feedback}"
        message = MIMEMultipart()
        message["From"] = "feedbacktingbuddy@gmail.com"
        message["To"] = "twakley@ingbuddy.com"
        message["Subject"] = "User Feedback"

        # Attach the email body to the MIMEMultipart object
        part = MIMEText(body, "plain")
        message.attach(part)
        print("Message:",message)
        # sending the mail
        s.sendmail("feedbacktingbuddy@gmail.com", "twakley@ingbuddy.com", message.as_string())
        # terminating the session
        s.quit()
        with get_cursor() as cursor:
            cursor = mysql.connection.cursor()
            sqlRegister = "INSERT INTO `infoFeedback` (`DateTime`,`email`, `ContactReason`, `PreferredReplyMethod`, `Content`) VALUES (%s,%s,%s,%s,%s)"
            cursor.execute(
                        sqlRegister,
                        (currentTime, email, feedbackReason, feedbackMethod, feedback),
                    )
            return jsonify({"message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400

@app.route("/activity/topUndervaluedScores", methods=["GET"])
def topUndervaluedScores():
    if request.method == "GET":
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT Symbol, ValueScore, ValuePercent FROM StockValuationScores WHERE ValuationDescription = 'Undervalued' ORDER BY CAST(ValueScore AS unsigned) DESC LIMIT 15")
            results = cursor.fetchall()
            print("results:", results)
            if len(results) == 0:
                return jsonify({"message": "No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route("/activity/topOvervaluedScores", methods=["GET"])
def topOvervaluedScores():
    if request.method == "GET":
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT Symbol, ValueScore, ValuePercent FROM StockValuationScores WHERE ValuationDescription = 'Overvalued' ORDER BY CAST(ValueScore AS unsigned) ASC LIMIT 15")
            results = cursor.fetchall()
            print("results:", results)
            if len(results) == 0:
                return jsonify({"message": "No Data"}), 200
            return jsonify({"data": results, "message": "Success"}), 200
    else:
        return jsonify({"message": "Missing fields"}), 400
    
@app.route('/activity/getStockValuationScores_symbol', methods=['POST'])
def getStockValuationScores_symbol():
    if request.method == 'POST' and 'symbol' in request.form:
        symbol = request.form['symbol']
        sqlSELECT = "SELECT * FROM StockValuationScores WHERE Symbol = %s"
        try:
            with get_cursor() as cursor:
                # cursor = mysql.connection.cursor()
                cursor.execute(sqlSELECT, (symbol,))
                results = cursor.fetchall()

                return jsonify(results), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Server Error"}), 500
    else:
        return jsonify({"message": "Missing fields"}), 400