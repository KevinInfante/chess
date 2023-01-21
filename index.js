/*
ROADMAP  1/10/23
✔grid implemented
✔objects implemented
✔have a function that changes the coordinates of the pieces, and updates the grid
✔incorporate input from the user
   -caveat here, I removed the 'piece' parameter from MovePiece(). This may make 
   things weird, as this is not how I implemeneted it in the other project.
   I should consider something like a "findPiece" function that takes the for
   loop with the coordinates and returns the Piece assocate with them.
✔I think I should go ahead an try to implement the html and css, before doing
  the valid moves
✔incorporate the logic of the "valid moves" for each piece
    I'm thinking that getValidMoves could a function, or method function of Piece,
    that returns an array of the (coordinates of) valid moves.
    -this function will be triggered when the first position is clicked (or
    after reading the coordinates of the first input), then the second pair of
    coordinates will be searched for in the array of valid moves.
*note: I haven't implemented en passent, or castling, or king not moving into check
✔implement turn
✔implement captures (should do this before valid moves?)
✔implement game end once king is captured
1/20/23

✔consider: make it so log and turn don't get updated when editor mode is on
-implement checks
-implement responsive screen size
-implement better ui, that explains how to play

*/
var col1, col2, row1, row2;
var clicks = 0;
var turnNum =1;
var turn="white";
var currPiece;
var log="";
var editorMode=false;
var AImode=false;
var gameover=false;
var grid = [
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[]
];
//the loop below temporary, should be unnecessary later
for(i=0; i<8; i++){
	grid[0][0] = grid[0][7] = grid[7][0] = grid[7][7] = 'R';
        grid[0][1] = grid[0][6] = grid[7][1] = grid[7][6] = '7';
        grid[0][2] = grid[0][5] = grid[7][2] = grid[7][5] = '^';
        grid[0][3] = grid[7][3] = 'W';
        grid[0][4] = grid[7][4] = 't';
        if (i == 1 || i == 6) {
            for ( j = 0; j < 8; j++) {
                grid[i][j] = 'i';
            }
        }
        if (i > 1 && i < 6) {
            for ( j = 0; j < 8; j++) {
                grid[i][j] = '_';
            }
        }
}
console.log(grid);

//contructor
function Piece(color, name, icon, rows, cols){
    this.color = color;
    this.name= name;
    this.icon = icon;
    this.rows =rows;
    this.cols = cols;
    this.vMoves = []; //"valid moves"
    this.highlight=false;
}
//note: the first index is row (from top) second index is column (from left)

var aPawn = new Piece("white", "Pawn", "i", 6, 0);
var bPawn = new Piece("white", "Pawn", "i", 6, 1);//
var cPawn= new Piece("white", "Pawn", 'i', 6, 2);
var dPawn= new Piece("white", "Pawn", 'i', 6, 3);
var ePawn= new Piece("white", "Pawn", 'i', 6, 4);
var fPawn= new Piece("white", "Pawn", 'i', 6, 5);
var gPawn= new Piece("white", "Pawn", 'i', 6, 6);
var hPawn= new Piece("white", "Pawn", 'i', 6, 7);

var BaPawn= new Piece("black", "Pawn", 'i', 1, 0);
var BbPawn= new Piece("black", "Pawn", 'i', 1, 1);
var BcPawn= new Piece("black", "Pawn", 'i', 1, 2);
var BdPawn= new Piece("black", "Pawn", 'i', 1, 3);
var BePawn= new Piece("black", "Pawn", 'i', 1, 4);
var BfPawn= new Piece("black", "Pawn", 'i', 1, 5);
var BgPawn= new Piece("black", "Pawn", 'i', 1, 6);
var BhPawn= new Piece("black", "Pawn", 'i', 1, 7);

var gKnight= new Piece("white", "Knight", '7', 7, 6);
var bKnight= new Piece("white", "Knight", '7', 7, 1);
var BgKnight= new Piece("black", "Knight", '7', 0, 6);
var BbKnight= new Piece("black", "Knight", '7', 0, 1);

var hRook= new Piece("white", "Rook", 'R', 7, 7);
var aRook= new Piece("white", "Rook", 'R', 7, 0);
var BhRook= new Piece("black", "Rook", 'R', 0, 7);
var BaRook= new Piece("black", "Rook", 'R', 0, 0);

var fBishop= new Piece("white", "Bishop", '^', 7, 5);
var cBishop= new Piece("white", "Bishop", '^', 7, 2);
var BfBishop= new Piece("black", "Bishop", '^', 0, 5);
var BcBishop= new Piece("black", "Bishop", '^', 0, 2);

var wQueen= new Piece("white", "Queen", 'W', 7, 3);
var bQueen= new Piece("black", "Queen", 'W', 0, 3);
var wKing= new Piece("white", "King", 't', 7, 4);
var bKing= new Piece("black", "King", 't', 0, 4);

var pieces=[aPawn, bPawn, cPawn, dPawn, ePawn, fPawn, gPawn, hPawn,
    BaPawn, BbPawn, BcPawn, BdPawn, BePawn, BfPawn, BgPawn, BhPawn,
    gKnight, bKnight, BgKnight, BbKnight, hRook, aRook, BhRook, BaRook,
    fBishop, cBishop, BfBishop, BcBishop, wQueen, bQueen, wKing, bKing];

if($("h1").css("color")=="rgb(255, 255, 255)"){
    AImode=true;
}

$("#box").click(function(){
    $(this).attr("placeholder", "");
})
$("#submit").click(function(){ //process the input
    var input = $("#box").val();
    if(input=="ai"){
        editorMode=false;
        if(AImode==true){
            AImode=false;
            log+="\nAI mode turned off\n";
        }
        else{
            AImode=true;
            log+="\nAI mode turned on\n";
        }
        $("textarea").val(log);
    }
    if(input=="edit"){
        if(editorMode==true) {
            editorMode=false;
            $("textarea").val("editor mode turned off");
        }
        else {
            editorMode = true;
            $("textarea").val("editor mode turned on");
        }
    }
    else if(input.length!=5){
        $("#box").attr("placeholder", "Invalid input. Input should comply with format 'e2 e4'");
    }
    else{
        //assume input is a 5-char string in the format "e2 e4"
        col1=input.charAt(0); //letter
        row1=input.charAt(1); //number
        if(findPiece(row1, col1)==0 ||findPiece(row1, col1)==-1){
            $("#box").val("");
            $("#box").attr("placeholder", "Invalid coordinates");
            return;
        }
        col2=input.charAt(3); //letter
        row2=input.charAt(4); //number

        movePiece(row1, col1, row2, col2);
    }
    $("#box").val("");
    $("#box").focus();
})
var boop;
$("button").click(function(e){
    if(e.target.nodeName=="IMG"){
        boop=  $(this).attr("id");
        $(this).fadeIn(100).fadeOut(100).fadeIn(100);
        console.log(boop);
        //console.log($(this).attr("class"));
        moveByClick(boop);
    }
})

function toggleHighLight(piece){ //this function assumes piece exists
    if(piece.highlight==true){ //piece has been selected, vmoves are highlighted
        //unhighlight the moves
        for(let i =0; i<piece.vMoves.length; i++){
            //$('#'+piece.vMoves[i].col+piece.vMoves[i].row).removeClass("opacity");
            $('#'+piece.vMoves[i]).removeClass("opacity");
            piece.highlight=false;
        }
    }
    else{//highlight the moves
        for(let i =0; i<piece.vMoves.length; i++){
            $('#'+piece.vMoves[i]).addClass("opacity");
            piece.highlight=true;
        }
    }
}

function translate(colRowStr){// translates "e2" to "46" and vice versa
    colRowStr.toString();
    let col = colRowStr.charAt(0);
    let row = colRowStr.charAt(1);
    if(isNaN(col)){//if the first letter is a letter
        col=col.charCodeAt(0)-97;
    }
    else{
        col=String.fromCharCode(Number(col)+97);
    }
    row=8-row;
    return(col+''+row);
}

function findPiece(a, b){ //row ,col. This function returns piece at (row, col)
    /* finds piece at coordinates a, b, assuming a is a row (number) and 
       b is a column (letter), e.g. 4e */
       if(isNaN(b)){
        b=translate(b+a).charAt(0);
        a=translate(b+a).charAt(1);
       }
        if(a>7 || a<0 ||b>7 || b<0){ //extra safety measures
            return -1; //return -1 if position doesn't exist
        }
        for(let i=0; i<pieces.length; i++){
            if(pieces[i].cols==b && pieces[i].rows==a){
                return pieces[i];
            }
        }
        return 0; //return 0 if position (a, b) is empty
}

function moveByClick(id){ 
    //check the valid moves of findPiece(col1, row1)
    //if the piece.highlight is true, change the opacity of each valid move to 1
    //piece.highlight=false
    if(gameover==true){
        return;
    }
    if(clicks==0){
        var curPiece=findPiece(id.charAt(1), id.charAt(0));
        if(curPiece!=0){ //curPiece!=0
            if(editorMode==false && curPiece.color!=turn){
                return;
            }
        console.log(curPiece.color);
        getValidMoves(curPiece);
        toggleHighLight(curPiece);
        col1=id.charAt(0);
        row1=id.charAt(1);
        clicks++;
        }
    }
    else{
        col2=id.charAt(0);
        row2=id.charAt(1);
        toggleHighLight(findPiece(row1, col1));
        if(!((row1==row2)&&(col1==col2))){
            movePiece(row1, col1, row2, col2);
        }
        clicks=0;
    }
}

function movePiece(a, b, x, y){//row, col, row, col
    if(gameover==true){ return;
    }
    if(!(isNaN(b))){ //this makes it so it accepts either notation
        b=translate(''+b+a).charAt(0);
        a=translate(''+b+a).charAt(1);
        y=translate(''+y+x).charAt(0);
        x=translate(''+y+x).charAt(1);
    }
    
    var curPiece = findPiece(a, b);
    if(curPiece!=0){
        getValidMoves(curPiece);
        if(editorMode==false){
            let noMatches=true;
            //loop through vMoves and check if x, y matches one of them
            for(let i=0; i<curPiece.vMoves.length; i++){
                //if there's a match, set noMatches to false
                if((''+y+x)==curPiece.vMoves[i]){ //if a match is found
                    noMatches=false;
                    break;
                }
            }
            if(noMatches==true){
                return;
            }
        }
        //the statements below replace the image from the previous square
        if($('#'+b+a).attr("class")=="lightsquare"){
            $('#'+b+a).html("<img src=\"images/caramel.png\" alt=\"&dotsquare;\">");
        }
        else if($('#'+b+a).attr("class")=="darksquare"){
            $('#'+b+a).html("<img src=\"images/coffee.png\" alt=\"&square;\">");
        }
        if($('#'+y+x).attr("class")=="lightsquare"){
            $('#'+y+x).html("<img src=\"images/"+curPiece.color+'-'+curPiece.name+".png\" alt=\"&dotsquare;\">");
        }
        else if($('#'+y+x).attr("class")=="darksquare"){
            $('#'+y+x).html("<img src=\"images/"+curPiece.color+'-'+curPiece.name+".png\" alt=\"&square;\">");
        }

        //the statements below check if there is already a piece on (x, y), then captures
        let str1=" moves from ";
        let str2=" to ";
        let captured = findPiece(x, y); //findPiece returns the object, I need its index
        if(captured!=0 && captured!=-1){ //not empty && exists, which means there is a piece
            for(let i=0; i<pieces.length; i++){
                if(pieces[i]===captured){
                    if(captured.name=="King"){ //if captured piece is a king, then game over
                        str2=" captures the king on "
                        gameover=true;
                        AImode=false;
                    }
                    else{
                        str2=" captures on ";
                    }
                    pieces.splice(i, 1); //removes the captured piece from the array
                    str1=" from ";
                }
            }
        }

        y=y.charCodeAt(0)-97;
        x=8-x;
        grid[curPiece.rows][curPiece.cols]='_';

        curPiece.rows=x; //piece is moved to new coordinates
        curPiece.cols=y;
        grid[x][y]=curPiece.icon;
        console.log(grid);

        if(editorMode==false){//code below changes the turn and updates the log
            if(turn=="white"){
                turn="black";
                log=log+'\n'+turnNum+". "+curPiece.color+' '+curPiece.name;
            }
            else{
                turn="white";
                log=log+'\n'+"   "+curPiece.color+' '+curPiece.name;
                turnNum++;
            }
            log=log+str1+b+a+str2+String.fromCharCode(y+97)+(8-x)+'\n';
            if(turn=="black" &&AImode==true){
                ai_move();
            }
            if(gameover==true){
                //log.charAt(log.length-2)="!"; //for some reason I can't get this to work
                log+="\n   "+curPiece.color+" wins!";
            }
            $("textarea").val(log); //consider changing the line hight of texarea
            $("textarea").scrollTop($("textarea")[0].scrollHeight);
        }
    } //else, issue some kind of "invalid input"///
}

function getValidMoves(piece){ //gets the valid moves of a piece, adds
    //them to piece.vMoves;
    var row, col;   //board notation
    var r=piece.rows, c=piece.cols; //grid notation
    row=8-r;
    col=String.fromCharCode(c+97);
    piece.vMoves=[]; //consider doing stuff before whiping vMoves.
    //e.g. col could be 'e' and row could be 4
    switch(piece.name){
        case "Pawn": //
            var num;
            if(piece.color==="white"){//i could probably shorten this to one line
               num=1;
            }
            else{
                num=-1;
            }
            if(findPiece(row+num, col)==0){//i.e., the space in front is available
                piece.vMoves.push(col+(row+num));
                if((piece.color=="white" && row==2) || (piece.color=="black" && row==7) ){
                     if(findPiece(row+(num*2), col)==0){//if in inital position, checks 2 spaces in front
                         piece.vMoves.push(col+(row+(num*2)));
                     }
                }
            }
            if(findPiece(row+num, String.fromCharCode(col.charCodeAt(0)+1))!=0){ //checks right diagonal
                if(findPiece(row+num, String.fromCharCode(col.charCodeAt(0)+1)).color!=piece.color){
                    piece.vMoves.push(String.fromCharCode(col.charCodeAt(0)+1)+(row+num));
                }
            }
            if(findPiece(row+num, String.fromCharCode(col.charCodeAt(0)-1))!=0){ //checks left diagonal
                if(findPiece(row+num, String.fromCharCode(col.charCodeAt(0)-1)).color!=piece.color){
                    piece.vMoves.push(String.fromCharCode(col.charCodeAt(0)-1)+(row+num));
                }
            }
        break;

        case "Knight":
            if(r-2>-1 && c+1<8){//this if staement might be redundant, considering the next line
                if(findPiece(r-2,c+1)==0 || findPiece(r-2,c+1).color!=piece.color){//if the space is empty, or has enemy
                    piece.vMoves.push(translate(''+(c+1)+(r-2))); //add position to valid moves
                }
            }
            if(r-1>-1 && c+2<8){//
                if(findPiece(r-1,c+2)==0 || findPiece(r-1,c+2).color!=piece.color){//if the space is empty, or has enemy
                piece.vMoves.push(translate(''+(c+2)+(r-1)));
                }
            }
            
            if(r+1<8 && c+2<8){//
                if(findPiece(r+1,c+2)==0 || findPiece(r+1,c+2).color!=piece.color){//if the space is empty, or has enemy
                    piece.vMoves.push(translate(''+(c+2)+(r+1)));
                }
            }
            
            if(r+2<8 && c+1<8){//
                if(findPiece(r+2,c+1)==0 || findPiece(r+2,c+1).color!=piece.color){//if the space is empty, or has enemy
                    piece.vMoves.push(translate(''+(c+1)+(r+2)));
                }
            }
            if(r+2<8 && c-1>-1){//
                if(findPiece(r+2,c-1)==0 || findPiece(r+2,c-1).color!=piece.color){//if the space is empty, or has enemy
                    //add it to vMoves
                    //console.log(translate(''+(c+2)+(r-1)));
                    piece.vMoves.push(translate(''+(c-1)+(r+2)));
                }
            }
            if(r+1<8 && c-2>-1){//
                if(findPiece(r+1,c-2)==0 || findPiece(r+1,c-2).color!=piece.color){//if the space is empty, or has enemy
                    piece.vMoves.push(translate(''+(c-2)+(r+1)));
                }
            }
            if(r-1>-1 && c-2>-1){//
                if(findPiece(r-1,c-2)==0 || findPiece(r-1,c-2).color!=piece.color){//if the space is empty, or has enemy
                    piece.vMoves.push(translate(''+(c-2)+(r-1)));
                }
            }
            if(r-2>-1 && c-1>-1){//
                if(findPiece(r-2,c-1)==0 || findPiece(r-2,c-1).color!=piece.color){//if the space is empty, or has enemy
                    piece.vMoves.push(translate(''+(c-1)+(r-2)));
                }
            }
        break;   

        case "Queen": //I put this above rook and bishop, so that it inherits their moves

        case "Rook": //make a for loop to check if the piece in front is available or has enemy
            for(let i=1;i<8; i++){ //checks forward
                if(findPiece(r-i,c)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r-i,c)==0){ //if piece in front is available
                    piece.vMoves.push(translate(''+c+(r-i)));
                }
                else{ 
                    if(findPiece(r-i,c).color!=piece.color){//if piece in front is enemy
                    piece.vMoves.push(translate(''+c+(r-i)));
                    }
                break; //if piece in front is ally
                }
            }
            for(let i=1;i<8; i++){ //checks backward
                if(findPiece(r+i,c)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r+i,c)==0){ //if next piece is available
                    piece.vMoves.push(translate(''+c+(r+i)));
                }
                else{ 
                    if(findPiece(r+i,c).color!=piece.color){//if next piece is enemy
                    piece.vMoves.push(translate(''+c+(r+i)));
                    }
                break; //if next piece is ally
                }
            }
            for(let i=1;i<8; i++){ //checks right
                if(findPiece(r,c+i)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r,c+i)==0){ //if next piece is available
                    piece.vMoves.push(translate(''+(c+i)+r));
                }
                else{ 
                    if(findPiece(r,c+i).color!=piece.color){//if next piece is enemy
                    piece.vMoves.push(translate(''+(c+i)+r));
                    }
                break; //if next piece is ally
                }
            }
            for(let i=1;i<8; i++){//checks left
                if(findPiece(r,c-i)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r,c-i)==0){ //if next piece is available
                    piece.vMoves.push(translate(''+(c-i)+r));
                }
                else{ 
                    if(findPiece(r,c-i).color!=piece.color){//if next piece is enemy
                    piece.vMoves.push(translate(''+(c-i)+r));
                    }
                break; //if next piece is ally
                }
            }
        if(piece.name!="Queen")
        break;

        case "Bishop": //make a for loop to check if the piece in front is available or has enemy
            for(let i=1;i<8; i++){//top left diag
                if(findPiece(r-i,c-i)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r-i,c-i)==0){ //if piece in front is available
                    piece.vMoves.push(translate(''+(c-i)+(r-i)));
                }
                else{ 
                    if(findPiece(r-i,c-i).color!=piece.color){//if piece in front is enemy
                    piece.vMoves.push(translate(''+(c-i)+(r-i)));
                    }
                break; //if piece in front is ally
                }
            }
            for(let i=1;i<8; i++){//top right diag
                if(findPiece(r-i,c+i)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r-i,c+i)==0){ //if piece in front is available
                    piece.vMoves.push(translate(''+(c+i)+(r-i)));
                }
                else{ 
                    if(findPiece(r-i,c+i).color!=piece.color){//if piece in front is enemy
                    piece.vMoves.push(translate(''+(c+i)+(r-i)));
                    }
                break; //if piece in front is ally
                }
            }
            for(let i=1;i<8; i++){ //bottom right diag
                if(findPiece(r+i,c+i)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r+i,c+i)==0){ //if piece in front is available
                    piece.vMoves.push(translate(''+(c+i)+(r+i)));
                }
                else{ 
                    if(findPiece(r+i,c+i).color!=piece.color){//if piece in front is enemy
                    piece.vMoves.push(translate(''+(c+i)+(r+i)));
                    }
                break; //if piece in front is ally
                }
            }
            for(let i=1;i<8; i++){ //bottom left diag
                if(findPiece(r+i,c-i)==-1){    //if out of bounds
                    break;
                }
                if(findPiece(r+i,c-i)==0){ //if piece in front is available
                    piece.vMoves.push(translate(''+(c-i)+(r+i)));
                }
                else{ 
                    if(findPiece(r+i,c-i).color!=piece.color){//if piece in front is enemy
                    piece.vMoves.push(translate(''+(c-i)+(r+i)));
                    }
                break; //if piece in front is ally
                }
            }
        break;

        case "King":         //exists && it's color is not the king's color
            if((findPiece(r-1,c)!=-1) && findPiece((r-1),c).color!=piece.color){
                piece.vMoves.push(translate(''+c+(r-1)));
            }
            if((findPiece((r-1),c+1)!=-1) && findPiece((r-1),c+1).color!=piece.color){
                piece.vMoves.push(translate(''+(c+1)+(r-1)));
            }
            if((findPiece(r,c+1)!=-1) && findPiece(r,c+1).color!=piece.color){
                piece.vMoves.push(translate(''+(c+1)+r));
            }
            if((findPiece(r+1,c+1)!=-1) && findPiece((r+1),(c+1)).color!=piece.color){
                piece.vMoves.push(translate(''+(c+1)+(r+1)));
            }
            if((findPiece((r+1),c)!=-1) && findPiece((r+1),c).color!=piece.color){
                piece.vMoves.push(translate(''+c+(r+1)));
            }
            if((findPiece((r+1),(c-1))!=-1) && findPiece((r+1),(c-1)).color!=piece.color){
                piece.vMoves.push(translate(''+(c-1)+(r+1)));
            }
            if((findPiece(r,c-1)!=-1) && findPiece(r,c-1).color!=piece.color){
                piece.vMoves.push(translate(''+(c-1)+r));
            }
            if((findPiece((r-1),c-1)!=-1) && findPiece((r-1),c-1).color!=piece.color){
                piece.vMoves.push(translate(''+(c-1)+(r-1)));
            }  
    }
    console.log("valid moves are: "+piece.vMoves);
}
function ai_move(){//assumes turn is black when this is called
    turn="black"
    let temp=[]
    //randomly select a piece, then randomly select one of its vMoves
    for(let i=0;i<pieces.length;i++){
        if(pieces[i].color=="white"){
            continue; //ignore the white pieces
        }
        getValidMoves(pieces[i]);
        if (pieces[i].vMoves.length!=0){
            temp.push(pieces[i]);
        }
    }
    //movePiece
    let index=Math.floor(Math.random()*temp.length);
    let k=Math.floor(Math.random()*(temp[index]).vMoves.length);
    var ranMove=temp[index].vMoves[k]; //format 'e4' (col row)
    ranMove=translate(ranMove); //expects col row, returns col row (eg '44')
    var rCol=ranMove.charAt(0);
    var rRow=ranMove.charAt(1);
    movePiece(temp[index].rows,temp[index].cols,rRow,rCol);
    //now get the col and the row
    //turn="white"; //might be redundant
} //note, h pawns will sometimes move to i and disappear. e.g. "black pawn moves from h5 to i4"