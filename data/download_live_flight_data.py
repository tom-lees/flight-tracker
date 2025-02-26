# 2024-09-26 TL
# Script requests flight data at the current time for the 6 aircraft in Aurigny's fleet.
# Data is requested from adsb fi.
# Data is saved to SQL db: aurigny_tracker.db.

# TODO add reference for adsb fi data useage.
# TODO switch between registration search and lat lon search if a response error arrises.
#  reg used ac, lat lon used aircraft
# TODO check json structure and if changes happen notify by email

from datetime import datetime
import json
import logging
import requests
import sqlite3
import sys

logging.basicConfig(
    filename= "aurigny_tracker.log", 
    format = "%(asctime)s  %(levelname)s  %(message)s",
    encoding="utf-8",
    level=logging.INFO)

logger = logging.getLogger(__name__)


#
#   API data download
#

# url = "https://opendata.adsb.fi/api/v2/lat/52.1949308/lon/-0.8910159/dist/100"
url = "https://opendata.adsb.fi/api/v2/registration/G-OATR,G-OGFC,G-ORAI,G-PEMB,G-ETAC,G-OAUR"

logger.info("Fetching data from URL")
response = requests.get(url)

if response.status_code != 200: 
    logger.error("Failed to fetch data. Status code: %s    URL: %s", response.status_code, url)
    sys.exit()

logger.info("Data fetched successfully")

try:
    data = response.json()
except ValueError:
    logger.error("Response has no json data.    URL: %s", url) 

if len(data.get("ac")) == 0:
    logger.info("No aircraft flying, exit script")
    sys.exit()
    
logger.info("Wrangling data")

data_time = int(round(float(data.get("now")),0))
data_reduced = [
    {
        "hex" : str(aircraft.get("hex","")).strip(),
        "registration" : str(aircraft.get("r","")).strip(),
        "type" : str(aircraft.get("t","")).strip(),
        "name" : str(aircraft.get("flight","")).strip(),
        "latitude" : float(aircraft.get("lat",0.0)),
        "longitude" : float(aircraft.get("lon",0.0)),
        "heading" : float(aircraft.get("nav_heading",0.0)),
        "altitude_geometric" : float(aircraft.get("alt_geom",0.0)),
        "altitude_barometer" : float(aircraft.get("alt_baro",0.0))
    }
    for aircraft in data.get("ac")
]

aircrafts = [(d.get("hex"), d.get("registration"), d.get("type")) for d in data_reduced]
locations = [(data_time, d.get("latitude"), d.get("longitude"), d.get("heading"), d.get("altitude_geometric"), d.get("altitude_barometer"), d.get("hex")) for d in data_reduced]
        
        
#
#   Committing Data to Database
#

try:
    logger.info("Connecting to SQLite database")
    conn = sqlite3.connect("aurigny_tracker.db")
    c = conn.cursor()

    logger.info("Inserting data into the `aircraft` table")
    c.executemany("""
                INSERT OR IGNORE INTO aircraft (hex, registration, type)
                VALUES (?, ?, ?)""",
                aircrafts)

    logger.info("Inserting data into the `locations` table")
    c.executemany("""
                INSERT INTO location (unix_time, latitude, longitude, heading, altitude_geometric, altitude_barometer, aircraft_hex)
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
                locations)

    logger.info('Committing data to database')
    conn.commit()
    conn.close()
    logger.info('Data successfully committed to database')
    
except Exception as e:
    logger.error("SQL execute or commit failed: %s", e)