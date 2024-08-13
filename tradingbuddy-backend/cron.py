from crontab import CronTab

cron = CronTab(user=True)

job1 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/importOpenPositions.py')
job1.minute.every(10)
job2 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/importDealsHistory.py')
job2.minute.every(10)
job3 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/scrapingIrregularActivity.py')
job3.minute.every(20)
job4 = cron.new(command='/home/ubuntu/tradingbuddy-backend/venv/bin/python3 /home/ubuntu/tradingbuddy-backend/scrapingLiveOption.py')
job4.minute.every(10)
job5 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/insertSignalDiscord.py')
job5.minute.every(10)
# job6 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/scrapingTradersconnect.py')
# job6.hour.every(2)
job7 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/insertDiscord.py')
job7.minute.every(10)
# job8 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/googlesheet.py')
# job8.hour.every(4)
job9 = cron.new(command='python3 /home/ubuntu/tradingbuddy-backend/insertTelegram.py')
job9.minute.every(10)

cron.write()