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
accountId = os.getenv('ACCOUNT_ID') or 'db0efd01-1ff6-4bc3-8451-166c0164ea76'

async def test_meta_api_synchronization():
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

        # Remove existing records in the table
        cur = conn.cursor()
        cur.execute("DELETE FROM APImetaapiTradeOpenOrders")
        conn.commit()
        cur.close()

        # Get current positions and insert them into the table
        positions = await connection.get_positions()
        for position in positions:
            position['symbol'] = position['symbol'].split('.')[0]
            cur = conn.cursor()
            position['accountId'] = accountId  # Add the accountId field to the position data
            columns = ', '.join(position.keys())
            values = ', '.join(['%s'] * len(position))
            query = f"INSERT INTO APImetaapiTradeOpenOrders ({columns}) VALUES ({values})"
            cur.execute(query, list(position.values()))
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

# Run the code snippet repeatedly every 1 minute
# while True:
#     asyncio.run(test_meta_api_synchronization())
#     time.sleep(60)  # Sleep for 1 minute before running again

asyncio.run(test_meta_api_synchronization())