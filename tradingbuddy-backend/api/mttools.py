from api.config import app, mysql
from flask import jsonify, request
from contextlib import contextmanager
# from flask_socketio import SocketIO, emit

import json
from datetime import datetime


# Setup a context manager for managing DB cursors
@contextmanager
def get_cursor():
    cursor = mysql.connection.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        mysql.connection.commit()


@app.route("/mttools/main", methods=["POST"])
def main():
    # try:
        with get_cursor() as cursor:
            filter_data = json.loads(request.form.get('filter'))
            # cursor = mysql.connection.cursor()
            ACCOUNT = filter_data['ACCOUNT']
            DATA = filter_data['DATA']
            SYMBOL = filter_data['SYMBOL']
            TimeRange = filter_data['TIME_RANGE']
            OPEN_DATE = datetime.strptime(filter_data['OPEN_DATE'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            CLOSED_DATE = datetime.strptime(filter_data['CLOSED_DATE'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            start_time = datetime.strptime(TimeRange[0], "%H:%M:%S").time()
            end_time = datetime.strptime(TimeRange[1], "%H:%M:%S").time()

            # print(filter_data['OPEN_DATE'], TimeRange[0])
            TYPE = ['Buy', 'Sell'] if filter_data['TYPE'] == 'All' else [filter_data['TYPE']]
            LEGS = ['Multi Leg', 'Single Leg'] if filter_data['LEGS'] == 'All' else [filter_data['LEGS']]
            type_placeholders = ','.join(['%s'] * len(TYPE))
            legs_placeholders = ','.join(['%s'] * len(LEGS))

            ##  Widget 2
            try:
                query = "SELECT Symbol, SUM(TotalProfit) FROM vwClosedOrdersSummary WHERE AccountID = %s AND LegType IN ({}) AND ActionType IN ({}) AND TIME(ClosedDateTime) >= %s AND TIME(ClosedDateTime) <= %s AND DATE(ClosedDateTime) >= %s AND DATE(ClosedDateTime) <= %s GROUP BY Symbol ORDER BY TotalProfit DESC".format(legs_placeholders, type_placeholders)
                parameters = (ACCOUNT, *LEGS, *TYPE, start_time, end_time, OPEN_DATE, CLOSED_DATE)
                cursor.execute(query, parameters)
                AggSPRes = cursor.fetchall()
            except Exception as e:
                print("mtools/main widget 2->Database connection failed due to {}".format(e))
                # return jsonify({"message": "Widget2 failed"})
        
            ##  Widet 3
            try:
                query = "select ClosedDateTime, TotalLegs, ActionType from vwClosedOrdersSummary WHERE AccountID = %s AND LegType IN ({}) AND Symbol = %s AND ActionType IN ({}) AND TIME(ClosedDateTime) >= %s AND TIME(ClosedDateTime) <= %s AND DATE(ClosedDateTime) >= %s AND DATE(ClosedDateTime) <= %s".format(legs_placeholders, type_placeholders)
                parameters = (ACCOUNT, *LEGS, SYMBOL, *TYPE, start_time, end_time, OPEN_DATE, CLOSED_DATE)
                cursor.execute(query, parameters)
                ChardRes = cursor.fetchall()
            except Exception as e:
                print("mtools/main widget 3->Database connection failed due to {}".format(e))
                # return jsonify({"message": "Widget 3 failed"})

            ##  Widget 9
            try:
                query = "select sum(MarginRequired) AS `Margin Required`, sum(MarginRequired) AS `Max Drawdown` from vwClosedOrdersSummary WHERE AccountID = %s AND Symbol = %s AND LegType IN ({}) AND TIME(ClosedDateTime) >= %s AND TIME(ClosedDateTime) <= %s AND DATE(ClosedDateTime) >= %s AND DATE(ClosedDateTime) <= %s".format(legs_placeholders)
                # query = "select sum(MarginRequired) AS `Margin Required`, sum(MarginRequired) AS `Max Drawdown` from vwClosedOrdersSummary WHERE AccountID = %s AND Symbol = %s AND LegType IN ({})".format(legs_placeholders)
                parameters = (ACCOUNT, SYMBOL, *LEGS, start_time, end_time, OPEN_DATE, CLOSED_DATE)
                # print(OPEN_DATE, CLOSED_DATE)
                # parameters = (ACCOUNT, SYMBOL, *LEGS)
                # print(query)
                # print(parameters)
                cursor.execute(query, parameters)
                # print(cursor.fetchall()[0])
                data = cursor.fetchall()
                if(data and len(data) >=1):
                    MM = data[0]
                    if(MM[0] == None or MM[1] == None):
                        MM = (0, 0)
                else:
                    MM = (0.0, 0.0)

                print(MM)
                # query = "select sum(TotalLots) AS `Total Multi Leg Lots`,sum(TotalUnits) AS `Total Multi Leg Units` from vwClosedOrdersSummary where (LegType = 'Multi Leg' AND AccountID = %s AND Symbol = %s AND TIME(ClosedDateTime) >= %s AND TIME(ClosedDateTime) <= %s AND DATE(ClosedDateTime) >= %s AND DATE(ClosedDateTime) <= %s) group by LegType"
                query = "select sum(TotalLots) AS `Total Multi Leg Lots`,sum(TotalUnits) AS `Total Multi Leg Units` from vwClosedOrdersSummary where (LegType = 'Multi Leg' AND AccountID = %s AND Symbol = %s) group by LegType"
                parameters = (ACCOUNT, SYMBOL)
                # print(parameters)
                cursor.execute(query, parameters)
                # print(cursor.fetchall())
                data = cursor.fetchall()
                if(data and len(data) >=1):
                    ML = data[0]
                else:
                    ML = (0.0, 0.0)
                print(ML)
                # query = "select sum(TotalLots) AS `Total Multi Leg Lots`,sum(TotalUnits) AS `Total Multi Leg Units` from vwClosedOrdersSummary where (LegType = 'Single Leg' AND AccountID = %s AND Symbol = %s AND TIME(ClosedDateTime) >= %s AND TIME(ClosedDateTime) <= %s AND DATE(ClosedDateTime) >= %s AND DATE(ClosedDateTime) <= %s) group by LegType"
                # parameters = (ACCOUNT, SYMBOL, start_time, end_time, OPEN_DATE, CLOSED_DATE)

                query = "select sum(TotalLots) AS `Total Multi Leg Lots`,sum(TotalUnits) AS `Total Multi Leg Units` from vwClosedOrdersSummary where (LegType = 'Single Leg' AND AccountID = %s AND Symbol = %s AND DATE(ClosedDateTime) >= %s AND DATE(ClosedDateTime) <= %s AND TIME(ClosedDateTime) >= %s AND TIME(ClosedDateTime) <= %s) group by LegType"
                parameters = (ACCOUNT, SYMBOL, OPEN_DATE, CLOSED_DATE, start_time, end_time)
                # print(parameters)
                cursor.execute(query, parameters)
                # print(cursor.fetchall())
                data = cursor.fetchall()
                if(data and len(data) >= 1):
                    MS = data[0]
                else:
                    MS = (0.0, 0.0)
                print(MS)
                overview = {'Margin Required:': round(float(MM[0]), 2), 'Max DrawDown:': round(float(MM[1]), 2), 'Total Multi Leg Lots Traded:': round(float(ML[0]), 2), 'Total Multi Leg Units Traded:': ML[1], 'Total Single Leg Lots Traded:': round(float(MS[0]), 2), 'Total Single Leg Units Traded:': MS[1] }
            except Exception as e:
                print("mtools/main widget 9->Database connection failed due to {}".format(e))
                return jsonify({"message": "signin failed"})
            result = {'SP': AggSPRes, 'overview': overview, 'ChartRES': ChardRes}
            # result = {'data': 'hello'}
            return result
    # except Exception as e:
    #     print("mtools/main->Database connection failed due to {}".format(e))
    #     # return jsonify({"message": "signin failed"})
    
@app.route("/mttools/index", methods=["POST"])
def get_init():
    try:
        with get_cursor() as cursor:
            ##  Widget 1
            cursor.execute("SELECT * FROM vwWidgetFxMTDCA01")
            AggSLRes = cursor.fetchall()

            # cursor = mysql.connection.cursor()
            data = []
            account = []
            leg = []
            symbol = []
            type = []
            
            cursor.execute("SELECT Name FROM syslistDataLevels")
            data_items = cursor.fetchall()
            for item in data_items:
                data.append(item[0])
                
            cursor.execute("SELECT TradeAcctID FROM TradeAccount")
            accounts = cursor.fetchall()
            for item in accounts:
                account.append(item[0])
                
            cursor.execute("SELECT Name FROM syslistLegTypes")
            legs = cursor.fetchall()
            for item in legs:
                leg.append(item[0])

            cursor.execute("SELECT Symbol FROM syslistSymbols WHERE Market = 'Forex'")
            symbols = cursor.fetchall()
            for item in symbols:
                symbol.append(item[0])

            cursor.execute("SELECT ActionName FROM syslistActionTypes")
            actions = cursor.fetchall()
            for item in actions:
                type.append(item[0])
            result = {'COMBO':{'DATA': data, 'ACCOUNT': account, 'LEGS': leg, 'SYMBOL': symbol, 'TYPE': type}, 'SL': AggSLRes}
            return result
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "signin failed"})
    

@app.route("/mttools/getwidget4data", methods=["GET"])
def getwidget4data():
    try:
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwWidgetFxMTDCA04")
            widget4 = cursor.fetchall()
            
            result = {'widget4': widget4}
            return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})


# def start_getwidget4data_task():
#     task = getwidget4data.delay()  # Starts the task asynchronously
#     return jsonify({"task_id": task.id}), 202



@app.route("/mttools/getwidget5data", methods=["GET"])
def getwidget5data():
    try:
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwWidgetFxMTDCA05")
            widget5 = cursor.fetchall()
            
            result = {'widget5': widget5}
            return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})

@app.route("/mttools/getwidget6data", methods=["GET"])
def getwidget6data():
    try:
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwWidgetFxMTDCA04")
            widget6 = cursor.fetchall()
            
            result = {'widget6': widget6}
            return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})

@app.route("/mttools/getwidget7data", methods=["GET"])
def getwidget7data():
    try:
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwWidgetFxMTDCA04")
            widget7 = cursor.fetchall()
            
            result = {'widget7': widget7}
            return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})

@app.route("/mttools/getwidget8data", methods=["GET"])
def getwidget8data():
    try:
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM vwWidgetFxMTDCA08")
            widget8 = cursor.fetchall()
            
            result = {'widget8': widget8}
            return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})
    
@app.route("/mttools/gettime", methods=["GET"])
def gettime():
    try:
        with get_cursor() as cursor:
            # cursor = mysql.connection.cursor()
            cursor.execute("SELECT time FROM APImetaapiTradeHistoryDeals ORDER BY time DESC LIMIT 1")
            timedata = cursor.fetchall()
            
            result = {'timedata': timedata}
            return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})