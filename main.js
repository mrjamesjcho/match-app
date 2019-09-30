// v0.6
// collapse transition for remove
// falling transition for repopulation

$(document).ready(initializeApp);

function initializeApp() {
  initializeStats();
  gameObj.initializeGameBoard();
  $(".card_container").on("click", ".card.clickable, .card_selected", handleCardClick);
  $(".everything_container").on("click", ".replay_button", emptyAndReinitialize);
}

function emptyAndReinitialize(){
  $(".game_over_screen").remove();
  gameObj.emptyGameBoard();
  gameObj.initializeGameBoard();
  updateStats();
}

var initialStats = ["CARDS CLEARED", 0, "POINTS", 0, "MODE", "Classic", "TIME", "N/A"];
var statsClassArr = ["cards_cleared", "cards_cleared_number", "points", "points_number", "shuffle", "new_game"];

class Card{
  constructor(cardClass, divElement, picElement, col, row){
    this.class = cardClass;
    this.divElement = divElement;
    this.picElement = picElement;
    this.col = col;
    this.row = row;
  }
}

var gameObj = {
  "gameBoard": [[], [], [], [], [], [], [], []],
  "cardColumns": [],
  "numOfCols": 8,
  "numOfRows": 8,
  "cardClasses": ["css_logo", "docker_logo", "gitHub_logo", "html_logo", "js_logo", "react_logo", "node_logo", "php_logo"], //""];
  "firstCardClicked": null,
  "secondCardClicked": null,
  "firstCardCoordinates": [],
  "secondCardCoordinates": [],
  "firstCardRowMatches": [],
  "firstCardColMatches": [],
  "secondCardRowMatches": [],
  "secondCardColMatches": [],
  "clickNumber": 0,
  "cardsCleared": 0,
  "points": 0,

  emptyGameBoard: function(){
    this.gameBoard = [[], [], [], [], [], [], [], []];
    this.firstCardClicked = null,
    this.secondCardClicked = null;
    this.firstCardCoordinates = [];
    this.secondCardCoordinates = [];
    this.firstCardRowMatches = [];
    this.firstCardColMatches = [];
    this.secondCardRowMatches = [];
    this.secondCardColMatches = [];
    this.clickNumber = 0;
    this.cardsCleared = 0;
    this.points = 0;
    for (var columnIndex = 0; columnIndex < this.numOfCols; columnIndex++){
      this.cardColumns[columnIndex].remove();
    }
    this.cardColumns = [];
  },

  initializeGameBoard: function(){
    this.initializeCardColumns();
    for (var col = 0; col < this.numOfCols; col++) {
      for (var row = 0; row < this.numOfRows; row++) {
        var newCardClass = this.returnRandomCardClass();
        while (this.checkIfPreviousTwoInSameColumnAreSame(newCardClass, col, row) ||
          this.checkIfPreviousTwoInSameRowAreSame(newCardClass, col, row)) {
          newCardClass = this.returnRandomCardClass();
        }
        this.createNewCard(newCardClass, col, row);
      }
    }
  },

  initializeCardColumns: function () {
    var cardContainer = $(".card_container");
    for (var columnIndex = 0; columnIndex < this.numOfCols; columnIndex++) {
      var cardColumn = $("<div>").addClass("card_column");
      this.cardColumns[columnIndex] = cardColumn;
      cardContainer.append(cardColumn);
    }
  },

  createNewCard: function(cardClass, col, row){
    console.log("new card");
    var newCardClass = "card clickable " + cardClass;
    var newCardElement = this.returnNewCardElement(newCardClass, col, row);
    var newPicElement = $("<div>").addClass("picture " + cardClass);
    newCardElement.append(newPicElement);
    this.gameBoard[col][row] = new Card(cardClass, newCardElement, newPicElement, col, row);
    this.cardColumns[col].append(this.gameBoard[col][row].divElement);
  },

  returnRandomCardClass: function(){
    var randomIndex = Math.floor(Math.random() * this.cardClasses.length);
    return this.cardClasses[randomIndex];
  },

  checkIfPreviousTwoInSameColumnAreSame: function(cardClass, col, row){
    if (row <= 1){
      return false;
    }
    if (cardClass === this.gameBoard[col][row - 1].class && cardClass === this.gameBoard[col][row - 2].class) {
      return true;
    }
    return false;
  },

  checkIfPreviousTwoInSameRowAreSame: function(cardClass, col, row) {
    if (col <= 1){
      return false;
    }
    if (cardClass === this.gameBoard[col - 1][row].class && cardClass === this.gameBoard[col - 2][row].class) {
      return true;
    }
    return false;
  },

  returnNewCardElement: function(cardClass, col, row){
    return $("<div>", {class: cardClass, col: col, row: row});
  },


  setCardClicked: function(element){
    if (this.clickNumber === 0){
      this.firstCardCoordinates = this.returnCardCoordinates($(element));
      this.firstCardClicked = this.gameBoard[this.firstCardCoordinates[0]][this.firstCardCoordinates[1]];
      this.firstCardClicked.divElement.addClass("card_selected");
      this.clickNumber++;
      return this.clickNumber;
    }
    if (this.clickNumber === 1 && element[0] === this.firstCardClicked.divElement[0]){
      this.removeAdjecentCardClass();
      this.firstCardClicked.divElement.removeClass("card_selected");
      this.reinitializeClickedCards();
      this.clickNumber--;
      return this.clickNumber;
    }
    this.secondCardCoordinates = this.returnCardCoordinates($(element));
    this.secondCardClicked = this.gameBoard[this.secondCardCoordinates[0]][this.secondCardCoordinates[1]];
    this.secondCardClicked.divElement.addClass("card_selected");
    this.removeAdjecentCardClass();
    this.clickNumber++;
    return 2;
  },

  returnCardCoordinates: function(element){
    var coordinates = [];
    coordinates[0] = parseInt(element.attr("col"));
    coordinates[1] = parseInt(element.attr("row"));
    return coordinates;
  },

  showWhichCardsToSwitch: function(){
    var adjacentCards = this.returnAllAdjacentCards(this.firstCardCoordinates[0], this.firstCardCoordinates[1]);
    for (var cardIndex = 0; cardIndex < adjacentCards.length; cardIndex++) {
      if (adjacentCards[cardIndex]) {
        adjacentCards[cardIndex].divElement.addClass("card_adjacent clickable");
      }
    }
  },

  returnAllAdjacentCards: function(col, row){
    var adjacentCards = [];
    adjacentCards[0] = this.returnCard(col, row + 1); //top
    adjacentCards[1] = this.returnCard(col + 1, row); //right
    adjacentCards[2] = this.returnCard(col, row - 1); //bottom
    adjacentCards[3] = this.returnCard(col - 1, row); //left
    return adjacentCards;
  },

  returnCard: function(col, row){
    if (row < 0 || row > this.numOfRows - 1 || col < 0 || col > this.numOfCols - 1) {
      return null;
    }
    return this.gameBoard[col][row];
  },

  removeAdjecentCardClass: function (){
    var adjacentCards = this.returnAllAdjacentCards(this.firstCardCoordinates[0], this.firstCardCoordinates[1]);
    for (var cardIndex = 0; cardIndex < adjacentCards.length; cardIndex++) {
      if (adjacentCards[cardIndex]) {
        adjacentCards[cardIndex].divElement.removeClass("card_adjacent");
      }
    }
  },

  reinitializeClickedCards: function (){
    this.firstCardClicked = null;
    this.firstCardCoordinates = [];
    this.firstCardColMatches = [];
    this.firstCardRowMatches = [];
    this.secondCardClicked = null;
    this.secondCardCoordinates = [];
    this.secondCardColMatches = [];
    this.secondCardRowMatches = [];

  },

  switchCards: function(){
    var firstCardAllClasses = this.firstCardClicked.divElement.attr("class");
    var firstCardClass = this.firstCardClicked.class;
    var firstCardPicElement = this.firstCardClicked.picElement;
    var secondCardAllClasses = this.secondCardClicked.divElement.attr("class");
    var secondCardClass = this.secondCardClicked.class;
    var secondCardPicElement = this.secondCardClicked.picElement;
    this.firstCardClicked.divElement.empty();
    this.secondCardClicked.divElement.empty();
    this.firstCardClicked.divElement.append(secondCardPicElement);
    this.secondCardClicked.divElement.append(firstCardPicElement);
    this.firstCardClicked.divElement.attr("class", secondCardAllClasses);
    this.secondCardClicked.divElement.attr("class", firstCardAllClasses);
    this.firstCardClicked.class = secondCardClass;
    this.secondCardClicked.class = firstCardClass;
    this.firstCardClicked.picElement = secondCardPicElement;
    this.secondCardClicked.picElement = firstCardPicElement;
  },

  cardMatchCheck: function(){
    this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardRowMatches, "row");
    this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardColMatches, "column");
    this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardRowMatches, "row");
    this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardColMatches, "column");
    var ifThreeOrMoreMatchedFirstCard = this.removeIfThreeOrMoreMatchedCards(this.firstCardClicked, this.firstCardColMatches, this.firstCardRowMatches);
    if (!ifThreeOrMoreMatchedFirstCard) {
      this.firstCardClicked.divElement.removeClass("card_selected");
    }
    var ifThreeOrMoreMatchedSecondCard = this.removeIfThreeOrMoreMatchedCards(this.secondCardClicked, this.secondCardColMatches, this.secondCardRowMatches);
    if (!ifThreeOrMoreMatchedSecondCard) {
      this.secondCardClicked.divElement.removeClass("card_selected");
    }
    if (!ifThreeOrMoreMatchedFirstCard && !ifThreeOrMoreMatchedSecondCard) {
      setTimeout(this.switchCards.bind(this), 200);
    }
    this.firstCardColMatches = [];
    this.firstCardRowMatches = [];
    this.secondCardColMatches = [];
    this.secondCardRowMatches = [];
    var functionArr = [updateStats, this.checkForCombos.bind(this), this.checkForMoreMoves.bind(this)];
    this.callFunctionsInOrder(functionArr, 500);
    setTimeout(makeCardsClickable, 1100);
  },

  findMoreCardsInSameDirection: function(card, matchedArr, rowOrCol){
    var cardCoordinates = [card.col, card.row];
    if (rowOrCol === "row") {
      var cardsInSameRow = this.returnAdjacentCardsInSameRow(cardCoordinates[0], cardCoordinates[1]);
      for (var adjIndex = 0; adjIndex < cardsInSameRow.length; adjIndex++) {
        if (cardsInSameRow[adjIndex]) {
          if (this.checkIfCardsMatch(card, cardsInSameRow[adjIndex]) && !this.isCardAlreadyPushed(cardsInSameRow[adjIndex], matchedArr)) {
            matchedArr.push(cardsInSameRow[adjIndex]);
            this.findMoreCardsInSameDirection(cardsInSameRow[adjIndex], matchedArr, "row");
          }
        }
      }
    } else {
      var cardsInSameColumn = this.returnAdjacentCardsInSameColumn(cardCoordinates[0], cardCoordinates[1]);
      for (var cIndex = 0; cIndex < cardsInSameColumn.length; cIndex++) {
        if (cardsInSameColumn[cIndex]) {
          if (this.checkIfCardsMatch(card, cardsInSameColumn[cIndex]) && !this.isCardAlreadyPushed(cardsInSameColumn[cIndex], matchedArr)) {
            this.pushIntoColumnArray(cardsInSameColumn[cIndex], matchedArr);
            this.findMoreCardsInSameDirection(cardsInSameColumn[cIndex], matchedArr, "col");
          }
        }
      }
    }
  },

  pushIntoColumnArray: function(card, arr){
    for (var arrIndex = 0; arrIndex < arr.length; arrIndex++){
      if (card.row > arr[arrIndex].row){
        arr.splice(arrIndex, 0, card);
        return;
      }
    }
    arr.push(card);
  },

  checkIfCardsMatch: function(card1, card2) {
   if (card1.class === card2.class){
     return true;
   }
   return false;
  },

  isCardAlreadyPushed: function(card, cardArr){
    if(card.divElement.hasClass("card_selected") || card.divElement.hasClass("card_matched")){
      return true;
    }
    for(var cardArrIndex = 0; cardArrIndex < cardArr.length; cardArrIndex++){
      if(card.col === cardArr[cardArrIndex].col && card.row === cardArr[cardArrIndex].row){
        return true;
      }
    }
    return false;
  },

  returnAdjacentCardsInSameRow: function(col, row) {
    var cardsInSameRow = [];
    cardsInSameRow[0] = this.returnCard(col - 1,row); //left
    cardsInSameRow[1] = this.returnCard(col + 1,row); //right
    return cardsInSameRow;
    },

  returnAdjacentCardsInSameColumn: function(col, row) {
    var cardsInSameCol = [];
    cardsInSameCol[0] = this.returnCard(col, row + 1); //top
    cardsInSameCol[1] = this.returnCard(col, row - 1); //bottom
    return cardsInSameCol;
  },

  removeIfThreeOrMoreMatchedCards: function(card, colMatches, rowMatches) {
    var cardsToRemove = [];
    if (rowMatches.length < 2 && colMatches.length < 2) {
      return false;
    }
    if (colMatches.length >= 2) {
      this.pushIntoColumnArray(card, colMatches);
      if (rowMatches.length < 2){
        cardsToRemove = colMatches;
      } else {
        cardsToRemove = colMatches.concat(rowMatches);
      }
    } else {
      rowMatches.push(card);
      cardsToRemove = rowMatches;
    }
    for (var cardNum = 0; cardNum < cardsToRemove.length; cardNum++) {
      cardsToRemove[cardNum].divElement.addClass("card_matched");
    }
    this.cardsCleared += cardsToRemove.length;
    this.points = this.cardsCleared + colMatches.length * 10 + rowMatches.length * 10;
    this.collapseCards(cardsToRemove);
    setTimeout(this.removeCards.bind(this), 200, cardsToRemove);
    setTimeout(this.repopulateColumns.bind(this), 200);
    return true;
  },

  collapseCards: function(cardArr){
    for (var cardIndex = 0; cardIndex < cardArr.length; cardIndex++){
      cardArr[cardIndex].divElement.addClass("collapse");
    }
  },

  removeCards: function(cardArr){
    for (var cardIndex = 0; cardIndex < cardArr.length; cardIndex++) {
      cardArr[cardIndex].divElement.remove();
      this.gameBoard[cardArr[cardIndex].col].splice(cardArr[cardIndex].row, 1);
    }
  },

  repopulateColumns: function() {
    for (var colIndex = 0; colIndex < this.numOfCols; colIndex++) {
      if (this.gameBoard[colIndex].length < 8){
        for(var rowIndex = this.gameBoard[colIndex].length; rowIndex < 8; rowIndex++){
          var newRandomCardClass = this.returnRandomCardClass();
          this.createNewCard(newRandomCardClass, colIndex, rowIndex);
        }
      }
    }
    this.reinitializeCardRows();
  },

  reinitializeCardRows: function() {
    for (var col = 0; col < this.numOfCols; col++){
      for (var row = 0; row < this.numOfRows; row++) {
        this.gameBoard[col][row].row = row;
        this.gameBoard[col][row].divElement.attr("row", row);
      }
    }
  },

  checkForCombos: function(){
    var comboRows = [];
    var comboCols = [];
    for (var col = 0; col < this.numOfRows; col++){
      for (var row = 0; row < this.numOfCols; row++){
        var comboCard = this.gameBoard[col][row];
        comboCard.divElement.addClass("card_selected");
        this.findMoreCardsInSameDirection(comboCard, comboCols, "col");
        this.findMoreCardsInSameDirection(comboCard, comboRows, "row");
        if(this.removeIfThreeOrMoreMatchedCards(comboCard, comboCols, comboRows)){
          setTimeout(this.checkForCombos.bind(this), 400);
        }
        comboCard.divElement.removeClass("card_selected");
        comboRows = [];
        comboCols = [];
      }
    }
    updateStats();
  },

  checkForMoreMoves: function(){
    for (var col = 0; col < this.numOfRows; col++) {
      for (var row = 0; row < this.numOfCols; row++) {
        this.firstCardClicked = this.gameBoard[col][row];
        this.firstCardClicked.divElement.addClass("card_selected");
        var checkAdjCards = this.returnAllAdjacentCards(col, row);
        for (var checkIndex = 0; checkIndex < 4; checkIndex++){
          if (checkAdjCards[checkIndex]){
            this.secondCardClicked = checkAdjCards[checkIndex];
            this.secondCardClicked.divElement.addClass("card_selected");
            this.switchCards();
            this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardColMatches, "col");
            this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardRowMatches, "row");
            this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardColMatches, "col");
            this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardRowMatches, "row");
            if (this.firstCardColMatches.length >= 2 || this.firstCardRowMatches.length >= 2 ||
              this.secondCardColMatches.length >= 2 || this.secondCardRowMatches.length >= 2) {
                this.switchCards();
                this.firstCardClicked.divElement.removeClass("card_selected");
                this.secondCardClicked.divElement.removeClass("card_selected");
                this.reinitializeClickedCards();
                return true;
            }
            this.switchCards();
            this.secondCardClicked.divElement.removeClass("card_selected");
            this.firstCardColMatches = [];
            this.firstCardRowMatches = [];
            this.secondCardColMatches = [];
            this.secondCardRowMatches = [];
          }
        }
        this.firstCardClicked.divElement.removeClass("card_selected");
      }
    }
    this.gameOver();
  },

  gameOver: function(){
    var gameOverScreen = $("<div>").addClass("game_over_screen").append($("<p>").text("NO MORE MOVES"));
    var gameOverButton = $("<div>").addClass("replay_button").append($("<p>").text("PLAY AGAIN?"));
    gameOverScreen.append(gameOverButton);
    $(".card_container").append(gameOverScreen);
  },

  callFunctionsInOrder(funcArr, time){
    for (var funcIndex = 0; funcIndex < funcArr.length; funcIndex++){
      setTimeout(funcArr[funcIndex], time);
    }
  }

};

function initializeStats(){
  var statsContainerElement = $(".stats_container");
  var statDivElement = null;
  var statTextElement = null;
  var statNumElement = null;
  var statIndex = 0;
  for (statIndex = 0; statIndex < 8; statIndex+=2){
    statDivElement = $("<div>").addClass("stats_div");
    statTextElement = $("<p>").addClass("stats_data").addClass(statsClassArr[statIndex]);
    statNumElement = $("<p>").addClass("stats_data").addClass(statsClassArr[statIndex + 1]);
    statTextElement.text(initialStats[statIndex]);
    statNumElement.text(initialStats[statIndex + 1]);
    statDivElement.append(statTextElement).append(statNumElement);
    statsContainerElement.append(statDivElement);
  }
}

function handleCardClick(){
  makeCardsNotClickable();
  var clickStatus = gameObj.setCardClicked($(this));
  if (clickStatus === 1){
    gameObj.showWhichCardsToSwitch();
    return;
  }
  if (clickStatus === 0){
    makeCardsClickable();
    return;
  }
  gameObj.switchCards();
  gameObj.clickNumber = 0;
  gameObj.cardMatchCheck();
}

function makeCardsNotClickable() {
  $(".card").removeClass("clickable");
}

function makeCardsClickable() {
  $(".card").addClass("clickable");
}

function updateStats() {
  var pointsNumElement = $(".points_number");
  var cardsClearedNumberElement = $(".cards_cleared_number");
  pointsNumElement.text(gameObj.points);
  cardsClearedNumberElement.text(gameObj.cardsCleared);
}
