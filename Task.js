const {v4} = require('uuid');

exports.Task =  class Task{

    constructor(line) {
        this.resultValue = null;
        this.pId = '['+v4().substring(0,8)+']';
        this.command = line.split(" ");
        this.taskedCommand = [];
    } 

    shiftCommand() {
        let head =  this.command.shift();
        this.taskedCommand.push(head);
        return head;
    }
}
