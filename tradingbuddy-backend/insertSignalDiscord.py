import requests
import json
import mysql.connector
from mysql.connector import Error
import re

def retrieve_messages(channelid):
    headers = {
        'authorization': 'OTUxMjQ2Njg1MTUyMDg4MDg0.GoYTYj.ttO0g_k3gFsDJMPVWEEnZNCEgD_yu817LdW_wo'  # Replace with your actual user token
   }
    r = requests.get(f'https://discord.com/api/v8/channels/{channelid}/messages', headers=headers)
    jsonn = json.loads(r.text)
    for value in jsonn:
        username = value['author']['username']
        timestamp = value['timestamp']
        if value['embeds']:
            title = value['embeds'][0]['title']
            fields = value['embeds'][0]['fields'][0]['value']
            footer = value['embeds'][0]['footer']['text']
            insert_data(timestamp, channelid, title, fields, footer, username)

def insert_data(timestamp, channelid, title, fields, footer, username):
    try:
        connection = mysql.connector.connect(
            host='tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com',
            port=3306,
            database='trading',
            user='admin',
            password='RDStradingbuddydb0510!'
        )

        if connection.is_connected():
            cursor = connection.cursor()
            insert_query = """
                INSERT IGNORE INTO SignalDiscord 
                (Timestamp, ChannelID, Title, Content, Footer, Username) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            data = (timestamp, channelid, title, fields, footer, username)
            cursor.execute(insert_query, data)
            connection.commit()
            if cursor.rowcount > 0:
                print("Record inserted successfully")
            else:
                print("Record already exists, skipping")
    except Error as e:
        print("Error:", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def main():
    try:

        connection = mysql.connector.connect(
            host='tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com',
            port=3306,
            database='trading',
            user='admin',
            password='RDStradingbuddydb0510!'
        )

        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT ChannelID FROM sysAlertsConfig WHERE Service = 'Discord' AND ChannelCategory = 'Edgefinder Smart Signals'"
            cursor.execute(query)
            channel_ids = [row[0] for row in cursor.fetchall()]
            for channel_id in channel_ids:
                retrieve_messages(channel_id)
            
            print("Messages retrieval and processing completed.")
    except Error as e:
        print("Error:", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    main()