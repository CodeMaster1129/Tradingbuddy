from crontab import CronTab

cron = CronTab(user=True)
job3 = cron.new(command='python /home/vip/Documents/workspace/trading-backend-new/insertDiscord.py')
job3.minute.every(3)
job4 = cron.new(command='python /home/vip/Documents/workspace/trading-backend-new/insertTelegram.py')
job4.minute.every(3)

cron.write()