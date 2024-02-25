var canvas = document.getElementById("canvas");
    var scale = 40
    var ctx = canvas.getContext("2d");
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    var id;
    var grid;
    var gridToRender = [];
    var screensize = [20,20];
    var showLeaderboard = false;
    socket.on('base_grid', function(data) {
        grid = data
    });
    socket.on('client_id', function(data) {
        id = data
        console.log('Your client ID is: ' + data);
    });
    socket.on('cointotal',function(data) {
        console.log(data)
    })

    socket.on('outputscores', function(){
        showLeaderboard = true;
    })

    socket.on('startround', function(){
        showLeaderboard = false;
    })

    socket.on('new_positions', function(data) {
        if (showLeaderboard == false){
            var playerpos = data.objects;
            screenxoffset = playerpos[id]['x']-screensize[0]/2
            screenyoffset = playerpos[id]['y']-screensize[1]/2
            if (screenxoffset < 0) {
                screenxoffset = 0
            } else if (screenxoffset + screensize[0] >= grid[0].length) {
                screenxoffset = grid[0].length-screensize[0]
            }
            if (screenyoffset < 0) {
                screenyoffset = 0
            } else if (screenyoffset + screensize[1] >= grid.length) {
                screenyoffset = grid.length-screensize[1]
            }
            for (let i = 0; i < screensize[1]; i++) {
                gridToRender[i] = [];
                for (let j = 0; j < screensize[0]; j++) {
                    if (grid[i+screenyoffset][j+screenxoffset] == 0) {
                        gridToRender[i][j] = [255,255,255];
                    } else if (grid[i+screenyoffset][j+screenxoffset] == 2) {
                        gridToRender[i][j] = [0,255,0];
                    } else {
                        gridToRender[i][j] = [0,0,0];
                    }
                }
            }
            for (let i = 0; i<playerpos.length; i++) {
                console.log(playerpos[i]['visible'])
                if ((0 <= playerpos[i]['x'] - screenxoffset && playerpos[i]['x'] - screenxoffset < screensize[0]) && (0 <= playerpos[i]['y'] - screenyoffset && playerpos[i]['y'] - screenyoffset < screensize[1]) && playerpos[i]['visible'] == true) {
                    gridToRender[playerpos[i]['y']-screenyoffset][playerpos[i]['x']-screenxoffset] = playerpos[i]['color'];
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < screensize[1]; i++) {
                for (var j = 0; j < screensize[0]; j++) {
                    var x = j * scale;
                    var y = i * scale;
                    ctx.fillStyle = `rgb(${gridToRender[i][j].join(',')})`; // Convert RGB array to string
                    ctx.fillRect(x, y, scale, scale);
                }
            }
            ctx.fillStyle = 'black';
            for (let i = 0; i < playerpos.length; i++) { // puts text on characters displaying HP
                if (playerpos[i]['visible'] == true) {
                    ctx.fillText(playerpos[i]['hp'], (playerpos[i]['x'] - screenxoffset + 0.85) * scale, (playerpos[i]['y'] - screenyoffset) * scale)
                    ctx.fillText(playerpos[i]['coincount'], (playerpos[i]['x'] - screenxoffset) * scale, (playerpos[i]['y'] - screenyoffset) * scale)
                }
            }
            console.log(playerpos)
        } else{
            
        }
    });
    $(document).keydown(function(e) {
        var direction = '';
        switch(e.which) {
            case 87:
                direction = 'W';
                break;
            case 65:
                direction = 'A';
                break;
            case 83:
                direction = 'S';
                break;
            case 68:
                direction = 'D';
                break;
            case 69:
                direction = 'E';
                break
            case 32:
                direction = "Space";
                break;
            default:
                return;
        }
        socket.emit('update_position', { direction: direction, id: id});
    });