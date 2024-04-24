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
        timestamp = value['timestamp']
        content = value['content']
        username = value['author']['username']
        if "new trade" in content.lower():
            action = get_action(content)
            symbol = get_symbol(content)
            entry, stop, target = get_entry_stop_target(content)
            if action and symbol:
                insert_data(timestamp, username, channelid, content, action, symbol, entry, stop, target)

def get_action(content):
    if "sold" in content.lower() or "sell" in content.lower():
        return "SELL"
    elif "bought" in content.lower() or "buy" in content.lower():
        return "BUY"
    else:
        return None

def get_symbol(content):
    match = re.search(r'(\w{6}) \(New trade\)', content)
    if match:
        return match.group(1)
    return None

def get_entry_stop_target(content):
    entry = None
    stop = None
    target = 0.0
    
    entry_match = re.search(r'Entry:\s*([\d.]+)', content)
    if entry_match:
        entry = float(entry_match.group(1))
    
    stop_match = re.search(r'Stop:\s*([\d.]+)', content)
    if stop_match:
        stop = float(stop_match.group(1))
    
    target_match = re.search(r'Target:\s*([\d.]+|N/A)', content)
    if target_match:
        target_str = target_match.group(1).lower()
        if target_str != "n/a":
            target = float(target_str)
    
    return entry, stop, target

def insert_data(timestamp, username, channel_id, content, action, symbol, entry, stop, target):
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
                INSERT IGNORE INTO AlertsDiscord 
                (Timestamp, Username, ChannelID, Content, Action, Symbol, Entry, Stop, Target) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = (timestamp, username, channel_id, content, action, symbol, entry, stop, target)
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
            query = "SELECT ChannelID FROM sysAlertsConfig WHERE Service = 'Discord'"
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