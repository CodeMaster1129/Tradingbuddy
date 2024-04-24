from flask import Flask, jsonify, render_template
import pymysql
import json
from flask import request
import os
from api.config import app, mysql

@app.route('/trade/trade-open-orders', methods=['GET'])
def get_open_orders():
    try:
        # Create a cursor to execute the query
        cursor = mysql.connection.cursor()

        # Fetch open orders data from the database
        query = "SELECT * FROM vwOpenOrdersDetail"
        cursor.execute(query)
        result = cursor.fetchall()

        # Prepare column names
        columns = [
            "AcctID",
            "AcctName",
            "AcctType",
            "Platform",
            "OrderID",
            "OrderStatus",
            "OrderType",
            "EntryType",
            "Symbol",
            "OrderDateTime",
            "Price",
            "Qty",
            "TP",
            "Profit"
        ]

        # Convert data to list of dictionaries
        open_orders_data = [dict(zip(columns, row)) for row in result]
        # json_data = {'user': open_orders_data}

        cursor.close()  # Close the cursor
        json_data = json.dumps(
            open_orders_data, ensure_ascii=False, default=str)
        return jsonify({
            "columns": columns,
            "data": json_data,
        }), 200
    except Exception as e:
        print(str(e)+"eeeeeeeeeeee")


@app.route('/trade/trade-open-orders-summary', methods=['GET'])
def get_open_orders_summary():
    try:
        # Create a cursor to execute the query
        cursor = mysql.connection.cursor()

        # Fetch open orders data from the database
        query = "SELECT * FROM vwOpenOrdersSummary"
        cursor.execute(query)
        result = cursor.fetchall()

        # Prepare column names
        columns = [
            "AcctID",
            "AcctName",
            "AcctType",
            "platform",
            "AcctLeverage",
            "LeveragePercent",
            "Symbol",
            "Status",
            "FirstOrderID",
            "ActionType",
            "OpenEntryType",
            "FirstOpenDateTime",
            "LastOrderID",
            "ClosedType",
            "ClosedEntryType",
            "ClosedDateTime",
            "TotalLegs",
            "LegType",
            "TotalOrders",
            "TotalPositions",
            "TotalLots",
            "AvgEntryPrice",
            "SL",
            "TP",
            "AvgClosedPrice",
            "TotalCommission",
            "TotalSwap",
            "TotalProfit",
            "TotalUnits",
            "TotalCurreny",
            "MarginRequired",
            "Duration"
        ]

        # Convert data to list of dictionaries
        open_orders_summary = [dict(zip(columns, row)) for row in result]
        # json_data = {'user': open_orders_data}

        cursor.close()  # Close the cursor
        json_data = json.dumps(
            open_orders_summary, ensure_ascii=False, default=str)
        return jsonify({
            "columns": columns,
            "data": json_data,
        }), 200
    except Exception as e:
        print(str(e)+"eeeeeeeeeeee")


@app.route('/closed-orders')
def show_closed_orders():
    return render_template('closedorderstable.html')


@app.route('/trade/trade-closed-orders', methods=['GET'])
def get_closed_orders():
    # Create a cursor to execute the query
    try:

        cursor = mysql.connection.cursor()

        # Fetch open orders data from the database
        query = "SELECT * FROM vwAPImetaapiClosedOrdersDetail"
        cursor.execute(query)
        result = cursor.fetchall()

        # Prepare column names
        columns = [
            "AcctID",
            "AcctName",
            "AcctType",
            "Platform",
            "OrderID",
            "OrderStatus",
            "EntryType",
            "OrderType",
            "Symbol",
            "OrderDateTime",
            "Price",
            "Qty",
            "TP",
            "Profit",
        ]

        # Convert data to list of dictionaries
        closed_orders_data = [dict(zip(columns, row)) for row in result]

        cursor.close()  # Close the cursor

        json_data = json.dumps(
            closed_orders_data, ensure_ascii=False, default=str)

        return jsonify({
            "columns": columns,
            "data": json_data,
        })
    except Exception as e:
        print(str(e)+"eeeeeeeeeeee")


@app.route('/trade/trade-closed-orders-summary', methods=['GET'])
def get_closed_orders_summary():
    # Create a cursor to execute the query
    try:
        cursor = mysql.connection.cursor()

        # Fetch open orders data from the database
        query = "SELECT * FROM vwAPImetaapiClosedOrdersSummary"
        cursor.execute(query)
        result = cursor.fetchall()

        # Prepare column names
        columns = [
            "AcctID",
            "AcctName",
            "AcctType",
            "Platform",
            "AcctLeverage",
            "LeveragePercent",
            "Symbol",
            "Status",
            "FirstOrderID",
            "ActionType",
            "OpenEntryType",
            "FirstOpenDateTime",
            "LastOrderID",
            "ClosedType",
            "ClosedEntryType",
            "ClosedDateTime",
            "TotalLegs",
            "LegType",
            "TotalOrders",
            "TotalPositions",
            "TotalLots",
            "AvgEntryPrice",
            "SL",
            "TP",
            "AvgClosedPrice",
            "TotalCommission",
            "TotalSwap",
            "TotalProfit",
            "TotalPips",
            "PipValue",
            "TotalUnits",
            "TotalCurrency",
            "MarginRequired",
            "Duration",
            "yearFirstLegOpened",
            "monthFirstLegOpened",
            "weekFirstLegOpened",
            "dayofmonthFirstLegOpened",
            "weekdayFirstLegOpened",
            "hourFirstLegOpened"
        ]

        # Convert data to list of dictionaries
        closed_orders_summary_data = [
            dict(zip(columns, row)) for row in result]

        cursor.close()  # Close the cursor

        json_data = json.dumps(
            closed_orders_summary_data, ensure_ascii=False, default=str)

        return jsonify({
            "columns": columns,
            "data": json_data,
        })
    except Exception as e:
        print(str(e)+"eeeeeeeeeeee")
