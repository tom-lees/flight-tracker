# 2024-10-10 TL 
# Create database structure for Aurigny flight tracker.

#
#   Create Data Base
#

# TODO Add code to force foreign keys to be ON

import sqlite3

# conn = sqlite3.connect(':memory:')
conn = sqlite3.connect('aurigny_tracker.db')

c = conn.cursor()

c.execute(
   """CREATE TABLE IF NOT EXISTS aircraft (
        hex TEXT PRIMARY KEY NOT NULL,
        registration TEXT,
        type TEXT
        )""")

c.execute(
    """CREATE TABLE IF NOT EXISTS location (
        unix_time NUMERIC NOT NULL,
        latitude NUMERIC NOT NULL,
        longitude NUMERIC NOT NULL,
        heading NUMERIC NOT NULL,
        altitude_geometric NUMERIC NOT NULL,
        altitude_barometer NUMERIC NOT NULL,
        aircraft_hex TEXT, 
        PRIMARY KEY (unix_time, aircraft_hex),
        FOREIGN KEY (aircraft_hex) REFERENCES aircraft(hex)
        )"""
)