let cards = [
    "fa fa-diamond", "fa fa-diamond",
    "fa fa-paper-plane-o", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-anchor",
    "fa fa-bolt", "fa fa-bolt",
    "fa fa-cube", "fa fa-cube",
    "fa fa-leaf", "fa fa-leaf",
    "fa fa-bicycle", "fa fa-bicycle",
    "fa fa-bomb", "fa fa-bomb"
];

let deck = $('.deck');
let movesDisplay = $('.moves');
let starsDisplay = $('.stars');
let restartButton = $('.restart');

let openCards, matchCount, movesCount, startTime, timerId;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function start() {
    openCards = [];
    matchCount = 0;
    movesCount = 0;

    movesDisplay.text(movesCount);
    deck.children().remove();
    starsDisplay.children().remove();

    for (let i = 0; i < 3; i++) {
        starsDisplay.append('<li><i class="fa fa-star"><i></li>');
    }

    cards = shuffle(cards);
    for (let card of cards) {
        deck.append('<li class="card"><i class="' + card + '"></i></li>');
    }

    startTime = new Date();
    timerId = setInterval(updateTime, 100);
}

function showClickedCard(card) {
    card.addClass('show open');
}

function addCardToOpenCardsList(card) {
    openCards.push(card);
}

function openCardsMatch() {
    let card1 = openCards[0].children().attr('class');
    let card2 = openCards[1].children().attr('class');

    return card1 === card2;
}

function lockOpenCards() {
    for (card of openCards) {
        card.removeClass('open');
        card.addClass('match');
    }

    openCards = [];
}

function hideOpenCards() {
    for (card of openCards) {
        card.removeClass('open');
        card.removeClass('show');
    }
    
    openCards = [];
}

function updateMovesCountAndDisplay() {
    movesCount++;
    movesDisplay.text(movesCount);
}

function updateStarsDisplay() {
    if (!(movesCount % 12)) {
        starsDisplay.children().last().remove();
    }
}

function allCardsMatched() {
    return (matchCount == 8);
}

function displayFinalScore() {
    let finalStars = '';
    let finalStarsCount = starsDisplay.children().length;

    for (let i = 0; i < finalStarsCount; i++) {
        finalStars += '<i class="fa fa-star"></i>';
    }

    $('.final-stars').html(finalStars);
    $('.movesCount').text(movesCount);
    $('.final-time').text($('.elapsed-time').text());
    $('.modal').css('display', 'flex');
}

function updateTime() {
    $('.elapsed-time').text((Date.now() - startTime) / 1000);
}

deck.on('click', 'li', function(e) {
    // Ignore the clicks on already matched cards
    if (!($(this).hasClass('match') || $(this).hasClass('show'))) {
        showClickedCard($(this));
        addCardToOpenCardsList($(this));

        if (openCards.length == 2) {
            if (openCardsMatch()) {
                lockOpenCards();
                matchCount++;
            } else {
                setTimeout(hideOpenCards, 300);
            }

            updateMovesCountAndDisplay();
            updateStarsDisplay();
        }

        if (allCardsMatched()) {
            clearInterval(timerId);
            displayFinalScore();
        }
    }
});

restartButton.click(function() { 
    clearInterval(timerId);
    start();
});

$('.close-modal-button').click(function() {
    $('.final-stars').children().remove();
    $('.modal').css('display', 'none');
    start();
});

start();
