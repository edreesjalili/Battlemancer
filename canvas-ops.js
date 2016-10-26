/*global ritual, createjs */
(function() {
    //global dom canvas objects
    var csv =  30; // canvas scalar value
    var scsv = 15;//small canvas scalar value
    var lineValuesObject = {
        1:1 * csv,
        2:2 * csv,
        3:3 * csv,
        4:4 * csv,
        5:5 * csv,
        6:6 * csv,
        7:7 * csv,
        8:8 * csv,
        9:9 * csv
    }
    
    ritual.setupWizardCanvas = function(wiz) {
        wiz.stage = new createjs.Stage(wiz.canvas);
        wiz.smallStage = new createjs.Stage(wiz.smallCanvas);
        createjs.Ticker.addEventListener('tick', wiz.stage);
        createjs.Ticker.addEventListener('tick', wiz.smallStage);
    }
    
    ritual.startSig = function startSig(wiz) {
        'use strict';
        let aSigil = new sigil(wiz.sigil);
        wiz.stage.removeAllChildren();
        wiz.stage.update();
        wiz.ready = false;
        wiz.cheatMap(wiz.stage, (.25/wiz.level));
        let startingPoint = {
            xStart: getX(wiz.sigil[0]),
            yStart: getY(wiz.sigil[0])
        };
        drawSigil(aSigil, startingPoint, wiz.stage, wiz);

    }
    
    ritual.miniSig = function miniSig(wiz) {
      'use strict';
        let aSigil = new smallSigil(wiz.sigilCompleted);
        let startingPoint = {
            xStart: getSmallX(wiz.sigilCompleted[0]),
            yStart: getSmallY(wiz.sigilCompleted[0])
        };
        drawSmallSigil(aSigil, startingPoint, wiz.smallStage);        
    }
    
    ritual.clearStage = function clearStage(wiz) {
        wiz.stage.removeAllChildren();
        wiz.stage.update();
    }
    
    //----------------------- objects -------------------------------
    /* 
        Creates a point object using start and end points
    */
    var point = function point(x, y) {
        this.x = x;
        this.y = y;
    }
    /* 
        Creates a sigil object
        l: the generated line points
    */
    var sigil = function sigil(l) {
        this.points = [];
        for (var i = 0; i < l.length; i++) {
            var p = l[i];
            var pt = new point(getX(p), getY(p));
            this.points.push(pt);
        }
    }
    
    var smallSigil = function sigil(l) {
        this.points = l.map((e) => new point(getSmallX(e), getSmallY(e)));
    }
    
    //----------------------- functions -----------------------------
    /*
        Takes an sigil object and uses it to draw a line
        sigil: sigil object
        canvas: canvas lines will be drawn on
    */
    var drawSigil = function drawSigil(sigil, startPoint, stage, wiz) {
        drawCircle(stage, startPoint);
        drawLine(sigil.points, sigil.points.length, stage, wiz);
    }
    
    var drawSmallSigil = function drawSmallSigil(sigil, startPoint, stage) {
        drawSmallLines(sigil.points, sigil.points.length, stage);
        
        setTimeout(function() {
            stage.removeAllChildren();
            stage.update();
        },3000);
    }
    
    /*
        Takes a line and draws after a delay
        ctx: the canvsa context
        line: line points
    */
    var drawLine = function drawLine(arr, len, stage, wiz) {
        'use strict';
        var c = createjs;
        var line = stage.addChild(new c.Shape());
        line.graphics.beginStroke('orange').setStrokeStyle(2).moveTo(arr[0].x,arr[0].y);
        line.shadow = new createjs.Shadow("yellow", 0, 0, 10);
        var cmd = line.graphics.lineTo(arr[0].x,arr[0].y).command;
        if(arr.length !== 1) {
            let next = arr.slice(1);
            c.Tween.get(cmd)
                    .to(arr[1], 500)
                    .call(drawLine,[next, len, stage, wiz]);
                    drawPulse(new point(arr[1].x, arr[1].y), stage)
        } else {
            c.Tween.get(cmd).wait(500 * len).to(arr[0], 500);
            wiz.makeReady();
        }
    }
    
    var drawSmallLines = function drawSmallLines(arr, len, stage) {
        'use strict';
        var c = createjs;
        var line = stage.addChild(new c.Shape());
        line.graphics.beginStroke('white').setStrokeStyle(2).moveTo(arr[0].x,arr[0].y);
        line.shadow = new createjs.Shadow("blue", 0, 0, 20);
        var cmd = line.graphics.lineTo(arr[0].x,arr[0].y).command;
        if(arr.length !== 1) {
            let next = arr.slice(1);
            c.Tween.get(cmd).wait(500).to(arr[1], 1000);
            drawSmallLines(next, len, stage);
        } else {
            c.Tween.get(cmd).to(arr[0], 1000);
        }
    }
    
    var drawPulse = function drawPulse(point, stage) {
        'use strict';
        var c = createjs;
        for(var i = 1; i < 3; i++) {
            let circle = new c.Shape();
            circle.graphics.setStrokeStyle(2);
            circle.graphics.beginStroke(getRandomColor());
            circle.graphics.drawCircle(0, 0, i * 2);
            circle.alpha = 0;
            circle.x = point.x;
            circle.y = point.y;
		    circle.compositeOperation = "lighter";
            stage.addChild(circle);
		    c.Tween.get(circle)
		        .wait(500)
		        .to({alpha: 1 - i * 0.02}, 500)
		        .to({alpha: 0}, 500);
        }
    }
    
    var drawCircle = function drawCircle(stage, point) {
        var circle = new createjs.Shape();
        circle.graphics.setStrokeStyle(2).beginStroke("orange").drawCircle(0, 0, 5);
        circle.x = point.xStart;
        circle.y = point.yStart;
        circle.shadow = new createjs.Shadow("yellow", 0, 0, 10);
        stage.addChild(circle);
    }
    
    var drawLetter = function drawNewLetter (stage, pos, letter, opac) {
        var text = new createjs.Text(letter, "30px Serif", "rgba(255,50,0," + opac + ")");
        text.textBaseline = "hanging"
        text.shadow = new createjs.Shadow("#0000ff", 0, 0, 10);
        // var meas = ctx.measureText(letter).width/2;
        var meas = text.getBounds().width /2;
        // text.align='center';
        text.x = getX(pos) - meas;
        text.y = getY(pos)-(csv/2);
        stage.addChild(text);
    };
    
    ritual.drawLeftGrid = function(stage, opac) {
        // var ctx = canvas.getContext('2d');
        drawLetter(stage, 1,'q', opac);
        drawLetter(stage, 2, 'w', opac);
        drawLetter(stage, 3, 'e', opac);
        drawLetter(stage, 4, 'a', opac);
        drawLetter(stage, 5, 's', opac);
        drawLetter(stage, 6, 'd', opac);
        drawLetter(stage, 7, 'z', opac);
        drawLetter(stage, 8, 'x', opac);
        drawLetter(stage, 9, 'c', opac);
    }
    ritual.drawRightGrid = function(stage, opac) {
        // var ctx = canvas.getContext('2d');
        drawLetter(stage, 1, 'i', opac);
        drawLetter(stage, 2, 'o', opac);
        drawLetter(stage, 3, 'p', opac);
        drawLetter(stage, 4, 'k', opac);
        drawLetter(stage, 5, 'l', opac);
        drawLetter(stage, 6, ';', opac);
        drawLetter(stage, 7, ',', opac);
        drawLetter(stage, 8, '.', opac);
        drawLetter(stage, 9, '/', opac);
    }
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function getX(num) {
        return ((num-1) % 3) * csv + (csv/2);
    };
    function getY(num) {
        return Math.floor((num-1)/3) * csv + (csv/2);
    };
    function getSmallX(num) {
        return ((num-1) % 3) * scsv + (scsv/2);
    };
    function getSmallY(num) {
        return Math.floor((num-1)/3) * scsv + (scsv/2);
    };
    
    
    ritual.summonMonster = function summonMonster(wiz) {
        wiz.monsterStage.removeAllChildren();
        if (wiz.strength > 1) {
            var monsterName = "monster" + Math.floor(wiz.strength / 2) +
                wiz.monsterSuffix + ".gif";
            console.log(monsterName)
            var monster = new createjs.Bitmap(monsterName);
            var circle = new createjs.Shape.circle.graphics.setStrokeStyle(2).drawCircle(0, 0, i * 2);
            
            wiz.monsterStage.addChild(monster);
        }
        wiz.monsterStage.update();
    }
    
}());

