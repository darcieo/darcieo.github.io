jQuery(function($){
    $(document).ready(function(){

        /*hover for descriptions*/
        $('#zombieButton').hover(function(){
            $('#zombieDescr').addClass('up');
        }, function(){
            $('#zombieDescr').removeClass('up');
        });

        $('#studentButton').hover(function(){
            $('#studentDescr').addClass('up');
        }, function(){
            $('#studentDescr').removeClass('up');
        });

        $('#nurseButton').hover(function(){
            $('#nurseDescr').addClass('up');
        }, function(){
            $('#nurseDescr').removeClass('up');
        });

        $('#officerButton').hover(function(){
            $('#officerDescr').addClass('up');
        }, function(){
            $('#officerDescr').removeClass('up');
        });

    }); 
})

//variables
var print = true;
var done = false;
var numZombie = 0;
var numStudent = 0;
var numNurse = 0;
var numofficer = 0;
var turnedNurse = 0;
var turnedofficer = 0;
var infected = 0;
var healed = 0;
var destroyed = 0;
var totalTime = 0;
var finalZombie = 0;
var finalStudent = 0;
var finalNurse = 0;
var finalofficer = 0;

//elements
var simulator = document.getElementById("simulator");
var messageDiv = document.getElementById("messageDiv");
var startStopButton = document.getElementById("startStop");
var againButton = document.getElementById("againButton");
var description = document.getElementById("description");
var statistics = document.getElementById("statistics");
var buttons = document.getElementById("buttons");
var zombieImage = '<img src="media/zombie.png"/>';
var studentImage = "<img src='media/student.png'/>";
var nurseImage = "<img src='media/nurse.png'/>";
var officerImage = "<img src='media/officer.png'/>";
var MILLISECONDS_PER_FRAME = 40;
var characterArray = [];



//character object
function Character(id, originalID, startLeft, startTop, deltaX, deltaY, antidote, health, time, div) {
    this.id = id;
    this.originalID = originalID;
    this.startLeft = startLeft;
    this.startTop = startTop;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.antidote = antidote;
    this.health = health;
    this.time = time;
    this.div = div;
}

//create zombie
function newZombie() {
    messageDiv.innerHTML = "";
    var div = document.createElement("div");
    var zombie = new Character(1, 2, getStartLeft(), getStartTop(), getDeltaX(), getDeltaY(), 0, 0, 0, div);
    characterArray.push(zombie);
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.position = "absolute";
    div.style.left = zombie.startLeft;
    div.style.top = zombie.startTop;
    div.innerHTML = '<img class ="character" id="zombie" src="media/zombie.png" />';
    simulator.appendChild(div);
    numZombie++;
}

//create student
function newStudent() {
    messageDiv.innerHTML = "";
    var div = document.createElement("div");
    var student = new Character(2, 2, getStartLeft(), getStartTop(), getDeltaX(), getDeltaY(), 0, 0, 0, div);
    characterArray.push(student);
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.position = "absolute";
    div.style.left = student.startLeft;
    div.style.top = student.startTop;
    div.innerHTML = '<img class ="character" id="student" src="media/student.png" />';
    simulator.appendChild(div);
    numStudent++;
}

//create nurse
function newNurse() {
    messageDiv.innerHTML = "";
    var div = document.createElement("div");
    var nurse = new Character(3, 3, getStartLeft(), getStartTop(), getDeltaX(), getDeltaY(), 3, 0, 0, div);
    characterArray.push(nurse);
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.position = "absolute";
    div.style.left = nurse.startLeft;
    div.style.top = nurse.startTop;
    div.innerHTML = '<div id="antidoteCount">' + nurse.antidote + '</div> <img class ="character" id="nurse" src="media/nurse.png" />';
    simulator.appendChild(div);
    numNurse++;
}

//create officer
function newOfficer() {
    messageDiv.innerHTML = "";
    var div = document.createElement("div");
    var officer = new Character(4, 4, getStartLeft(), getStartTop(), getDeltaX(), getDeltaY(), 0, 3, 0, div);
    characterArray.push(officer);
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.position = "absolute";
    div.style.left = officer.startLeft;
    var startOfficer = parseInt(officer.startTop) + 10;
    div.style.top = startOfficer + "px";
    div.innerHTML = '<div id="healthBar"><div id="health1"></div><div id="health2"></div><div id="health3"></div></div><img class ="character" id="officer" src="media/officer.png" />';
    simulator.appendChild(div);
    numofficer++;
}

//clear characters
function clearAll() {
    for (var i = characterArray.length - 1; i >= 0; i--) {
        simulator.removeChild(characterArray[i].div);
        characterArray[i].id = 5;
    }
    remove5();
    numZombie = 0;
    numStudent = 0;
    numNurse = 0;
    numofficer = 0;
    turnedNurse = 0;
    turnedofficer = 0;
    infected = 0;
    healed = 0;
    destroyed = 0;
    totalTime = 0;
    messageDiv.innerHTML = "";
    if (startStopButton.value == "STOP") {
        clearInterval(timer);
        startStopButton.value = "START";
    }
}

//x-component of slope
var getDeltaX = function () {
    var deltaX = Math.floor((Math.random() * 5) + 2);
    var dirX = Math.floor((Math.random() * 2) + 0);
    if (dirX == 0) {
        deltaX = -deltaX;
    }
    return deltaX;
}
//y component of slope
var getDeltaY = function () {
    var deltaY = Math.floor((Math.random() * 5) + 2);
    var dirY = Math.floor((Math.random() * 2) + 0);
    if (dirY == 0) {
        deltaY = -deltaY;
    }
    return deltaY;
}

//left start position
var getStartLeft = function () {
    var startLeft = Math.floor((Math.random() * 500) + 1);
    startLeft = String(startLeft) + "px";
    return startLeft;
}

//top start position
var getStartTop = function () {
    var startTop = Math.floor((Math.random() * 500) + 1);
    startTop = String(startTop) + "px";
    return startTop;
}

//start-stop movement //reference code here
function startStop() {
    if (characterArray.length == 0) {
        messageDiv.innerHTML = "Add characters!";
        messageDiv.style.color = "#60dbed";
    }
    else {
        if (startStopButton.value == "START") {
            timer = setInterval(move, 40);
            startStopButton.value = "STOP"
        } else {
            clearInterval(timer);
            startStopButton.value = "START";
        }
    }
}

//check if done
var checkDone = function () {
    var allZombie = true;
    var noZombie = true;
    while (allZombie == true) {
        for (var i = 0; i < characterArray.length; i++) {
            if (characterArray[i].id == 1 | characterArray[i].id == 5) {
                allZombie = true;
            }
            else {
                allZombie = false;
                while (noZombie == true) {
                    for (var i = 0; i < characterArray.length; i++) {
                        if (characterArray[i].id != 1) {
                            noZombie = true;
                        } else {
                            noZombie = false;
                            break;
                        }
                    }
                    break;
                }
                break;
            }
        }
        break;
    }
    if (allZombie == true) {
        messageDiv.innerHTML = '<h2 style="font-size:50px;">Zombies Win!</h2>';
        messageDiv.style.color = "#fa2b74";
        return true;
    }
    else if (noZombie == true) {
        messageDiv.innerHTML = '<h2 style="font-size:50px;">Humans Win!</h2>';
        messageDiv.style.color = "#7bcc4c";
        return true;
    }
    else { return false }
}

//move function
var move = function () {
    if (checkDone() == true) {
        while (print == true) {
            printStats();
            print = false;
        }
    }
    else {
        infect();
        heal();
        destroy();
        grow();
        remove5();
        totalTime += 0.04;
    }
    for (var i = 0; i < characterArray.length; i++) {
        var character = characterArray[i].div;
        var deltaX = characterArray[i].deltaX
        var deltaY = characterArray[i].deltaY

        var x = parseInt(character.style.left) + deltaX;
        if (x < 0 || x > 510) {
            characterArray[i].deltaX = -deltaX;
        }
        else {
            character.style.left = x + "px";
        }

        var y = parseInt(character.style.top) + deltaY;
        if (y < 0 || y > 510) {
            characterArray[i].deltaY = -deltaY;
        }
        else {
            character.style.top = y + "px";
        }
    }
};

//print final statistics
function printStats() {
    buttons.style.display = "none";
    description.style.display = "none";
    againButton.style.display = "inline";
    startStopButton.style.display = "none"
    statistics.innerHTML = '<h2>Stats</h2><ul id="statList"></ul>'
    var statList = document.getElementById("statList")

    for (var i = 0; i < characterArray.length; i++) {
        switch (characterArray[i].id) {
            case 1:
                finalZombie++;
                break;
            case 2:
                finalStudent++;
                break;
            case 3:
                finalNurse++;
                break;
            default:
                finalofficer++;
                break;
        }
    }

    var listItem = document.createElement("LI");
    listItem.innerHTML = 'Started with: ' + numZombie + ' <img src="media/zombie.png" />' + numStudent + ' <img src="media/student.png" /> ' + numNurse + ' <img src="media/nurse.png" /> ' + numofficer + ' <img src="media/officer.png" />';
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = "Time elapsed: " + totalTime.toFixed(0) + " seconds";
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = "Characters infected: " + infected;
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = "Zombies healed: " + healed;
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = "Zombies destroyed: " + destroyed;
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = "Students turned to Nurses: " + turnedNurse;
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = "Students turned to officers: " + turnedofficer;
    statList.appendChild(listItem);

    var listItem = document.createElement("LI");
    listItem.innerHTML = 'Ended with: ' + finalZombie + ' <img src="media/zombie.png" />' + finalStudent + ' <img src="media/student.png" /> ' + finalNurse + ' <img src="media/nurse.png" /> ' + finalofficer + ' <img src="media/officer.png" />';
    statList.appendChild(listItem);
}

//zombie-student-collision
var infect = function () {
    for (var i = 0; i < characterArray.length; i++) {
        if (characterArray[i].id == 1) {
            var character = characterArray[i].div;
            var x = parseInt(character.style.left)
            var y = parseInt(character.style.top)

            for (var j = 0; j < characterArray.length; j++) {
                if (characterArray[j].id == 2) {
                    var character2 = characterArray[j].div;
                    var x2 = parseInt(character2.style.left)
                    var y2 = parseInt(character2.style.top)

                    if (x <= x2 & x2 <= (x + 40) & y <= y2 & y2 <= (y + 40) |
                        x2 <= x & x <= (x2 + 40) & y2 <= y & y <= (y2 + 40)) {
                        character2.innerHTML = '<img class ="character" id="zombie" src="media/zombie.png" />';
                        characterArray[j].id = 1;
                        infected++;
                    }
                }
            }
        }
    }
}

//zombie-nurse-collision   
var heal = function () {
    for (var i = 0; i < characterArray.length; i++) {
        if (characterArray[i].id == 1) {
            var character = characterArray[i].div;
            var x = parseInt(character.style.left)
            var y = parseInt(character.style.top)

            for (var j = 0; j < characterArray.length; j++) {
                if (characterArray[j].id == 3) {
                    var character2 = characterArray[j].div;
                    var x2 = parseInt(character2.style.left)
                    var y2 = parseInt(character2.style.top)

                    if (x <= x2 & x2 <= (x + 40) & y <= y2 & y2 <= (y + 40) |
                        x2 <= x & x <= (x2 + 40) & y2 <= y & y <= (y2 + 40)) {
                        if (characterArray[j].antidote != 0) {;
                            characterArray[i].id = characterArray[i].originalID;

                            switch (characterArray[i].id) {
                                case 4:
                                    character.innerHTML = '<div id="healthBar"><div id="health1"></div><div id="health2"></div><div id="health3"></div></div><img class ="character" id="officer" src="media/officer.png" />';
                                    characterArray[i].health = 3;
                                    break;
                                case 3:
                                    character.innerHTML = '<div id="antidoteCount">' + characterArray[i].antidote + '</div> <img class ="character" id="nurse" src="media/nurse.png" />';
                                    characterArray[i].antidote = 3;
                                    break;
                                default:
                                    character.innerHTML = '<img class ="character" id="student" src="media/student.png" />'
                            }
                            character2.innerHTML = '<div id="antidoteCount">' + --characterArray[j].antidote + '</div> <img class ="character" id="nurse" src="media/nurse.png" />';
                            healed++;
                        }
                        else {
                            character2.innerHTML = '<img class ="character" id="zombie" src="media/zombie.png" />';
                            characterArray[j].id = 1;
                            infected++;
                        }
                    }
                }
            }
        }
    }
}

//zombie-officer-collision  
var destroy = function () {
    for (var i = 0; i < characterArray.length; i++) {
        if (characterArray[i].id == 1) {
            var character = characterArray[i].div;
            var x = parseInt(character.style.left)
            var y = parseInt(character.style.top)

            for (var j = 0; j < characterArray.length; j++) {
                if (characterArray[j].id == 4) {
                    var character2 = characterArray[j].div;
                    var x2 = parseInt(character2.style.left)
                    var y2 = parseInt(character2.style.top)

                    if (x <= x2 & x2 <= (x + 40) & y <= y2 & y2 <= (y + 40) |
                        x2 <= x & x <= (x2 + 40) & y2 <= y & y <= (y2 + 40)) {
                        if (characterArray[j].health != 0) {
                            character.style.display = "none";
                            characterArray[i].id = 5;
                            destroyed++;

                            switch (characterArray[j].health) {
                                case 3:
                                    character2.innerHTML = '<div id="healthBar"><div id="health1"></div><div id="health2"></div></div><img class ="character" id="officer" src="media/officer.png" />';
                                    characterArray[j].health--;
                                    break;
                                case 2:
                                    character2.innerHTML = '<div id="healthBar"><div id="health1"></div></div><img class ="character" id="officer" src="media/officer.png" />';
                                    characterArray[j].health--;
                                    break;
                                default:
                                    character2.innerHTML = '<div id="healthBar"></div><img class ="character" id="officer" src="media/officer.png" />';
                                    characterArray[j].health--;
                            }
                        }
                        else {
                            character2.innerHTML = '<img class ="character" id="zombie" src="media/zombie.png" />';
                            characterArray[j].id = 1;
                            infected++;
                        }
                    }
                }
            }
        }
    }
}

//student-grow
var grow = function () {
    for (var i = 0; i < characterArray.length; i++) {
        if (characterArray[i].id == 2) {
            var character = characterArray[i].div;
            characterArray[i].time += 0.04;
            if (characterArray[i].time > 5) {
                var random = Math.floor((Math.random() * 2) + 0);
                if (random == 0) {
                    characterArray[i].id = 3;
                    characterArray[i].originalID = 3;
                    characterArray[i].antidote = 3;
                    characterArray[i].time = 0;
                    character.innerHTML = '<div id="antidoteCount">' + characterArray[i].antidote + '</div> <img class ="character" id="nurse" src="media/nurse.png" />';
                    turnedNurse++;
                }
                else {
                    characterArray[i].id = 4;
                    characterArray[i].originalID = 4;
                    characterArray[i].health = 3;
                    characterArray[i].time = 0;
                    character.innerHTML = '<div id="healthBar"><div id="health1"></div><div id="health2"></div><div id="health3"></div></div><img class ="character" id="officer" src="media/officer.png" />';
                    turnedofficer++;
                }
            }
        }
    }
}

var remove5 = function () {
    var removeThis = [];
    var counter = 0;
    for (var i = 0; i < characterArray.length; i++) {
        if (characterArray[i].id == 5) {
            removeThis.push(i)
        }
    }
    for (var r = 0; r < removeThis.length; r++) {
        var rValue = removeThis[r]
        rValue += counter;
        counter--;
        characterArray.splice(rValue, 1);
    }
}