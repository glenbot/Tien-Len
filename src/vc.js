/**
* Hand Object
*
*/
var Hand = Class.$extend({
  __init__ : function(cards) {
    this.cards = cards;

    this.initialize();
  },

  /* Initialize hand parameters */
  initialize: function() {
    this.sort();  
  },

  /* Insertion sort the players hand for them */
  sort : function() {
    for (i = 0; i < this.cards.length; i++) {
      var k = this.cards[i];
      var j = i - 1;

      while (j >= 0 && this.cards[j].value > k.value) {
        this.cards[j + 1] = this.cards[j];
        j--;
      }

      this.cards[j + 1] = k;
    }
  },

  lowest_card : function() {
    return this.cards[0];
  },

  to_string: function() {
    var card_strings = [];

    for (i = 0; i < this.cards.length; i++) {
      card_strings.push(this.cards[i].human_name);
    }

    return card_strings;
  }
});


/**
* Card Object
*
* Determinds face value of a card
* and possibly other stuff
*/
var Card = Class.$extend({
  __init__ : function(card) {
    this.card = card;

    /* A dictionary of the number/type of card
       and its associated face value */
    this.face_values = {
      'two': 15,
      'three': 3,
      'four': 4,
      'five': 5,
      'six': 6,
      'seven': 7,
      'eight': 8,
      'nine': 9,
      'ten': 10,
      'jack': 11,
      'queen': 12,
      'king': 13,
      'ace': 14
    };

    /* Point modifier for suits */
    this.suit_modifier = {
      'hearts': 0.4,
      'diamonds': 0.3,
      'clubs': 0.2,
      'spades': 0.1
    }

    /* A player holder for the card value */
    this.value = 0;
    this.human_name = '';

    this.initialize();
  },

  /* Initialize card parameters */
  initialize : function() {
    var split = this.card.split('-');
  
    // set the numerical face value of the card
    this.value = this.face_values[split[0]] + this.suit_modifier[split[1]];

    // set the cards human name
    this.human_name = this.cap_first(split[0]) + ' of ' + this.cap_first(split[1]);
  },

  cap_first: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
});


/**
* Deck Object
*
* Holds all the cards, shuffles
*
*/
var Deck = Class.$extend({
  __init__ : function(players) {
    /* Total number of players */
    this.players = players;

    /* All hands that are dealt */
    this.hands = [];

    /* Cards left to deal and total amount to deal */
    this.cards_to_deal = 13 * players;
    this.cards_left_to_deal = 13 * players;

    /* A dictionary of the entire deck */
    this.deck = [];

    /* Possible card face */
    this.faces = [
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'jack',
      'queen',
      'king',
      'ace'
    ]

    /* Possible card suit */
    this.suits = [
      'hearts',
      'diamonds',
      'clubs',
      'spades'
    ]

 	  this.gen_deck();
  },

  /* Generate the deck */
  gen_deck: function() {
    for (var i = 0; i < this.suits.length; i++) {
      for (var j = 0; j < this.faces.length; j++) {
        var card = this.faces[j] + '-' + this.suits[i];
        this.deck.push(card);
      }
    }
  },
 
  /* Shuffles the deck using Fisherâ€“Yates algorithm */
  shuffle : function() {
  	var new_deck = [];
  
    // copy over the deck
  	for (var i = 0; i < this.deck.length; i++) {
      new_deck.push(this.deck[i]);	
  	}

    // shuffle
  	for (var i = 51; i >= 0; i--) {
      var j = Math.floor(Math.random()*i)
      var j_val = new_deck[j];
      var i_val = new_deck[i];
      new_deck[j] = i_val;
      new_deck[i] = j_val;
  	}

    this.deck = new_deck;
  },

  /* Deals cards for N players */
  deal : function() {
    var current_player = 0;

    if (this.cards_left_to_deal == 0)
      return this.hands;

    // create some empty hands
    for (var i = 0; i < this.players; i++) {
      this.hands.push([]);
    }

    // fill the hands
    for (var i = 0; i < this.cards_to_deal; i++) {
      if (current_player == this.players) {
        current_player = 0;
      }
      this.hands[current_player].push(Card(this.deck.pop()));
      current_player++;
      this.cards_left_to_deal--;
    }

    // wrap cards in the hand object
    for (i = 0; i < this.hands.length; i++) {
      this.hands[i] = Hand(this.hands[i]);
    }

    return this.hands;
  },

  /* Add a player to the deck */
  add_player: function() {
    // TODO: Think through logic
    /*
    if ((this.players + 1) > 4) {
        return null;
    } else {
      this.players++;
    }
    */ 
  }
});


/** 
 * Player Object
 * 
 * Handles hands, status
 */
var Player = Class.$extend({
  __init__ : function(name, hand) {
    /* The players name */
    this.name = name || 'Rodrigo';

    /* A dictionary of cards the player has */
    this.hand = hand;

    /* Chosen - cards the player has chosen to play */
    this.chosen = {};
  },

  /* Play cards that are chosen */
  play : function() {
 
  },

  /* Choose card that will be played */
  choose_card : function() {
    
  },

  /* Removed cards from the hand after play */
  remove_cards : function() {
  
  }
});


/** 
 * Game Object
 * 
 * Handles number of players, new games
 * game winners, game statistics
 * 
 */
var Game = Class.$extend({
  __init__ : function(players) {
    /* The numbers of players in the game */
    this.num_players = 0;

    /* A list of the player objects in the game */
    this.players = [];

    /* The deck object */
    this.deck = null;

    /* The hands objects */
    this.hands = null;

    /* Player who won the game */
    this.winner = null;

    /* Player who is currently winning */
    this.current_winner = null;

    /* Players who's turn it is */
    this.current_player = null;

    /* Statud of the game */
    this.status = 'not_started';

    this.initialize(players);
  },

  initialize : function (players) {

    // get the number of players
    this.num_players = players.length;

    // initialize the deck and shuffle
    this.deck = Deck(this.num_players);
    this.deck.shuffle();

    // deal the hands
    this.hands = this.deck.deal();

    // initialize the players with hands
    for (i = 0; i < players.length; i++) {
      this.players.push(Player(players[i], this.hands.pop()));
    }
  },

  /* Start a new game */
  start : function() {
    this.status = 'started';
  },

  /* Quit the game */
  quit : function() {
    
  }
});
