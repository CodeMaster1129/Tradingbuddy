from flask_cors import CORS
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os

app = Flask(__name__, template_folder="../templates")

# Load environment variables from .env file
load_dotenv()

# CORS(app, origins='http://localhost:3000')
CORS(app, origins='http://www.tradingbuddytools.com')
# CORS(app)
#CORS(app, resources={r"/*": {"origins": "http://www.tradingbuddytools.com"}})
#CORS(app, resources={r"/*": {"origins": "http://www.tradingbuddytools.com/api"}})
CORS(app, origins="*", allow_headers="*")

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

app.config["APPLICATION_ROOT"] = os.getenv('APPLICATION_ROOT')