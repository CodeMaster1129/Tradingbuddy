from flask_cors import CORS
from flask import Flask, send_from_directory
from flask_mysqldb import MySQL
app = Flask(__name__, template_folder="../templates")


# CORS(app, origins='http://localhost:3000')
CORS(app, origins='http://www.tradingbuddytools.com')
# CORS(app)
#CORS(app, resources={r"/*": {"origins": "http://www.tradingbuddytools.com"}})
#CORS(app, resources={r"/*": {"origins": "http://www.tradingbuddytools.com/api"}})
CORS(app, origins="*", allow_headers="*")

app.config['MYSQL_HOST'] = 'tradingbuddy.cjwfktkwkbo1.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'RDStradingbuddydb0510!'
app.config['MYSQL_DB'] = 'trading'
mysql = MySQL(app)

app.config["APPLICATION_ROOT"] = "/api"