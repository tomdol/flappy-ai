/*!
 * Copyright 2019
 * ISSDL LLC
 * FLAPPY-NEPTUN ISSDL.
 */


window.google = {};
google.dom = {};
google.browser = {};
google.browser.engine = {}

var spriteURL = 'https://drive.google.com/uc?export=view&id=1ikDhU4sESVwVzpmVgD5tfZm8brosHcl4';
var bird = 'https://drive.google.com/uc?export=view&id=1xuM0bV7ECc1_zh4obiMoNmvS-wWJs1Br';
var pipeNorth = 'https://drive.google.com/uc?export=view&id=1GuCIFR847x3qGX79W-zZPreivxkhSyTD';
var pipeSouth = 'https://drive.google.com/uc?export=view&id=1EI8WEYbqcwpKuiNonz9fPM65WLBAPhDU';
var numbers = 'https://drive.google.com/uc?export=view&id=105X7UJfDRy4zBXNh6bR_N0dLB5d0syxA';
//var pipeNorth = 'https://drive.google.com/uc?export=view&id=1XkePIJlxHjtwxHe5fyXWDif8YEw8vKqY';
//var bird = 'https://drive.google.com/uc?export=view&id=1KPcjZVajzlDo0A5q87L_9zYu7_WRO6aY';
//var bird = 'https://drive.google.com/uc?export=view&id=1WnKj9EC770sqUw_vLxjXUTm8jZ0fcQ-G';
//var pipeSouth = 'https://drive.google.com/uc?export=view&id=19CO7Eefr6K0hR-Tg2QW3lXMfAIl1WoFJ';

google.dom.remove = function (a) {
    return a && a.parentNode && a.parentNode.removeChild(a)
};

google.dom.append = function (a) {
    return document.body.appendChild(a)
};

google.pacman ||
function () {
    var a = true,
        e = false,
        g = {},
        C = [90, 60, 45],
        D = C[0],
        B = [48, 48],
	    g_score = "0",
        cc = false, cd = false, kp = false, a_p_y = 0.0, s_p = 0.4,
        game_distance = 0,
        p_l = 0,
        game_score = 0,
        game_distance = 0,
        game_scoreBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        game_scoreDig = 1,
        apiUrl =  "localhost:3000", /*"18.184.76.126:443",*/ 
        protocole = "http",
        isSpeed = false,
        lvls = 0,
        speed = 0.4;

    function Actor(b) {
        this.id = b;
        this.elPos = [0, 0];
    };
    Actor.prototype.createElement = function () {
        this.el = document.createElement("div");
        this.el.className = "pcm-ac";
        this.el.id = "actor" + this.id;
        if (g.useCss) {
            this.el.style.backgroundImage = "url(" + bird + ")";
            this.el.style.backgroundPosition = 2 + "px " + 2 + "px";
            this.el.style.backgroundRepeat = "no-repeat"
            this.el.style.left = "20px";
            this.el.style.top = "250px";
        }
        g.playfieldEl.appendChild(this.el);
        this.elPos = [20, 250];
        this.requestedDir = 0;
        this.elBackgroundPos = [0, 0]
    };
    Actor.prototype.restartPosition = function() {
        this.elPos = [20, 250];
        this.requestedDir = 0;
        this.elBackgroundPos = [0, 0]
        this.el.style.left = "20px";
        this.el.style.top = "250px";
    };
    Actor.prototype.siftPosition = function (w, h) {
        var b = this.elPos[1] + h, c;
        c = this.elPos[0] + w;
        a_p_y = b;
        if (this.elPos[0] != c || this.elPos[1] != b) {
            if (c <= 430 && c >= 0) {
                this.elPos[0] = c;
                this.el.style.left = c + "px";
            }
            if (b >= 0 && b <= 639) {
                this.elPos[1] = b;
                this.el.style.transform = "rotate(7deg)";
                this.el.style.top = b + "px"
            }
        }
    };
    Actor.prototype.moveGravity = function () {
        this.siftPosition(0, 0.0) // 0.9
    };
    Actor.prototype.settings = function (reqDir) {
        var v = [0, 0];
        if (reqDir == 37) { // left
            v[0] = -8;
        }
        else if (reqDir == 38) { // up
            v[1] = -8;
        }
        else if (reqDir == 39) { // right
            v[0] = 8;
        }
        else if (reqDir == 40) { // down
            v[1] = 8;
        }
        return v;
    };
    Actor.prototype.move = function (reqDir) {
        var v = this.settings(reqDir);
        this.requestedDir = 0;
        this.siftPosition(v[0], v[1]);
    };
    Actor.prototype.moveActor = function () {
        if (this.requestedDir != 0) {
            this.move(this.requestedDir);
        }
    };
    function Pipe(b, r) {
        this.id = b;
        this.reverse = r;
    }
    Pipe.prototype.createPipeElement = function () {
        this.el = document.createElement("div");
        this.el.className = "pcm-pipe";
        this.el.id = "pipe" + this.id;
        var x = 0;
        var y = 0;
        if (g.useCss && this.reverse) { //South
            this.el.style.backgroundImage = "url(" + pipeSouth + ")";
            this.el.style.backgroundPosition = 0 + "px " + 0 + "px";
            var h = 200;
            this.el.style.height = h + "px";
            y = 639 - 85 - h;
            x = 882;
            this.size = [52, h];
            this.el.style.top = y;
            this.el.style.left = x;
            this.elPos = [x, y];
        } else { // North
            this.el.style.backgroundImage = "url(" + pipeNorth + ")";
            this.el.style.backgroundPosition = 0 + "px " + 0 + "px";
            x = 882;
            y = (g.pipe[0].size[1]) - 378;
            this.size = [52, y + 378];
            this.el.style.top = y + "px";
            this.el.style.left = x;
            this.elPos = [x, y + 378];
        }
        this.el.style.backgroundRepeat = "no-repeat"
        g.playfieldEl.appendChild(this.el);
        this.requestedDir = 0;
        this.done = false;
        this.elBackgroundPos = [x, y];
    };
    Pipe.prototype.siftPosition = function (w, h) {
        var x = this.elPos[0] - w;
        var y = this.elPos[1] + 0;
        s_p = w;
        if (x >= -52) {
            this.elPos[0] = x;
            if (this.reverse) {
                this.elPos[1] = y;
                this.el.style.left = x + "px";
                this.el.style.top = y + "px";
            } else {
                this.elPos[1] = y;
                this.el.style.left = x + "px";
            }
        } else {
            this.done = false;
            this.elPos[0] = 482;
            if (this.reverse) {
                var max = 348;
                var min = 170;
                var r = Math.floor(Math.random() * (+max - +min)) + min;
                this.el.style.height = r + "px";
                this.elPos[1] = 639 - 85 - r;
                this.size = [52, r];
                cp_s = true;
            } else { // North
                this.el.style.backgroundPosition = 0 + "px " + 0 + "px";
                var x = 482;
                var y = 639 - 85 - 378 - (g.pipe[0].size[1]) - 200;
                cp_n = true;
                this.size = [52, y + 378];
                this.el.style.top = y + "px";
                this.el.style.left = x;
                this.elPos = [x, y + 378];
                lvls = lvls + 1;
                if(lvls % 10 == 0) {
                    isSpeed = true;
                }

            }
        }
    };
    Pipe.prototype.resetatPipesPosition = function() {
        this.done = false;
        this.elPos[0] = 882;
        if (this.reverse) {
            var max = 348;
            var min = 170;
            var r = Math.floor(Math.random() * (+max - +min)) + min;
            this.el.style.height = r + "px";
            this.elPos[1] = 639 - 85 - r;
            this.size = [52, r];
        } else { // North
            this.el.style.backgroundPosition = 0 + "px " + 0 + "px";
            var x = 882;
            var y = 639 - 85 - 378 - (g.pipe[0].size[1]) - 200;
            this.size = [52, y + 378];
            this.el.style.top = y + "px";
            this.el.style.left = x;
            this.elPos = [x, y + 378];
        }
    };
  
    Pipe.prototype.movePipe = function () {
        if(game_score % 10 == 0 && game_score != 0 && isSpeed == true) {
            speed = speed + 0.2;
            isSpeed = false;
        }
        this.siftPosition(speed, 0);
    };
    g.keyPressed = function (b) {
        var c = e;
        switch (b) {
            case 37: // left
                g.actors[0].requestedDir = 37;
                kp = true;
                break;
            case 38: // up
                g.actors[0].requestedDir = 38;
                kp = true;
                break;
            case 39: // right
                g.actors[0].requestedDir = 39;
                kp = true;
                break;
            case 40: // down
                g.actors[0].requestedDir = 40;
                kp = true;
                break;
        }
        return c;
    };
    g.createPipeElements = function () {
        for (var idx = 0; idx < 2; ++idx) {
            g.pipe[idx].createPipeElement();
        }
    };
    g.createActorElements = function () {
        g.actors[0].createElement()
    };
    g.determinePlayfieldDimensions = function () {
        g.playfieldWidth = 482;
        g.playfieldHeight = 639;
    };
    g.preparePlayfield = function () {
        g.playfield = [];
        for (var b = 0; b <= g.playfieldHeight - 28; b++) {
            g.playfield[b + 28] = [];
            for (var c = 0; c <= g.playfieldWidth - 38; c++) g.playfield[b + 28][c + 38] = {
                path: 0,
                dot: 0,
                intersection: 0
            }
        }
    };
    g.prepareScore = function () {
        g.scoreEl = [];
        g.scoreEl[0] = document.createElement("div");
        g.scoreDigits = 10;
        g.scoreEl[0].id = "pcm-sc-1-l";
        if (g.useCss) {
            g.scoreEl[0].style.backgroundImage = "url(" + numbers + ")";
            g.scoreEl[0].style.backgroundPosition = 0 + "px " + 0 + "px";
            g.scoreEl[0].style.visibility = "hidden";
        }
        g.scoreEl[0].style.backgroundRepeat = "no-repeat"
        g.playfieldEl.appendChild(g.scoreEl[0]);
        g.scoreEl = [];
        g.scoreEl[0] = document.createElement("div");
        g.scoreEl[0].id = "pcm-sc-1";
        for (var b = 0; b < g.scoreDigits; b++) {
            var c = document.createElement("div");
            c.id = "pcm-sc-1-" + b;
            c.style.left = b * 21 + "px";
            c.style.position = "absolute";
            c.style.visibility = b === 0 ? "visible" : "hidden";
            c.style.width = "21px";
            c.style.height = "31px";
            if (g.useCss) {
                c.style.backgroundImage = "url(" + numbers + ")";
                c.style.backgroundPosition = 0 + "px " + 0 + "px";
                c.style.backgroundRepeat = "no-repeat"
            }
            g.scoreEl[0].appendChild(c)
        }
        g.playfieldEl.appendChild(g.scoreEl[0]);
    };
    g.resetPlayfield = function () {
        g.playfieldEl.innerHTML = "";
        if (g.useCss) {
            g.playfieldEl.style.backgroundImage = "url(" + spriteURL + ")";
            g.playfieldEl.style.backgroundPosition = 0 + "px " + 0 + "px";
            g.playfieldEl.style.backgroundRepeat = "no-repeat"
        }
        g.prepareScore();
        g.createPipeElements();
        g.createActorElements()
    };
    g.newLevel = function (b) {
        g.resetPlayfield();
    };
    g.prepareElement = function (b, c, d) {
        c = g.getCorrectedSpritePos(parseInt(c, 10));
        d = g.getCorrectedSpritePos(parseInt(d, 10));
        if (g.useCss) {
            b.style.backgroundImage = "url(" + spriteURL + ")";
            b.style.backgroundPosition = -c + "px " + -d + "px";
            b.style.backgroundRepeat = "no-repeat"
        } else {
            b.style.overflow = "hidden";
            c = "display: block; position: relative; left: " + -c + "px; top: " + -d + "px";
            b.innerHTML = '<img style="' + c + '" src="' + spriteURL + '">'
        }
    };
    g.createPlayfield = function () {
        g.playfieldEl = document.createElement("div");
        g.playfieldEl.id = "pcm-p"; // play field
        g.canvasEl.appendChild(g.playfieldEl)
    };
    g.createActors = function () {
        g.actors = [];
        g.actors[0] = new Actor(0);
    };
    g.createPipe = function () {
        g.pipe = [];
        g.pipe[0] = new Pipe(0, a); // South
        g.pipe[1] = new Pipe(1, e); // North
    };
    g.restartActorPosition = function() {
        g.actors[0].restartPosition() 
    }; 
    g.resetatPipesPositions = function() {
        g.pipe[0].resetatPipesPosition();
        g.pipe[1].resetatPipesPosition();
    };
    g.restartGamePlay = function() {
        document.getElementById("result-status").innerText = "SAVE RESULT: 0";
        game_score = 0;
        game_distance = 0;
        p_l = 0;
        lvls = 0; cc = false; cd = false;
        kp = false; a_p_y = 0.0; isSpeed = false;
        game_scoreBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        game_scoreDig = 1;
        $.post({
            traditional: true,
            url: protocole + "://" + apiUrl + "/game/n",
            contentType: 'application/json',
            data: JSON.stringify( 
                { 's': 0, 'd': 0, 'p_l': 0 } 
            ),
            dataType: 'json',
            success: function(response){ console.log( response ); }
        });
        //var d = 0;
        var f = document.getElementById("pcm-sc-1" + "-" + 0);
        if (g.useCss) f.style.backgroundPosition = 0 + "px " + 0 + "px";
        g.restartActorPosition(); 
        g.resetatPipesPositions();
        g.initializeTickTimer();
    };
    g.startGameplay = function () {
        document.getElementById("result-status").innerText = "SAVE RESULT: 0";
        game_score = 0;
        game_distance = 0;
        p_l = 0; 
        lvls = 0; 
        isSpeed = false;
        $.post({
            traditional: true,
            url: protocole + "://" + apiUrl + "/game/n",
            contentType: 'application/json',
            data: JSON.stringify( 
                { 's': 0, 'd': 0, 'p_l': 0 } 
            ),
            dataType: 'json',
            success: function(response){ console.log( response ); }
        });
        game_scoreBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        game_scoreDig = 1;
        g.newLevel(a);
        g.initializeTickTimer();

    };
    g.newGame = function () {
        g.playerCount = 1;
        g.createPlayfield();
        g.createPipe();
        g.createActors(); // Create acctors
        //g.startGameplay()
    };
    g.moveActors = function () {
        g.actors[0].moveActor();
        //g.actors[0].moveGravity();
    };
    g.movePipes = function () {
        g.pipe[0].movePipe();
        g.pipe[1].movePipe();
    };
    g.myTimer = function () {
        var d = new Date();
        document.getElementById("demo").innerHTML = d.toLocaleTimeString();
    };
    g.detColl = function () {
        var bird_x = g.actors[0].elPos[0];
        var bird_y = g.actors[0].elPos[1];
        var c = false;
        cc = true;
        game_distance = game_distance + 1;
        if (bird_x + B[0] >= g.pipe[1].elPos[0] &&
            bird_x <= g.pipe[1].elPos[0] + 52 &&
            bird_y <= g.pipe[1].elPos[1]
        ) { c = true; cd = true; g.update(); }
	    else if (bird_x + B[0] >= g.pipe[0].elPos[0] &&
            bird_x <= g.pipe[0].elPos[0] + 52 &&
            bird_y + B[1] >= g.pipe[0].elPos[1]
        ) { c = true; cd = true; g.update(); }
	    else if (bird_y + B[1] >= 554) { c = true; cd = true; g.update(); }
        if(c) {
            window.clearInterval(g.tickTimer);
        }
    };
    g.updateChromeScore = function () {
        var c = game_score.toString();
        g_score = c;
        if (c.length > game_scoreDig) {
            game_scoreDig += 1;
            var f = document.getElementById("pcm-sc-1" + "-" + (game_scoreDig - 1).toString());
            f.style.visibility = "visible";
        }
        for (var d = 0; d < c.length; d++) {
            var f = document.getElementById("pcm-sc-1" + "-" + d);
            if (c[d] !== game_scoreBoard[d].toString()) {
                var int = parseInt(c[d], 10);
                game_scoreBoard[d] = int;
                var p = d - int * 21;
                if (g.useCss) f.style.backgroundPosition = p + "px " + 0 + "px";
            }
        }
        document.getElementById("result-status").innerText = "SAVE RESULT: "+ c;
    };
    g.addScore = function () {
        g.distance = g.pipe[0].elPos[0] - g.actors[0].elPos[0];
        if (g.distance <= -B[0] && !g.pipe[0].done) {
            game_score += 1;
            $.post({
                traditional: true,
                url: protocole + "://" + apiUrl +"/game/r",
                contentType: 'application/json',
                data: JSON.stringify( {'r': game_score} ),
                dataType: 'json',
                success: function(response){ console.log( response ); }
            });
            g.update();
            g.pipe[0].done = true;
            g.updateChromeScore();
        }
    };
    g.tick = function () {
        //for (var b = 0; b < g.tickMultiplier; b++) {
            g.moveActors();
            g.movePipes();
            g.detColl();
            g.addScore();
        //}
    };
    g.initializeTickTimer = function () {
        window.clearInterval(g.tickTimer);
        g.fpsChoice = 2;
        g.fps = C[g.fpsChoice];
        g.tickInterval = 100 / g.fps;
        g.tickMultiplier = D / g.fps;
        g.tickTimer = window.setInterval(g.tick, g.tickInterval)
    };
    g.createCanvasElement = function () {
        g.canvasEl = document.createElement("div");
        g.canvasEl.id = "pcm-c";
        g.canvasEl.hideFocus = a;
        document.getElementById("logo").appendChild(g.canvasEl);
        g.canvasEl.tabIndex = 0;
        g.canvasEl.focus()
    };
    g.addCss = function () {
        var b = "#pcm-c { " +
            "width: 482px; " +
            "border-top: 25px solid black;  " +
            "padding-bottom: 25px;  " +
            "height: 639px;  position: " +
            "relative; outline: 0; " +
            " overflow: hidden;  " +
            "-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" +
            "}" +
            "#pcm-c * {" +
            "position: absolute;  " +
            "overflow: hidden;" +
            "}" +
            "#pcm-p,#pcm-cc {  " +
            "left: 0px; " +
            "width: 482px; " +
            "height: 639px; " +
            "z-index: 99; " +
            "overflow: hidden;" +
            "}" +
            "#pcm-c .pcm-ac {  " +
            "width: 48px;  " +
            "height: 48px; " +
            "margin-left: 1px;" +
            "margin-top: 1px;  " +
            "z-index: 0;" +
            "}" +
            "#pcm-c .pcm-pipe {  " +
            "width: 52px;  " +
            "height: 378px; " +
            "margin-left: 0px;" +
            "margin-top: 0px;  " +
            "z-index: 0;" +
            "}" +
            "#pcm-sc-1-l {" +
            "left: 0px;" +
            "top: 0;" +
            "width: 210px;  " +
            "height: 31px;" +
            "}" +
            "#pcm-sc-1 {  " +
            "left: 220px; " +
            "top: 100px;  " +
            "width: 210px; " +
            "height: 31px;  " +
            "position: absolute;  " +
            "overflow: hidden;" +
            "}";
        g.styleElement =
            document.createElement("style");
        g.styleElement.type = "text/css";
        if (g.styleElement.styleSheet) g.styleElement.styleSheet.cssText = b;
        else g.styleElement.appendChild(document.createTextNode(b));
        document.getElementsByTagName("head")[0].appendChild(g.styleElement)
    };
    g.everythingIsReady = function () {
        if (!g.ready) {
            g.ready = a;
            var b = document.getElementById("logo-l");
            google.dom.remove(b);
            //document.getElementById("logo").style.background = "black";
            g.addCss();
            g.createCanvasElement();
            g.speedIntervals = [];
            g.addSaveListener(); // controls
            g.fpsChoice = 0;
            g.canDecreaseFps = a;
            g.initializeTickTimer();
            g.newGame()
        }
    };
    g.addSaveListener = function () {
        document.getElementById('save').addEventListener('click', () => {
            document.getElementById("result-status").innerText = "RESULT SAVED";
            $.post({
                traditional: true,
                url: protocole + "://" + apiUrl +"/game/s",
                contentType: 'application/json',
                data: JSON.stringify( {} ),
                dataType: 'json',
                success: function(response){ console.log( response ); }
            });
        });
    };
    g.updateLoadingProgress = function (b) {
        b = Math.round(b * 200);
        document.getElementById("logo-b").style.width = b + "px"
    };
    g.checkIfEverythingIsReady = function () {
        if (g.graphicsReady) g.updateLoadingProgress(0.67);
        if (g.graphicsReady) {
            g.updateLoadingProgress(1);
            g.everythingIsReady()
        }
    };
    g.preloadImage = function (b) {
        var c = new Image,
            d = google.browser.engine.IE;
        if (!d) c.onload = g.imageLoaded;
        c.src = b;
        d && g.imageLoaded()
    };
    g.imageLoaded = function () {
        g.graphicsReady = a;
        g.checkIfEverythingIsReady()
    };
    g.prepareGraphics = function () {
        g.graphicsReady = e;
        g.preloadImage(spriteURL)
    };
    g.destroy = function () {
        if (google.pacman) {
            window.clearInterval(g.tickTimer);
            window.clearInterval(g.dotTimer);
            google.dom.remove(g.styleElement);
            google.dom.remove(g.canvasEl);
            google.pacman = undefined
        }
    };
    g.exportFunctionCalls = function () {
        google.pacman = {};
        google.pacman.startGameplay = g.startGameplay;
        google.pacman.listener = g.addSaveListener;
        google.pacman.restartGamePlay = g.restartGamePlay;
        google.pacman.destroy = g.destroy
        google.pacman.keyPressed = g.keyPressed;
    };
    g.update = function (){ 
          $.post({
                traditional: true,
                url: protocole + "://" + apiUrl +"/game/rr",
                contentType: 'application/json',
                data: JSON.stringify( {
                    'cc': cc,
                    'cd':cd,
                    'kp': kp,
                    's_p':s_p,
                    'a_p_y': a_p_y,
                    'r': game_score} ),
                dataType: 'json',
                success: function(response){ console.log( response ); }
          });
          cc = false; cd = false;kp = false; a_p_y = 0.0; 
    };
    g.init = function () {
        g.ready = e;
        document.getElementById("logo").title = "";
        g.updateLoadingProgress(0.33);
        g.exportFunctionCalls();
        g.useCss = navigator.userAgent.indexOf("MSIE 5.") != -1 || navigator.userAgent.indexOf("MSIE 6.") != -1 || navigator.userAgent.indexOf("MSIE 7.") != -1 ? e : a;
        g.prepareGraphics();
    };
    g.init();
}();
