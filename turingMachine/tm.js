$( document ).ready(function() {
/******************************************* bootstrap tabs *******************************************/
    $('#myTab a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
/******************************************* validation *******************************************/
    var validFile = false;
    var validWord = false;
    var run = false;
    var line = '';

    //file change start
    $('#userFile').change(function(){
        //get file
        var file = this.files[0];
        var fileName = file.name;
        var fileExtension = fileName.replace(/^.*\./, '');
        //check for .txt extension
        if (fileExtension != 'txt'){
        	$('#fileError').html('file extension must be .txt');
            $('#fileError').addClass('show');
            $('#fileArrow').addClass('show');
            $('#submitButton').removeClass('ready');
            validFile = false;
        }
        else{
            //read file
            $('#fileError').removeClass('show');
            $('#fileArrow').removeClass('show');
            validFile = true;
            var reader = new FileReader();
            reader.onload = function(){
                line = reader.result.split('\n');
            };
            reader.readAsText(file);
        }
        //remove previous
        $('#states').removeClass('display');
        $('#states').children('p').remove();
        $('#errorBox').removeClass('show');
        $('#errorBox').children('p').remove();
    });
    //file change end

    //word change start
    $('#userWord').keypress(function(){
        $('#wordError').removeClass('show');
        $('#wordArrow').removeClass('show');
        if (validFile == true){
            $('#submitButton').addClass('ready');
        }
        //remove previous
        validWord = false;
        $('#states').removeClass('display');
        $('#states').children('p').remove();
        $('#errorBox').removeClass('show');
        $('#errorBox').children('p').remove();
    });
    //word change start

    //submit hover start
    $('#submitButton').mouseover(function(){
        //check for no file
        if($('#userFile').val() == ''){
            $('#fileError').html('Please choose a file');
            $('#fileError').addClass('show');
            $('#fileArrow').addClass('show');
            validFile = false;
        }
        //check for no word
        if($('#userWord').val() == ''){
            $('#wordError').addClass('show');
            $('#wordArrow').addClass('show');
            $('#submitButton').removeClass('ready');
            validWord = false;
        }
        else{
          	validWord = true;
        }
        if(validWord == true & validFile == true){
            $('#submitButton').addClass('ready');
            run = true;
        }
    });
    //submit hover end
/******************************************* parse *******************************************/
    $('#submitButton').click(function(){
        if(run == true) {
            var input = $('#userWord').val();
            input += '_';
            var counter = 0;
            var statesArray = [];
            var current;
            var accept;
            var reject;
            var alphaArray = [];
            var tapeArray = [];
            var transitionArray = [];
            var validConfig = false;
            var match = false;
            var printItem;
            var tracker;

            //clear input
            $('#submitButton').removeClass('ready');
            $('#userFile').val('');
            $('#userWord').val('');
            validFile = false;
            validWord = false;
            run = false;

            //transition object
            function Transition (curState, read, write, nextState, move){
                this.curState = curState;
                this.read = read;
                this.write = write;
                this.nextState = nextState;
                this.move = move;
            }

            //replace at function
            String.prototype.replaceAt=function(index, character) {
                return this.substr(0, index) + character + this.substr(index+character.length);
            }

            //error message function
            errorMessage = function(message){
                $('#errorBox').addClass('show');
                $('<p>' + message + '</p>').appendTo('#errorBox');
                run = false;
            }

            //splice and print function
            splicePrint = function(printItem){
                printItem = printItem.split('_')[0];
                $('<p>' + printItem + '</p>').appendTo('#states');
                match = true;
            }

            //loop through lines start
            for(var i = 0; i < line.length; i++){

                //replace and split into words
                line[i] = line[i].replace(/;/g, ' scEnd ');
                line[i] = line[i].replace(/}/g, ' cbEnd ');
                line[i] = line[i].replace(/--/, ';');
                line[i] = line[i].split(';')[0]
                var word = line[i].split(/\s|,/);

                //validate algorithm     
                if(validConfig == true){
                    var endIndex = word.indexOf('scEnd');
                    if (line[i] == ''){}
                        else if (endIndex == -1){
                            errorMessage('all commands must end with a semicolon');
                            break;
                        }
                        else {
                            for(var k = (endIndex+1); k<word.length; k++){
                                if(word[k] != ''){
                                    errorMessage('only comments can occur after a semicolon');
                                    break;
                                }
                            }
                        }
                        if(word[0] == 'rwRt'){
                            if(statesArray.indexOf(word[1]) != -1 & tapeArray.indexOf(word[2]) != -1  & tapeArray.indexOf(word[3]) != -1 & statesArray.indexOf(word[4]) != -1 & word[5] == 'scEnd'){
                                var transition = new Transition(word[1], word[2], word[3], word[4], 0);
                                transitionArray.push(transition);
                            }
                            else{
                                errorMessage('invalid rwRt command');
                                break;
                            }
                        }
                        else if(word[0] == 'rwLt'){
                            if(statesArray.indexOf(word[1]) != -1 & tapeArray.indexOf(word[2]) != -1  & tapeArray.indexOf(word[3]) != -1 & statesArray.indexOf(word[4]) != -1 & word[5] == 'scEnd'){    
                                var transition = new Transition(word[1], word[2], word[3], word[4], -2);
                                transitionArray.push(transition);
                            }
                            else{
                                errorMessage('invalid rwLt command');
                                break; 
                            }
                        }
                        else if(word[0] == 'rRl'){
                            if(statesArray.indexOf(word[1]) != -1 & tapeArray.indexOf(word[2]) != -1 & word[3] == 'scEnd'){    
                                var transition = new Transition(word[1], word[2], word[2], word[1], 0);
                                transitionArray.push(transition);
                            }
                            else{
                                errorMessage('invalid rRl command');
                                break; 
                            }
                        }
                        else if(word[0] == 'rLl'){
                            if(statesArray.indexOf(word[1]) != -1 & tapeArray.indexOf(word[2]) != -1 & word[3] == 'scEnd'){ 
                                var transition = new Transition(word[1], word[2], word[2], word[1], -2);
                                transitionArray.push(transition);
                            }
                            else{
                                errorMessage('invalid rLl command');
                                break; 
                            }
                        }
                        else if(word[0] == 'rRt'){
                            if(statesArray.indexOf(word[1]) != -1 & tapeArray.indexOf(word[2]) != -1  & statesArray.indexOf(word[3]) != -1 & word[4] == 'scEnd'){
                                var transition = new Transition(word[1], word[2], word[2], word[3], 0);
                                transitionArray.push(transition);
                            }
                            else{
                                errorMessage('invalid rRt command');
                                break; 
                            }
                        }
                        else if(word[0] == 'rLt'){
                            if(statesArray.indexOf(word[1]) != -1 & tapeArray.indexOf(word[2]) != -1  & statesArray.indexOf(word[3]) != -1 & word[4] == 'scEnd'){
                                var transition = new Transition(word[1], word[2], word[2], word[3], -2);
                                transitionArray.push(transition);
                            }
                            else{
                                errorMessage('invalid rLt command');
                                break; 
                            }
                        }
                        else if (line[i] == ''){}
                            else{
                                errorMessage(word[0] + '  is not a valid command');
                                break;
                            }
                        }       
                //validate initialization
                else{

                    //commment validation
                    if (line[i] == ''){
                        counter++;
                    }
                    //states validation
                    else if (word[0] == '{states:' & i == (0+counter)){
                        run = true;
                        var cbBool = false;
                        for(var j = 1; j < word.length; j++){
                            if(cbBool == false){
                                if (word[j] == 'cbEnd'){
                                    cbBool = true;
                                }
                                else if (word[j] == 'scEnd'){
                                    errorMessage('cannot have semicolon in states initialization');
                                    break;
                                }
                                else if (word[j] == ''){
                                    errorMessage('invalid states initialization');
                                    break;
                                }
                                else{
                                    statesArray.push(word[j]);
                                }
                            }
                            else{
                                if (word[j] != ''){
                                    errorMessage('only comments can occur after a closed bracket');
                                    break;
                                }
                            }
                        }
                        if (run == false){
                            break;
                        }
                        else if (statesArray.length == 0){
                            errorMessage('must initialize states');
                            break;
                        }
                    }

                    //start state validation
                    else if(word[0] == '{start:' & i == (1+counter) & run == true){
                        if(word.length != 5 | word[2] != 'cbEnd' | word[3]!='' | word[4]!=''){
                            errorMessage('invalid start state');
                            break;
                        }
                        else if(statesArray.indexOf(word[1]) == -1){
                            errorMessage('start state must be an element of states');
                            break;
                        }
                        else{
                            current = word[1];
                        }
                    }

                    //accept state validation
                    else if(word[0] == '{accept:' & i == (2+counter) & run == true){
                        if(word.length != 5 | word[2] != 'cbEnd' | word[3]!='' | word[4]!=''){
                            errorMessage('invalid accept state');
                            break;
                        }
                        else if(statesArray.indexOf(word[1]) == -1){
                            errorMessage('accpet state must be an element of states');
                            break;
                        }
                        else{
                            accept = word[1];
                        }
                    }

                    //reject state validation
                    else if(word[0] == '{reject:' & i == (3+counter) & run == true){
                        if(word.length != 5 | word[2] != 'cbEnd' | word[3]!='' | word[4]!=''){
                            errorMessage('invalid reject state');
                            break;
                        }
                        else if(statesArray.indexOf(word[1]) == -1){
                            errorMessage('reject state must be an element of states');
                            break;
                        }
                        else{
                            reject = word[1];
                        }
                        if (accept == reject){
                            errorMessage('accept state and reject state must be unique');
                            break;
                        }
                    }

                    //alphabet validation
                    else if (word[0] == '{alpha:' & i == (4+counter) & run == true){
                        var cbBool = false;
                        for(var j = 1; j < word.length; j++){
                            if(cbBool == false){
                                if (word[j] == 'cbEnd'){
                                    cbBool = true;
                                }
                                else if (word[j] == 'scEnd'){
                                    errorMessage('cannot have semicolon in alphabet initialization');
                                    break;
                                }
                                else if (word[j] == ''){
                                    errorMessage('invalid alphabet initialization');
                                    break;
                                }
                                else{
                                    alphaArray.push(word[j]);
                                }
                            }
                            else{
                                if (word[j] != ''){
                                    errorMessage('only comments can occur after a closed bracket');
                                    break;
                                }
                            }
                        }
                        if (run == false){
                            break;
                        }
                        else if (alphaArray.length == 0){
                            errorMessage('must initialize alphabet');
                            break;
                        }
                        for(var j = 0; j<input.length; j++){
                            if(alphaArray.indexOf(input[j]) == -1){
                                if(input[j] != '_'){
                                    errorMessage('word contains symbol(s) not found in alphabet');
                                    break;
                                }
                            }
                        }
                        if (run == false){
                            break;
                        }
                    }

                    //tape-alphabet validation
                    else if (word[0] == '{tape-alpha:' & i == (5+counter) & run == true){
                        var cbBool = false;
                        for(var j = 1; j < word.length; j++){
                            if(cbBool == false){
                                if (word[j] == 'cbEnd'){
                                    cbBool = true;
                                }
                                else if (word[j] == 'scEnd'){
                                    errorMessage('cannot have semicolon in tape-alphabet initialization');
                                    break;
                                }
                                else if (word[j] == ''){
                                    alert(word + " " + word[j]);
                                    errorMessage('invalid tape-alphabet initialization');
                                    break;
                                }
                                else{
                                    tapeArray.push(word[j]);
                                }
                            }
                            else{
                                if (word[j] != ''){
                                    errorMessage('only comments can occur after a closed bracket');
                                    break;
                                }
                            }
                        }
                        if (run == false){
                            break;
                        }
                        for(var j = 0; j<alphaArray.length; j++){
                            if(tapeArray.indexOf(alphaArray[j]) == -1){
                                errorMessage('tape-alphabet must include all alphabet symbols');
                                break;
                            }
                        }
                        if (run == false){
                            break;
                        }
                        if (tapeArray.length == 0){
                            errorMessage('must have tape alphabet in configuration section of program');
                            break;
                        }
                        else if(tapeArray.indexOf('_') == -1){
                            errorMessage('tape-alphabet must contain empty symbol: _');
                            break; 
                        }
                        else{
                            validConfig = true;
                        }
                    }
                    else{
                        errorMessage('invalid initialization');
                        break;
                    }
                }
            }
            //loop through lines end

            //determinism validatoin
            if(run == true){
                for (var i = 0; i < transitionArray.length; i++){
                    for(var j = 0; j < transitionArray.length; j++){
                        if(i != j){
                            if(transitionArray[i].curState == transitionArray[j].curState & transitionArray[i].read == transitionArray[j].read){
                                errorMessage('Turing machine must be derterministic');
                                break;
                            }
                        }
                    }
                    if (run == false){
                        break;
                    }
                }
            }          
/******************************************* run *******************************************/
            if(run == true){
                $('#states').addClass('display');
                for (var i = 0; i < input.length; i++){
                    match = false;
                    for(var j = 0; j < transitionArray.length; j++){
                        if(current == transitionArray[j].curState & input[i] == transitionArray[j].read){
                            if(i == 0){
                                printItem = ('[' + current + ']' + input)
                                splicePrint(printItem);
                            }
                            else{
                                printItem = (input.substr(0,i) + '[' + current + ']' + input.substr(i, input.length))
                                splicePrint(printItem);
                            }
                            current = transitionArray[j].nextState;
                            var newInput = transitionArray[j].write;
                            input = input.replaceAt(i, newInput);
                            i = i + transitionArray[j].move;
                            //if leftmost tape position
                            if (i < 0){
                                i = -1;
                            }
                            break;
                        }
                    }//end for
                    if(match == false){
                        printItem = (input.substr(0,i) + '[' + current + ']' + input.substr(i, input.length))
                        splicePrint(printItem);
                        if(input[i] == '_'){
                            printItem = ('Reject: Word does not end in accept state');
                        }
                        else{
                            printItem = ('Reject: No valid transition');
                        }
                        splicePrint(printItem);
                        i=input.length;
                    }
                    tracker = i;
                }//end for

                var count  = 0;
                while(match == true){
                    input += '_';
                    i=tracker;
                    match = false;
                    for(var j = 0; j < transitionArray.length; j++){
                        if(current == transitionArray[j].curState & input[i] == transitionArray[j].read){
                            if(i == 0){
                                printItem = ('[' + current + ']' + input)
                                $('<p>' + printItem + '</p>').appendTo('#states');
                                match = true;
                            }
                            else{
                                printItem = (input.substr(0,i) + '[' + current + ']' + input.substr(i, input.length))
                                $('<p>' + printItem + '</p>').appendTo('#states');
                                match = true;
                            }
                            current = transitionArray[j].nextState;
                            var newInput = transitionArray[j].write;
                            input = input.replaceAt(i, newInput);
                            i = i + transitionArray[j].move;
                            tracker = ++i;
                            //if leftmost tape position
                            if (i < 0){
                                i = -1;
                            }
                            break;
                        }
                    }//end for
                    count ++;
                    if(count == 300){
                        alert('Your algorithm has created an infinite loop. Program will quit to prevent browser from crashing.');
                        break;
                    }
                }//end while

                if(current == accept){
                    //no splice
                    var printItem = ('Accept: ' + input.substr(0,(i-1)) + '[' + current + ']' + input.substr(i, input.length));
                    $('<p>' + printItem + '</p>').appendTo('#states'); 
                }
                else if(current == reject){
                    //no splice
                    var printItem = ('Reject: ' + input.substr(0,(i-1)) + '[' + current + ']' + input.substr(i, input.length))
                    $('<p>' + printItem + '</p>').appendTo('#states');
                }
                else{
                    var printItem = ('Reject: ' + input.substr(0,(i-1)) + '[' + current + ']' + input.substr(i, input.length))
                    $('<p>' + printItem + '</p>').appendTo('#states');
                        
                }
                run = false;
            }//if run
        }//if run
    });
    //submit click end
});
//document ready