import mysql.connector
import configparser
from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
from telethon.tl.types import PeerChannel

import json

# Reading Configs
config = configparser.ConfigParser()
config.read("config.ini")

# Setting configuration values
api_id = config['Telegram']['api_id']
api_hash = config['Telegram']['api_hash']
phone = config['Telegram']['phone']
username = config['Telegram']['username']

# Database configuration
db_user = 'admin'
db_password = 'RDStradingbuddydb0510!'
db_host = 'tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com'
db_database = 'trading'

DRY_RUN = False
FILTER_CHANNELS = True
FILTERED_CHANNEL_IDS = [1629543083]

# Establish database connection
connection = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_database
)
cursor = connection.cursor()

# Create the client and connect
client = TelegramClient(username, api_id, api_hash)

async def process_message(message):
    message_dict = message.to_dict()
    message_id = message_dict['id']
    channel_id = message_dict['peer_id']['channel_id']
    timestamp = message_dict['date']
    content = message_dict['message']

    # print("Processing message:")
    # print(content)

    try:
        # Define the insert_query here
        insert_query = (
            "INSERT INTO AlertsTelegram"
            "(ID, ChannelID, Timestamp, Content) "
            "VALUES (%s, %s, %s, %s)"
        )

        # Insert data into the database
        data_tuple = (
            message_id, channel_id, timestamp, content
        )
        cursor.execute(insert_query, data_tuple)
        # connection.commit()

        print("Inserted message:", message_id)
    except Exception as e:
        print("Error while inserting:", e)

def hasMessageKeywords(message, keywordArr):
    for keyword in keywordArr:
        if keyword in message: return True
    return False

async def processChannel(channel_id, last_message_id, keywordArr):
    entity = PeerChannel(channel_id)
    my_channel = await client.get_entity(entity)

    LIMIT = 100
    min_id = last_message_id
    offset_id = 0

    while offset_id == 0 or offset_id > min_id:
        history = await client(GetHistoryRequest(
            peer=my_channel,
            offset_id=offset_id,
            offset_date=None,
            add_offset=0,
            limit=LIMIT,
            max_id=0,
            min_id=min_id,
            hash=0
        ))

        messages = history.messages
        message_count = len(messages)
        print('Message count: ', message_count)
        if (message_count <= 0): break

        for message in messages:
            if message.message != None and hasMessageKeywords(message.message.lower(), keywordArr):
                if DRY_RUN != True:
                    await process_message(message)
                print('message processed: ', message.id)

        if offset_id == 0:
            last_message_id = messages[0].id       
        offset_id = messages[message_count - 1].id
    
    return last_message_id

async def main(phone):
    await client.start()
    print("Client Created")
    try:
        cursor.execute("SELECT ChannelID, LastMessageId, inMessagewords FROM sysAlertsConfig WHERE Service = 'Telegram'")
        channels = cursor.fetchall()

        for channel in channels:
            channelId = int(channel[0]) if channel[0] != None else 0  # Assuming channel is a tuple and ChannelID is the first element

            if DRY_RUN == True and channelId not in FILTERED_CHANNEL_IDS: continue

            LastMessageId = (int(channel[1]) if channel[1] != None else 0) if DRY_RUN != True else 0
            keywords = channel[2]

            keywordArr = [keyword.strip('" ') for keyword in keywords.lower().split(',')] if keywords != None else []

            print('Scraping channel, ', channelId, LastMessageId, keywordArr)

            LastMessageId = await processChannel(channelId, LastMessageId, keywordArr)

            if DRY_RUN != True:
                sqlUpdate = "UPDATE `sysAlertsConfig` SET `LastMessageId` = %s WHERE `ChannelID` = %s"
                cursor.execute(sqlUpdate, (LastMessageId, channelId))

        connection.commit()  # Commit the transaction
    finally:
        await client.disconnect()  # Disconnect the client


with client:
    client.loop.run_until_complete(main(phone))
    cursor.close()
    connection.close()