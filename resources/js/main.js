var GR_WIDTH = window.innerWidth;
var GR_HEIGHT = window.innerHeight;

MAX_POINTS = initMaxPoints();
POINT_SPEED = 4;
POINT_SIZE = 2;

var canvas = null;
var ctx = null;
var points = [];


var NEAR_POINT_LENGTH = 50;
var TICK_TIME = 50;

function drawBackground() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPoints() {
   toDelete = [];
   points.forEach(function(p) {
        p.move();
        if (p.isLeave()) {
            if (points.length > MAX_POINTS) {
                toDelete = toDelete.concat(p);
            } else {
                p.refresh();
            }
        } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, POINT_SIZE, 0, 2 * Math.PI);
            ctx.fill();
            drawNearLines(p);
        }
   });
   clearLeavePoints(points, toDelete);
}

function clearLeavePoints(array,toDelete) {
    toDelete.forEach(function(p) {
        var index = array.indexOf(p);
        if (index > -1) {
          array.splice(index, 1);
        }
    });
}

function drawNearLines(p) {
    nearPoints = findNearPoints(p);
    nearPoints.forEach(function(n) {
        var gradient = ctx.createLinearGradient(p.x, p.y, n.x, n.y);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, n.color);
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
    });
}

function findNearPoints(center) {
    nearPoint = [];
    points.forEach(function(p) {
        if (p.x < center.x + NEAR_POINT_LENGTH && p.x > center.x - NEAR_POINT_LENGTH && p.y < center.y + NEAR_POINT_LENGTH && p.y > center.y - NEAR_POINT_LENGTH) {
            nearPoint = nearPoint.concat(p);
        }
    });
    return nearPoint;
}

function drawGraph() {
    drawBackground();
    createPoints();
    drawPoints();
}


function main() {
    window.setInterval(function(){
        resize();
        drawGraph();
    },TICK_TIME);
}

function resize() {
    GR_WIDTH = window.innerWidth;
    GR_HEIGHT = window.innerHeight;
    MAX_POINTS = initMaxPoints();
    canvas.width = GR_WIDTH;
    canvas.height = GR_HEIGHT;
    canvas.style.width = GR_WIDTH + 'px';
    canvas.style.height = GR_HEIGHT + 'px';
}

function init() {
    canvas = document.getElementById("gr_canvas");
    ctx = canvas.getContext("2d");
    main();
}

function createPoints() {
    while(points.length < MAX_POINTS) {
        points = points.concat(createPoint());
    }
}

function createPoint() {
    var p = new Object();
    p.x = randomX();
    p.y = randomY();
    p.color = randomColor();
    p.vectorX = Math.trunc(Math.floor(Math.random() * 360));
    p.vectorY = Math.trunc(Math.floor(Math.random() * 360));
    p.speed = Math.trunc(Math.floor(Math.random() * POINT_SPEED + 2));
    p.move=function(){
        this.x += this.speed * Math.cos(this.vectorX);
        this.y += this.speed * Math.sin(this.vectorY);
    };
    p.refresh=function() {
        p.x = randomX();
        p.y = randomY();
        p.color = randomColor();
        p.vectorX = Math.trunc(Math.floor(Math.random() * 360));
        p.vectorY = Math.trunc(Math.floor(Math.random() * 360));
        p.speed = Math.trunc(Math.floor(Math.random() * POINT_SPEED + 2));
    };
    p.isLeave=function(){
        return this.x < 0 || this.x > GR_WIDTH || this.y < 0 || this.y > GR_HEIGHT;
    };
    return p;
}

function randomColor() {
    return "rgb("
    + Math.trunc(Math.floor(Math.random() * 255)) + ", "
    + Math.trunc(Math.floor(Math.random() * 255)) + ", "
    + Math.trunc(Math.floor(Math.random() * 255)) + ")";
}

function randomX() {
    return Math.trunc(Math.floor(Math.random() * GR_WIDTH));
}

function randomY() {
    return Math.trunc(Math.floor(Math.random() * GR_HEIGHT));
}

function initMaxPoints() {
    return Math.min(GR_WIDTH * GR_HEIGHT / 2000, 500);
}

$(function() {
    init();
});

$( window ).resize(function() {
    resize();
    drawGraph();
});

