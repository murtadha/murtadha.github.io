$(document).ready(function () {
    // required for diagnostic clipboard
    var clipboard = new ClipboardJS('.btn');
    var resizeMap = function (event) {
        var width = Math.min($("#networm-map-container").width(), 1040);
        $(".network-map").css("width", width)
        $(".network-map").css("height", width / 1.677506775067751);
    };
    resizeMap();
    setInterval(resizeMap, 200);
});

var renderDiagnosticResultMap = function (zoneCode, latitude, longitude) {
    $("#" + zoneCode + "-pin").append(
        $('<img id="active-pin" style="position: absolute; z-index: 100; top: 111px;; left: 132px; width: 40px;" src="https://bunnycdn.b-cdn.net/assets/landingpage/images/favicon.png" />')
    );

    var Rad2Deb = 180 / Math.PI;
    var Pi4 = Math.PI / 4;
    function geoToPixel(latitude, longitude) {
        // Calculate the effective map size
        var mapWidth = $(".network-map").width() * 1.049821961510754;
        var mapHeight = mapWidth;

        var marginLeft = (($(".network-map").width() * 1.118) - $(".network-map").width()) / 2;
        var marginTop = (($(".network-map").height() * 1.47) - $(".network-map").height()) / 2;

        var x = (mapWidth / 2) + ((longitude / 360) * mapWidth);
        var y = (Math.log(Math.tan((latitude / 90 + 1) * Pi4)) * Rad2Deb) / 180;
        y = (mapHeight / 2) - (y * mapHeight / 2);

        return { "x": (x - marginLeft - 10), "y": (y - marginTop - 40) };
    }

    var userLocation = geoToPixel(latitude, longitude);
    $(".network-map").append('<div style="text-shadow: 0px 0px 10px #f2f2f2; position: absolute; color: #ea6161; width: 14px; z-index: 100; height: 14px; left: ' + userLocation.x + 'px; top: ' + userLocation.y + 'px; font-size: 32px;"><i class="fa fa-male"></i></div>');



    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.canvas.width = $(".network-map").width();
    ctx.canvas.height = $(".network-map").height();


    function DrawCurve(canvas, lineStartX, lineStartY, targetX, targetY, color) {
        var horizontalWidthDiff = Math.abs(targetX - lineStartX);
        var curveX1 = lineStartX + (horizontalWidthDiff / 4);
        var curveX2 = lineStartX + (horizontalWidthDiff / 2);
        if (lineStartX > targetX) {

            horizontalWidthDiff = horizontalWidthDiff * -1;
            curveX1 = lineStartX + (horizontalWidthDiff / 4);
            curveX2 = lineStartX + (horizontalWidthDiff / 2);
        }

        canvas.beginPath();
        canvas.moveTo(lineStartX, lineStartY);
        canvas.strokeStyle = color;
        canvas.lineWidth = 3;

        var curveSize = 25;
        var totalDiff = Math.abs(lineStartX - targetX) + Math.abs(lineStartY - targetY);
        if (totalDiff < 75) {
            curveSize = 0;
        }

        canvas.bezierCurveTo(
            curveX1, targetY - curveSize,
            curveX2, targetY - curveSize,

            targetX,
            targetY);
        canvas.stroke();
    }

    DrawCurve(
        ctx,
        userLocation.x + 7,
        userLocation.y + 30,
        $('#active-pin').parent().position().left,  // targetX
        $('#active-pin').parent().position().top,   // targetY
        "#ea6161");
}