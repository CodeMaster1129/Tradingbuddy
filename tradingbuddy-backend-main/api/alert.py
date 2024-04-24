from api.config import app, mysql
from flask import jsonify, request
import json
from datetime import datetime

@app.route("/alert/getdiscorddata", methods=["GET"])
def getdiscorddata():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT Timestamp, ChannelID, Content, Username FROM AlertsDiscord")
        discorddata = cursor.fetchall()
        
        result = {'discorddata': discorddata}
        return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})
    
@app.route("/alert/getalertdiscorddata", methods=["GET"])
def getalertdiscorddata():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT Timestamp, ChannelID, Content, Username FROM AlertsDiscord WHERE ChannelID = '1167572324833300643' OR ChannelID = '1167575612915978260' OR ChannelID = '1167573722513801276' OR ChannelID = '1167575690607087616' ")
        discorddata = cursor.fetchall()
        
        result = {'discorddata': discorddata}
        return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})
        
@app.route("/alert/getsignaldiscorddata", methods=["GET"])
def getsignaldiscorddata():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT Timestamp, ChannelID, Title, Content, Footer, Username FROM SignalDiscord WHERE ChannelID = '1154092424063369287' OR ChannelID = '1155952272635863192' OR ChannelID = '1171526270815846400' OR ChannelID = '1155952827777163435' ")
        discorddata = cursor.fetchall()
        
        result = {'discorddata': discorddata}
        return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})
    
@app.route("/alert/gettelegramdata", methods=["GET"])
def gettelegramdata():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT Timestamp, ChannelID, Content FROM AlertsTelegram")
        telegramdata = cursor.fetchall()
        
        result = {'telegramdata': telegramdata}
        return result
    
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "connecttion failed!!!"})