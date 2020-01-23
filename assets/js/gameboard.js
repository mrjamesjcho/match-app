class GameBoard {
  constructor() {
    this.gameBoard = [[], [], [], [], [], [], [], []];
    this.initialTimer = 0;
    this.numOfCols = 8;
    this.numOfRows = 8;
    this.cardClasses = ['css_logo', 'docker_logo', 'gitHub_logo', 'html_logo', 'js_logo', 'react_logo', 'node_logo', 'php_logo'];
    this.firstCardClicked = null;
    this.secondCardClicked = null;
    this.firstCardCoordinates = [];
    this.secondCardCoordinates = [];
    this.firstCardRowMatches = [];
    this.firstCardColMatches = [];
    this.secondCardRowMatches = [];
    this.secondCardColMatches = [];
    this.noMatches = false;
    this.clickNumber = 0;
    this.cardsCleared = 0;
    this.cardsClearedToWin = 100;
    this.domElements = {
      cardContainer: null,
      cardCols: [],
      cardsCleared: null,
      gameOverScreen: null,

      newGameButton: null
    }
    this.handleCardClick = this.handleCardClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.switchCards = this.switchCards.bind(this);
  }

  initializeGameBoard() {
    this.renderDomElements();
    this.initializeClickHandlers();
  }

  renderDomElements(){
    const root = document.getElementById('root');
    const mainContainer = document.createElement('div');
    mainContainer.className = 'mainContainer';
    const statsContainer = this.renderStats();
    const cardContainer = document.createElement('div');
    cardContainer.className = 'cardContainer';
    mainContainer.append(statsContainer, cardContainer)
    this.domElements.cardContainer = cardContainer;
    this.renderCardCols();
    this.renderCardElements();
    //this.renderGameOverScreen();
    root.append(mainContainer);
  }

  renderStats(){
    const statsContainer = document.createElement('div');
    statsContainer.className = 'statsContainer';
    const imageContainer = document.createElement('div');
    imageContainer.className = 'imageContainer';
    const cardsClearedContainer = document.createElement('div');

    cardsClearedContainer.classList.add('cardsClearedContainer', 'stat');
    const cardsCleared = document.createElement('div');
    cardsCleared.className = 'cardsCleared';
    cardsCleared.innerHTML = this.cardsCleared;
    cardsClearedContainer.append('CARDS CLEARED', cardsCleared);

    const highScoresContainer = document.createElement('div');
    highScoresContainer.classList.add('highScoresContainer', 'stat');
    const highScores = document.createElement('div');
    highScores.className = 'highScores';
    highScoresContainer.append('HIGH SCORES', highScores);

    const newGameButton = document.createElement('div');
    newGameButton.classList.add('newGame', 'stat');
    newGameButton.innerText = 'NEW GAME';

    statsContainer.append(imageContainer, cardsClearedContainer, highScoresContainer, newGameButton);
    this.domElements.cardsCleared = cardsCleared;
    this.domElements.newGameButton = newGameButton;
    return statsContainer;
  }

  renderCardCols(){
    for (let colIndex = 0; colIndex < this.numOfCols; colIndex++) {
      const cardCol = document.createElement('div');
      cardCol.className = 'cardCol';
      cardCol.id = `col${colIndex}`;
      this.domElements.cardContainer.append(cardCol);
      this.domElements.cardCols[colIndex] = cardCol;
    }
  }

  renderCardElements() {
    for (let col = 0; col < this.numOfCols; col++) {
      for (let row = 0; row < this.numOfRows; row++) {
        var newCardClass = this.returnRandomCardClass();
        while (this.checkIfPreviousTwoInSameColumnAreSame(newCardClass, col, row) ||
          this.checkIfPreviousTwoInSameRowAreSame(newCardClass, col, row)) {
          newCardClass = this.returnRandomCardClass();
        }
        this.createNewCard(newCardClass, col, row);
      }
    }
  }

  createNewCard(cardClass, col, row) {
    console.log('new card');
    const newCardElement = document.createElement('div');
    newCardElement.classList.add('card', 'clickable', cardClass);
    newCardElement.dataset.col = col;
    newCardElement.dataset.row = row;
    const newPicElement = document.createElement('div');
    newPicElement.classList.add('picture', cardClass);
    newCardElement.append(newPicElement);
    this.gameBoard[col][row] = new Card(cardClass, newCardElement, newPicElement, col, row);
    this.domElements.cardCols[col].append(this.gameBoard[col][row].divElement);
  }

  renderGameOverScreen() {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'gameOverScreen';
    //gameOverScreen.style.display = 'none';
    const gameOverButton = document.createElement('div');
    gameOverButton.className = 'replayButton';
    gameOverButton.innerText = 'PLAY AGAIN';
    gameOverButton.onclick = this.resetGame;
    if (this.cardsCleared >= this.cardsClearedToWin) {
      gameOverScreen.append('YOU WIN!', gameOverButton);
    } else {
      gameOverScreen.append('NO MORE MOVES', gameOverButton);
    }
    this.domElements.cardContainer.append(gameOverScreen);
    this.domElements.gameOverScreen = gameOverScreen;
  }

  resetGameBoard() {
    this.gameBoard = [[], [], [], [], [], [], [], []];
    this.firstCardClicked = null;
    this.secondCardClicked = null;
    this.firstCardCoordinates = [];
    this.secondCardCoordinates = [];
    this.firstCardRowMatches = [];
    this.firstCardColMatches = [];
    this.secondCardRowMatches = [];
    this.secondCardColMatches = [];
    this.clickNumber = 0;
    this.cardsCleared = 0;
    for (let columnIndex = 0; columnIndex < this.numOfCols; columnIndex++) {
      const col = this.domElements.cardCols[columnIndex];
      while(col.firstChild){
        col.firstChild.remove();
      }
    }
  }

  initializeClickHandlers() {
    this.domElements.cardContainer.addEventListener('click', this.handleCardClick);
    this.domElements.newGameButton.addEventListener('click', this.resetGame);
  }

  returnRandomCardClass() {
    const randomIndex = Math.floor(Math.random() * this.cardClasses.length);
    return this.cardClasses[randomIndex];
  }

  checkIfPreviousTwoInSameColumnAreSame(cardClass, col, row) {
    if (row <= 1) {
      return false;
    }
    if (cardClass === this.gameBoard[col][row - 1].class && cardClass === this.gameBoard[col][row - 2].class) {
      return true;
    }
    return false;
  }

  checkIfPreviousTwoInSameRowAreSame(cardClass, col, row) {
    if (col <= 1) {
      return false;
    }
    if (cardClass === this.gameBoard[col - 1][row].class && cardClass === this.gameBoard[col - 2][row].class) {
      return true;
    }
    return false;
  }

  returnNewCardElement(cardClass, col, row) {
    const newCardElement = document.createElement('div');
    newCardElement.className = cardClass;
    newCardElement.dataset.col = col;
    newCardElement.dataset.row = row;
    return newCardElement;
  }

  handleCardClick(event) {
    var cardElement = null;
    if (event.target.classList.contains('picture')){
      cardElement = event.target.parentNode;
    } else if(event.target.classList.contains('card')) {
      cardElement = event.target;
    } else {
      return;
    }
    if (cardElement.classList.contains('card') && cardElement.classList.contains('clickable') ||
      cardElement.classList.contains('card_selected')) {
      this.makeCardsNotClickable();
      const clickStatus = this.setCardClicked(cardElement);
      if (clickStatus === 1) {
        this.showWhichCardsToSwitch();
        return;
      }
      if (clickStatus === 0) {
        this.makeCardsClickable();
        return;
      }
      this.switchCards();
      this.clickNumber = 0;
      this.callFunctionsAsync();
    }
  }

  makeCardsNotClickable() {
    const cardElements = document.querySelectorAll('.card');
    for (let cardElementIndex = 0; cardElementIndex < cardElements.length; cardElementIndex++){
      cardElements[cardElementIndex].classList.remove('clickable');
    }
  }
  makeCardsClickable() {
    console.log('make cards clickable');
    const cardElements = document.querySelectorAll('.card');
    for (let cardElementIndex = 0; cardElementIndex < cardElements.length; cardElementIndex++) {
      cardElements[cardElementIndex].classList.add('clickable');
    }
  }

  updateStats() {
    console.log('update stats');
    this.domElements.cardsCleared.innerHTML = this.cardsCleared;
    return new Promise(resolve=> resolve());
  }

  setCardClicked(element) {
    if (this.clickNumber === 0) {
      this.firstCardCoordinates = this.returnCardCoordinates(element);
      this.firstCardClicked = this.gameBoard[this.firstCardCoordinates.col][this.firstCardCoordinates.row];
      this.firstCardClicked.divElement.classList.add('card_selected');
      this.clickNumber++;
      return this.clickNumber;
    }
    if (this.clickNumber === 1 && element === this.firstCardClicked.divElement) {
      this.removeAdjecentCardClass();
      this.firstCardClicked.divElement.classList.remove('card_selected');
      this.reinitializeClickedCards();
      this.clickNumber--;
      return this.clickNumber;
    }
    this.secondCardCoordinates = this.returnCardCoordinates(element);
    this.secondCardClicked = this.gameBoard[this.secondCardCoordinates.col][this.secondCardCoordinates.row];
    this.secondCardClicked.divElement.classList.add('card_selected');
    this.removeAdjecentCardClass();
    this.clickNumber++;
    return 2;
  }

  returnCardCoordinates(element) {
    const coordinates = {
      col: parseInt(element.dataset.col),
      row: parseInt(element.dataset.row)
    }
    return coordinates;
  }

  showWhichCardsToSwitch() {
    const adjacentCards = this.returnAllAdjacentCards(this.firstCardCoordinates.col, this.firstCardCoordinates.row);
    for (let cardIndex = 0; cardIndex < adjacentCards.length; cardIndex++) {
      if (adjacentCards[cardIndex]) {
        adjacentCards[cardIndex].divElement.classList.add('card_adjacent', 'clickable');
      }
    }
  }

  returnAllAdjacentCards(col, row) {
    const adjacentCards = [];
    adjacentCards[0] = this.returnCard(col, row + 1); //top
    adjacentCards[1] = this.returnCard(col + 1, row); //right
    adjacentCards[2] = this.returnCard(col, row - 1); //bottom
    adjacentCards[3] = this.returnCard(col - 1, row); //left
    return adjacentCards;
  }

  returnCard(col, row) {
    if (row < 0 || row > this.numOfRows - 1 || col < 0 || col > this.numOfCols - 1) {
      return null;
    }
    return this.gameBoard[col][row];
  }

  removeAdjecentCardClass() {
    const adjacentCards = this.returnAllAdjacentCards(this.firstCardCoordinates.col, this.firstCardCoordinates.row);
    for (let cardIndex = 0; cardIndex < adjacentCards.length; cardIndex++) {
      if (adjacentCards[cardIndex]) {
        adjacentCards[cardIndex].divElement.classList.remove('card_adjacent');
      }
    }
  }

  reinitializeClickedCards() {
    this.firstCardClicked = null;
    this.firstCardCoordinates = [];
    this.firstCardColMatches = [];
    this.firstCardRowMatches = [];
    this.secondCardClicked = null;
    this.secondCardCoordinates = [];
    this.secondCardColMatches = [];
    this.secondCardRowMatches = [];
  }

  switchCards() {
    const firstCardAllClasses = this.firstCardClicked.divElement.className;
    const firstCardClass = this.firstCardClicked.class;
    const firstCardPicElement = this.firstCardClicked.divElement.removeChild(this.firstCardClicked.picElement);
    const secondCardAllClasses = this.secondCardClicked.divElement.className;
    const secondCardClass = this.secondCardClicked.class;
    const secondCardPicElement = this.secondCardClicked.divElement.removeChild(this.secondCardClicked.picElement);
    this.firstCardClicked.divElement.appendChild(secondCardPicElement);
    this.secondCardClicked.divElement.appendChild(firstCardPicElement);
    this.firstCardClicked.divElement.className = secondCardAllClasses;
    this.secondCardClicked.divElement.className = firstCardAllClasses;
    this.firstCardClicked.class = secondCardClass;
    this.secondCardClicked.class = firstCardClass;
    this.firstCardClicked.picElement = secondCardPicElement;
    this.secondCardClicked.picElement = firstCardPicElement;
    return new Promise(resolve => resolve());
  }

  async callFunctionsAsync() {
    await this.cardMatchCheck();
    await this.updateStats();
    await this.checkForCombos();
    await this.checkForMoreMoves();
    await this.makeCardsClickable();
  }

  async cardMatchCheck() {
    console.log('card match check');
    await this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardRowMatches, 'row');
    await this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardColMatches, 'column');
    await this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardRowMatches, 'row');
    await this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardColMatches, 'column');
    const ifThreeOrMoreMatchedFirstCard = await this.removeIfThreeOrMoreMatchedCards(this.firstCardClicked, this.firstCardColMatches, this.firstCardRowMatches);
    if (!ifThreeOrMoreMatchedFirstCard) {
      this.firstCardClicked.divElement.classList.remove('card_selected');
    }
    const ifThreeOrMoreMatchedSecondCard = await this.removeIfThreeOrMoreMatchedCards(this.secondCardClicked, this.secondCardColMatches, this.secondCardRowMatches);
    if (!ifThreeOrMoreMatchedSecondCard) {
      this.secondCardClicked.divElement.classList.remove('card_selected');
    }
    if (!ifThreeOrMoreMatchedFirstCard && !ifThreeOrMoreMatchedSecondCard) {
      this.noMatches = true;
      await new Promise(resolve => {
        setTimeout(this.switchCards, 200);
        setTimeout(resolve, 200);
      });
    }
    this.firstCardColMatches = [];
    this.firstCardRowMatches = [];
    this.secondCardColMatches = [];
    this.secondCardRowMatches = [];
    return new Promise(resolve => resolve());
  }

  findMoreCardsInSameDirection(card, matchedArr, rowOrCol) {
    const cardCoordinates = {col: card.col, row: card.row};
    if (rowOrCol === 'row') {
      const cardsInSameRow = this.returnAdjacentCardsInSameRow(cardCoordinates.col, cardCoordinates.row);
      for (let adjIndex = 0; adjIndex < cardsInSameRow.length; adjIndex++) {
        if (cardsInSameRow[adjIndex]) {
          if (this.checkIfCardsMatch(card, cardsInSameRow[adjIndex]) && !this.isCardAlreadyPushed(cardsInSameRow[adjIndex], matchedArr)) {
            matchedArr.push(cardsInSameRow[adjIndex]);
            this.findMoreCardsInSameDirection(cardsInSameRow[adjIndex], matchedArr, 'row');
          }
        }
      }
    } else {
      const cardsInSameColumn = this.returnAdjacentCardsInSameColumn(cardCoordinates.col, cardCoordinates.row);
      for (let cIndex = 0; cIndex < cardsInSameColumn.length; cIndex++) {
        if (cardsInSameColumn[cIndex]) {
          if (this.checkIfCardsMatch(card, cardsInSameColumn[cIndex]) && !this.isCardAlreadyPushed(cardsInSameColumn[cIndex], matchedArr)) {
            this.pushIntoColumnArray(cardsInSameColumn[cIndex], matchedArr);
            this.findMoreCardsInSameDirection(cardsInSameColumn[cIndex], matchedArr, 'col');
          }
        }
      }
    }
    return new Promise(resolve => resolve());
  }

  pushIntoColumnArray(card, arr) {
    for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
      if (card.row > arr[arrIndex].row) {
        arr.splice(arrIndex, 0, card);
        return;
      }
    }
    arr.push(card);
  }

  checkIfCardsMatch(card1, card2) {
    if (card1.class === card2.class) {
      return true;
    }
    return false;
  }

  isCardAlreadyPushed(card, cardArr) {
    if (card.divElement.classList.contains('card_selected') || card.divElement.classList.contains('card_matched')) {
      return true;
    }
    for (let cardArrIndex = 0; cardArrIndex < cardArr.length; cardArrIndex++) {
      if (card.col === cardArr[cardArrIndex].col && card.row === cardArr[cardArrIndex].row) {
        return true;
      }
    }
    return false;
  }

  returnAdjacentCardsInSameRow(col, row) {
    const cardsInSameRow = [];
    cardsInSameRow[0] = this.returnCard(col - 1, row); //left
    cardsInSameRow[1] = this.returnCard(col + 1, row); //right
    return cardsInSameRow;
  }

  returnAdjacentCardsInSameColumn(col, row) {
    const cardsInSameCol = [];
    cardsInSameCol[0] = this.returnCard(col, row + 1); //top
    cardsInSameCol[1] = this.returnCard(col, row - 1); //bottom
    return cardsInSameCol;
  }

  async removeIfThreeOrMoreMatchedCards(card, colMatches, rowMatches) {
    var cardsToRemove = [];
    if (rowMatches.length < 2 && colMatches.length < 2) {
      console.log('remove if three or more matched cards false');
      return new Promise(resolve => resolve(false));
    }
    if (colMatches.length >= 2) {
      this.pushIntoColumnArray(card, colMatches);
      if (rowMatches.length < 2) {
        cardsToRemove = colMatches;
      } else {
        cardsToRemove = colMatches.concat(rowMatches);
      }
    } else {
      rowMatches.push(card);
      cardsToRemove = rowMatches;
    }
    for (let cardNum = 0; cardNum < cardsToRemove.length; cardNum++) {
      cardsToRemove[cardNum].divElement.classList.add('card_matched');
    }
    this.cardsCleared += cardsToRemove.length;
    await this.collapseCards(cardsToRemove);
    await this.removeCards(cardsToRemove);
    await this.repopulateColumns();
    console.log('remove if three or more matched cards true');
    return new Promise(resolve => resolve(true));
  }

  collapseCards(cardArr) {
    console.log('collapse cards');
    for (let cardIndex = 0; cardIndex < cardArr.length; cardIndex++) {
      cardArr[cardIndex].divElement.classList.add('collapse');
    }
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  removeCards(cardArr) {
    console.log('remove cards');
    for (let cardIndex = 0; cardIndex < cardArr.length; cardIndex++) {
      const cardElementToRemove = cardArr[cardIndex].divElement
      cardElementToRemove.parentNode.removeChild(cardElementToRemove);
      this.gameBoard[cardArr[cardIndex].col].splice(cardArr[cardIndex].row, 1);
    }
    return new Promise(resolve => resolve());
  }

  repopulateColumns() {
    console.log('repopulate columns');
    for (let colIndex = 0; colIndex < this.numOfCols; colIndex++) {
      if (this.gameBoard[colIndex].length < 8) {
        for (let rowIndex = this.gameBoard[colIndex].length; rowIndex < 8; rowIndex++) {
          const newRandomCardClass = this.returnRandomCardClass();
          this.createNewCard(newRandomCardClass, colIndex, rowIndex);
        }
      }
    }
    this.reinitializeCardRows();
    return new Promise(resolve => resolve());
  }

  reinitializeCardRows() {
    for (let col = 0; col < this.numOfCols; col++) {
      for (let row = 0; row < this.numOfRows; row++) {
        this.gameBoard[col][row].row = row;
        this.gameBoard[col][row].divElement.dataset.row = row;
      }
    }
  }

  async checkForCombos() {
    console.log('check for combos');
    if (this.noMatches){
      this.noMatches = false;
      return new Promise(resolve => resolve());
    }
    for (let col = 0; col < this.numOfRows; col++) {
      for (let row = 0; row < this.numOfCols; row++) {
        var comboRows = [];
        var comboCols = [];
        const comboCard = this.gameBoard[col][row];
        comboCard.divElement.classList.add('card_selected');
        await this.findMoreCardsInSameDirection(comboCard, comboCols, 'col');
        await this.findMoreCardsInSameDirection(comboCard, comboRows, 'row');
        const threeOrMoreMatchedCards = await this.removeIfThreeOrMoreMatchedCards(comboCard, comboCols, comboRows);
        if (threeOrMoreMatchedCards === true) {
          await this.checkForCombos();
          return new Promise(resolve => resolve());
        }
        comboCard.divElement.classList.remove('card_selected');
      }
    }
    this.updateStats();
    this.noMatches = false;
    return new Promise(resolve => resolve());
  }

  checkForMoreMoves() {
    console.log('check for more moves');
    for (let col = 0; col < this.numOfRows; col++) {
      for (let row = 0; row < this.numOfCols; row++) {
        this.firstCardClicked = this.gameBoard[col][row];
        this.firstCardClicked.divElement.classList.add('card_selected');
        const checkAdjCards = this.returnAllAdjacentCards(col, row);
        for (let checkIndex = 0; checkIndex < 4; checkIndex++) {
          if (checkAdjCards[checkIndex]) {
            this.secondCardClicked = checkAdjCards[checkIndex];
            this.secondCardClicked.divElement.classList.add('card_selected');
            this.switchCards();
            this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardColMatches, 'col');
            this.findMoreCardsInSameDirection(this.firstCardClicked, this.firstCardRowMatches, 'row');
            this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardColMatches, 'col');
            this.findMoreCardsInSameDirection(this.secondCardClicked, this.secondCardRowMatches, 'row');
            if (this.firstCardColMatches.length >= 2 || this.firstCardRowMatches.length >= 2 ||
              this.secondCardColMatches.length >= 2 || this.secondCardRowMatches.length >= 2) {
              this.switchCards();
              this.firstCardClicked.divElement.classList.remove('card_selected');
              this.secondCardClicked.divElement.classList.remove('card_selected');
              this.reinitializeClickedCards();
              if (this.cardsCleared >= this.cardsClearedToWin) {
                this.renderGameOverScreen();
              }
              return new Promise (resolve => resolve(true));
            }
            this.switchCards();
            this.secondCardClicked.divElement.classList.remove('card_selected');
            this.firstCardColMatches = [];
            this.firstCardRowMatches = [];
            this.secondCardColMatches = [];
            this.secondCardRowMatches = [];
          }
        }
        this.firstCardClicked.divElement.classList.remove('card_selected');
      }
    }
    this.renderGameOverScreen();
    return new Promise (resolve => resolve(false));
  }

  gameOver() {
    this.domElements.gameOverScreen.style.display = 'inherit';
  }

  resetGame() {
    this.domElements.gameOverScreen.style.display = 'none';
    this.resetGameBoard();
    this.renderCardElements();
    this.updateStats();
  }

}
