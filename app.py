from random import randint
from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
import threading


def dragon():
    while True:
        threading.Event().wait(180)
        print('deleting player')
        with playerLock:
            lowestHP = [[100,-1],[100,-1]]
            for i in players:
                if i.hp<lowestHP[i.team][0] and i.visible == True:
                    lowestHP[i.team]=i.hp,i.id
            if lowestHP[0][1]!=-1:
                players[lowestHP[0][1]].visible=False
            if lowestHP[1][1]!=-1:
                players[lowestHP[1][1]].visible=False
            print(lowestHP)
        socketio.emit('new_positions', {"objects": [i.to_dict() for i in players]})


gridlx = 80
gridly = 80
grid = [[0 for i in range(gridlx)] for j in range(gridly)]
cointotals=[0,0]
for i in range(gridly):
    if i == 0 or i == gridly-1:
        grid[i] = [1 for i in range(gridlx)]
    else:
        grid[i][-1] = 1
        grid[i][0] = 1
    for j in range(1,gridlx):
        if (0<i<gridlx-1) and (0<i<gridly-1):
            if randint(0,9) < 1:
                grid[i][j] = 1
            elif randint(0,20) < 1:
                grid[i][j] = 2

def checkplayer(x,y):
    for i in players:
        if i.x == x and i.y == y and i.visible == True:
            return False
    return True

def attack(player):
    for i in range(len(players)):
        if abs(players[i].x-player.x)<=1 and abs(players[i].y-player.y)<=1 and players[i] != player:
            if players[i].team != players[player.id].team or players[player.id].sabotagecount <3:
                if players[i].team == players[player.id].team:
                    players[player.id].sabotagecount+=1
                    players[player.id].hp+=1
                players[i].hp-=1
                if players[i].hp <= 0:
                    players[i].visible = False
                    cointotals[players[i].id]-=players[i].coincount
                    socketio.emit('cointotal',cointotals)

def interact(player):
    if grid[player.y][player.x] == 2:
        player.coincount+=1
        cointotals[player.team]+=1
        socketio.emit('cointotal',cointotals)
        grid[player.y][player.x] = 0
        socketio.emit('base_grid', grid)
    return player

class Player:
    def __init__(self,x,y,name,id):
        self.id = id
        self.x = x
        self.y = y
        self.name = name
        self.team = self.id%2
        self.color = [self.team*255,0,((self.team+1)%2)*255]
        self.hp = 5
        self.coincount = 0
        self.visible = True
        self.sabotagecount = 0
    def move(self, charin):
        if charin == "W":
            if (grid[self.y-1][self.x] != 1 and checkplayer(self.x,self.y-1)) or self.visible == False:
                self.y-=1
        elif charin == "S":
            if (grid[self.y+1][self.x] != 1 and checkplayer(self.x,self.y+1)) or self.visible == False:
                self.y+=1
        elif charin == "A":
            if (grid[self.y][self.x-1] != 1 and checkplayer(self.x-1,self.y)) or self.visible == False:
                self.x-=1
        elif charin == "D":
            if (grid[self.y][self.x+1] != 1 and checkplayer(self.x+1,self.y)) or self.visible == False:
                self.x+=1
        elif charin == "Space":
            attack(self)
        elif charin == "E":
            self = interact(self)
    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'color': self.color,
            'hp': self.hp,
            'visible': self.visible,
            'coincount': self.coincount,
            'sabotagecount':self.sabotagecount
        }

players = []


app = Flask(__name__, static_url_path='/static')
app.secret_key='notVerySecret'
socketio = SocketIO(app, async_mode='threading')
# socketio = SocketIO(app)
CORS(app)
roundtimer=threading.Thread(target=dragon)
roundtimer.start()
playerLock = threading.Lock()


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        session['playerName'] = request.form.get('player_name')
        return redirect(url_for('main'))
    return render_template('index.html')

@app.route('/main')
def main():
    return render_template('main.html')

@socketio.on('connect')
def handle_connect():
    playerName = session.get('playerName','Guest')
    client_id = -1
    for i in range(len(players)):
        if players[i].name == playerName:
            client_id = i
    if client_id == -1:
        players.append(Player(randint(0,gridlx-1),randint(0,gridly-1),playerName,len(players)))
        client_id = len(players)-1
    join_room(client_id)
    socketio.emit('client_id', client_id, room=client_id)
    socketio.emit('base_grid', grid)
    socketio.emit('new_positions', {"objects": [i.to_dict() for i in players]})


@socketio.on('update_position')
def handle_update_position(data):
    players[data['id']].move(data['direction'])
    socketio.emit('new_positions', {"objects": [i.to_dict() for i in players]})
    

if __name__ == '__main__':
    socketio.run(app, debug=True)