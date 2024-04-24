import os
import asyncio
from metaapi_cloud_sdk import MetaApi
from metaapi_cloud_sdk.clients.metaApi.tradeException import TradeException
from datetime import datetime, timedelta
import pymysql
import time

# Note: for information on how to use this example code please read https://metaapi.cloud/docs/client/usingCodeExamples

conn = pymysql.connect(
    host="tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com",
    user="admin",
    passwd="RDStradingbuddydb0510!",
    database="trading"
)

token = os.getenv('TOKEN') or 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4YmRmNTc0OTJkMjA3YzVjY2VjZTU2NzhlNTljZjA5YyIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6IjhiZGY1NzQ5MmQyMDdjNWNjZWNlNTY3OGU1OWNmMDljIiwiaWF0IjoxNjg4NTc1MDgzfQ.IIFwh4eO6xGqw2ppirrUGn_ji5LtWwLa17VFXwJdKs0LBxpXgpxAGquOUZlYcOd1bWpseFqztcQuwDEcFGA72iz4GztVC7BSwdpTqKhiHTRLT9zS9LvbJPi_dXr6mZLukpjcA_5LIX7SDC-IF8HlfaQGPDS_RqkwpDGIkcFS-h-o9KKdVtLW97nDS027-kq7Q5VlLUGgJWjw8xbFM-ROPTQExpTWTsGaQhmqx27sZtOF3UwMPIHK3KeATprxVameMwEXT9NjhqDNTGNCsj1cCla_thS0Ok_sarNaEJavrcHF7Ml5SrcFlq1a--XDhPpaPmT-cW-5BudlgbBLVxgrFoQu6RW1sMgYEnYywIJiJrd8v00JM8exMdXNywJP2gTgHreId8SscSz8oYrLlYPuhWY1brdVscjNAAsGGztgemzCBQBTIztwOrz6bE0eFD9YUInMeHrGL9u51jvIOLcIM6MBSfQCEXYSuvpkv-2MA9HOkwZQSeDqHI-9qJuRo97A9VU_qHfF05cKLI73hu2cwCAuiIbiNcvtY_WnaCr9ToarrXGc6Fb5fCosbQID3xiG57FueKTuAjIbDz6ccCUnZ9iglJZsosA5JpHMSgdVGu2Y8DC5bxcGq6zZSY1bFa2IcftVKipwnw4SMdB-dwezBb0yZyUkbLAodErz_4CmNkw'
accountId = 'db0efd01-1ff6-4bc3-8451-166c0164ea76'

async def test_meta_api_synchronization_History():
    api = MetaApi(token)
    try:
        account = await api.metatrader_account_api.get_account(accountId)
        initial_state = account.state
        deployed_states = ['DEPLOYING', 'DEPLOYED']

        if initial_state not in deployed_states:
            await account.deploy()
        await account.wait_connected()

        # connect to MetaApi API
        connection = account.get_rpc_connection()
        await connection.connect()
        await connection.wait_synchronized()

        # Get the maximum time value from your table
        cur = conn.cursor()
        cur.execute("SELECT MAX(time) FROM APImetaapiTradeHistoryDeals")
        max_time = cur.fetchone()[0]
        cur.close()

        # Calculate Start and End Dates
        if max_time:
            start_date = max_time + timedelta(seconds=1)  # Add one second to the maximum time
        else:
            # Set a default start date if the table is empty
            start_date = datetime.utcnow() - timedelta(days=7)  # One week ago from now

        end_date = start_date + timedelta(days=4)  # Add four days to the start date

        # Debug to terminal
        print("Max Time:", max_time)
        print("Start date:", start_date)
        print("End date:", end_date)

        # Get historic deals and insert them into the table
        history_deals = await connection.get_deals_by_time_range(start_date, end_date)

        # Add accountId to each deal in history_deals
        for deal in history_deals['deals']:
            deal['accountId'] = accountId

        # Retrieve field list from the database table
        cur = conn.cursor()
        cur.execute(f"SHOW COLUMNS FROM `APImetaapiTradeHistoryDeals`")
        field_list = [row[0] for row in cur.fetchall()]
        cur.close()

        for deal in history_deals['deals']:
            deal['symbol'] = deal['symbol'].split('.')[0]
            deal_fields = {key: value for key, value in deal.items() if key in field_list}
            cur = conn.cursor()
            columns = ', '.join(deal_fields.keys())
            values = ', '.join(['%s'] * len(deal_fields))
            query = f"INSERT INTO `APImetaapiTradeHistoryDeals` ({columns}) VALUES ({values})"
            cur.execute(query, list(deal_fields.values()))
            conn.commit()
            cur.close()

        if initial_state not in deployed_states:
            # undeploy account if it was undeployed
            print('Undeploying account')
            await connection.close()
            await account.undeploy()

    except Exception as err:
        print(api.format_error(err))
        exit()

# Run the code snippet repeatedly every 3 minutes
# while True:
#     asyncio.run(test_meta_api_synchronization())
#     time.sleep(180)  # Sleep for 3 minutes before running again
asyncio.run(test_meta_api_synchronization_History())