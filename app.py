import logging

import os
import sys
from flask import Flask, render_template, request, redirect, url_for, session  # or other specific imports you need
from flask_session import Session
import sqlite3
#TLDR on how to install Flask / other external libraries in general for Python.
#MacOS just did an update for Python! Now it follows PEP 668
#which requires certain environments to be "externally managed",
#so the good old "pip(3) install libraryname" doesn't work anymore :(
#instead, use the virtual environment system!
import json

# Set the base directory to the current file's location
basedir = os.path.abspath(os.path.dirname(__file__))
print(basedir)

# Set the path for the SQLite database file
db_path = os.path.join(basedir, 'volleyballdata.db')
print(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

#HOW TO INSTALL EXTERNAL LIBRARIES:
#1. Create a virtual environment
#python3 -m venv myenv (click "yes")
#2. Activate the virtual environment
#source myenv/bin/activate
#3. Now install the external library in the virtual environment
#pip install flask
#Now run your app as usual in the virtual environment!
#python app.py

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

logging.basicConfig(filename='/home/moregank/flask.log', level=logging.DEBUG)

app.secret_key = 'sessionkey'

is_newgame = True
opponent_name = "placeholder opponent name"

@app.route("/", methods=["GET", "POST"])
def home():

    session["is_newgame"] = True
    session["opponent_name"] = "placeholder opponent name"
    global is_newgame
    print(is_newgame)
    return render_template("index.html", isNewGame = is_newgame)

@app.route("/game/<int:game_id>", methods=["GET", "POST"])
def game(game_id):
    global db_path
    print("GAME LOG OPENED.")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    command = "SELECT player_number, player_name, serves, passes, attacks FROM players WHERE game_id = ?"
    cursor.execute(command, (game_id,))
    result = cursor.fetchall()
    print("cool result from SQL fetch:",result)

    command = "SELECT date, opponent FROM games_archive WHERE id = ?"
    cursor.execute(command, (game_id,))
    metadata = cursor.fetchall()
    print("metadata:",metadata)
    #YESSS IT WORKS! FUCK YES I CONNECTED THAT SHIT


    #return render_template("receive_tracker.html", numbers = dummy_numbers, names = dummy_names, pass_ratings = dummy_pass_ratings, TAs = dummy_TAs, TEs = dummy_TEs, percentages = dummy_percentages, num_entries = len(dummy_numbers))
    return render_template("game.html", data = result, len_data = len(result), metadata = metadata)

@app.route("/games_archive", methods=["GET", "POST"])
def games_archive():
    global db_path

    conn = sqlite3.connect(db_path)
    print("A..MOGUS")
    cursor = conn.cursor()
    command = "SELECT * FROM games_archive"
    cursor.execute(command)
    result = cursor.fetchall()
    print("result from SQL fetch:",result)

    #YESSS IT WORKS! FUCK YES I CONNECTED THAT SHIT


    #return render_template("receive_tracker.html", numbers = dummy_numbers, names = dummy_names, pass_ratings = dummy_pass_ratings, TAs = dummy_TAs, TEs = dummy_TEs, percentages = dummy_percentages, num_entries = len(dummy_numbers))
    return render_template("games_archive.html", data = result, len_data = int(len(result)))

def reset_active_game():
    global db_path
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("UPDATE active_game SET data = NULL")
    print("udpate rewuest is done!")

    conn.commit()
    conn.close()

@app.route("/init_new_game", methods = ["POST"])
def init_new_game():
    session['is_newgame'] = False
    session['opponent_name'] = request.form['opponent_name']


    return redirect(url_for("active_game", set_id = 1))


@app.route("/active_game/<int:set_id>", methods=["POST", "GET"])
def active_game(set_id):
    global db_path


    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    command = "SELECT * FROM active_game WHERE set_id = ?"
    print("set_id:",set_id)
    cursor.execute(command, (int(set_id),))
    result = cursor.fetchall()
    print("result from SQL fetch:",result)
    return render_template("active_game_UNSTABLE.html", data = result, len_data = len(result), set_id = set_id)

def save_data_func():
    global db_path
    #handle submission logic here.
    print("skibidi toilet")
    print("save_data called")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    dummyData_json = request.form.get('dummyData')
    print(dummyData_json)
    dummyData = json.loads(dummyData_json)

    #also, ya gotta delete the preexisting data first! uwu
    #hellll nooooo
    #cursor.execute("DELETE FROM active_game")

    for player in dummyData:

        #don't forget: data = array/list in code but a string in sql storage.
        #just completely rewriting the whole thing lmao who cares
        #erm it does matter dumbass

        cursor.execute("""
            UPDATE active_game
            SET serves = ?, passes = ?, attacks = ?, assists = ?
            WHERE set_id = ? AND number = ?
        """, ("".join(player[2]),  # Serves
              "".join(map(str, player[3])),  # Passes
              "".join(player[4]),  # Attacks
              "".join(player[5]), #Assists
              player[6],  # set_id,
              player[0]
              ))



    cursor.execute("SELECT * FROM active_game")
    data = cursor.fetchall()
    print("games returned from SQL fetch:",data)

    conn.commit()
    conn.close()


@app.route("/save_data/<int:target_set_id>", methods=["GET", "POST"])
def save_data(target_set_id):

    save_data_func()


    return redirect(url_for("active_game", set_id = int(target_set_id)))


@app.route("/submit_data", methods=["GET", "POST"])
def submit_data():
    global db_path
    #let's save the data first before submitting anything.
    save_data_func()


    #handle submission logic here.
    print("SUBMIT DATA LOGS.")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    from datetime import datetime
    game_date = datetime.now().strftime('%m-%d-%Y')
    cursor.execute("INSERT INTO games_archive (date, opponent) VALUES (?, ?)", (game_date, session["opponent_name"]))

    opponent_name = "placeholder opponent name"

    game_id = cursor.lastrowid
    print("Inserted new game with ID:", game_id)

    cursor.execute("SELECT * FROM active_game")
    data = cursor.fetchall()
    print("games returned from SQL fetch:",data)

    # Convert the fetched data into a JSON string for storage
    for player in data:
        player_number = player[0]  # Assuming this is player number
        player_name = player[1]    # Assuming this is player name
        player_serves = player[2] # Join player data (or handle as needed)
        player_passes = player[3]
        player_attacks = player[4]
        player_assists = player[5]
        set_id = int(player[6])
        cursor.execute("""
            INSERT INTO players (game_id, player_number, player_name, serves, passes, attacks, assists, set_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (game_id, player_number, player_name, player_serves, player_passes, player_attacks, player_assists, set_id))

    #cursor.execute("DELETE FROM active_receive")
    #stop...for now
    #ok testing is done! it works fuck yes

    print("now calling reset.")
    cursor.execute("UPDATE active_game SET serves = NULL, passes = NULL, attacks = NULL, assists = NULL")

    conn.commit()
    conn.close()
    session["opponent_name"] = "placeholder opponent name"
    session['is_newgame'] = True


    return redirect(url_for("home"))

@app.route("/secret", methods=["GET"])
def secret():
    return render_template("secret.html")

if __name__ =="__main__":
    pass
    #app.run(debug = True)
    #app.run(host='0.0.0.0', port=5001)