/**
 * 
 * @param String elem ID name of canvas element
 * @param int width  Width of graphic
 * @param int height Height of graphic
 * @returns Gantt
 */
function Gantt(elem, width, height) {

    var canvas = document.getElementById(elem);
    canvas.width = width;
    canvas.height = height;
    var width;

    /**
     * Build the grid of graphic
     * @param int space Space of each line
     * @param String color Color of lines grid in Hexa
     * @returns Gantt
     */
    this.buildGrid = function(space, color) {
        var context = canvas.getContext('2d');

        context.strokeStyle = color;
        context.lineHeight = 1;

        context.beginPath();
        context.moveTo(0, 10);

        for (var i = space; i < canvas.width; i += space) {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(canvas.width, i);
            context.stroke();
            context.closePath();
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, canvas.width);
            context.stroke();
            context.closePath();
        }

        context.stroke();
        return this;
    };
    /**
     * Build One Rect for a task
     * @param int x Position X
     * @param int y Position Y
     * @param int width Width of task
     * @param String color Color os task in HEXA
     * @param String text Name task for display
     * @returns Gantt
     */
    this.buildRect = function(x, y, width, color, text) {
        var context = canvas.getContext('2d');
        context.strokeStyle = color;
        this.width = width;
        context.strokeRect(x, y, width, 10);
        context.fillText(text, x, y + 10);
        return this;
    };
    /**
     * Build line between 2 tasks
     * @param json init Initial position of line on json {x:int,y:int}
     * @param json end Finish position of line on json {x:int,y:int}
     * @returns Gantt
     */
    this.buildLine = function(init, end) {
        var context = canvas.getContext('2d');

        context.strokeStyle = '#000';
        context.lineHeight = 1;
        context.beginPath();
        context.moveTo(init.x + this.width, init.y + 5);
        context.lineTo(end.x, end.y + 5);
        context.stroke();
        context.closePath();

        context.stroke();
        return this;
    };
}