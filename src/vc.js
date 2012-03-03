/**
* Tien Len 13
*
* :copyright: (c) 2012 by Glen Zangirolami. 
* :license: MIT.
*/

/**
* Hand Object
*
* Will control all actions associated with
* a players hand such as: sort, get_card,
* add_card, etc ...
*
* Example:
* > var cards = [Card('queen-hearts'), Card('jack-clubs')];
* > var hand = Hand(cards);
*/
var Hand = Class.$extend({
  __init__ : function(cards) {
    this.cards = cards;

    // Total Hand Value
    this.value = 0;

    this.initialize();
  },

  /* Initialize hand parameters */
  initialize: function() {
    this.sort();  
  },

  /** 
   * Sorts the cards in the deck using an
   * insertion sort by card value
   */
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

  /** 
   * Calculate and set the total value of a hand
   */
  set_value: function() {
    for (i = 0; i < this.cards.length; i++) {
      this.value += this.cards[i].value;
    } 
  },

  /** 
   * Add a card to the hand
   * card - a card object
   *
   * Example:
   *  > hand.add_card(Card('queen-hearts'));
   */
  add_card: function(card) {
    this.cards.push(card);
  },

  /** 
   * Add cards to the hand
   * card - a csrd object
   *
   * Example:
   *  > hand.add_cards([
   *      Card('queen-hearts'),
   *      Card('queen-diamonds'),
   *    ]);
   */
  add_cards: function(cards) {
    for (var i in cards) {
        this.cards.push(cards[i]);
    } 
  },

  /** 
   * Get a card from the hand
   * card - a string of the cards codename
   */
  get_card : function(card) {
    for (i = 0; i < this.cards.length; i++) {
      if (this.cards[i].card == card)
        return this.cards[i];
    } 
    return [];
  },

  /** 
   * Remove a card from the hand
   * card - a string of the cards codename
   */
  remove_card : function(card) {
    for (i = 0; i < this.cards.length; i++) {
      if (this.cards[i].card == card) {
        this.cards.splice(i, 1);
        break;
      }
    }   
  },

  /** 
   * Remove all cards from the hand
   */
  remove_all_cards : function() {
    this.cards = []; 
  },

  /** 
   * Convert the cards in the hand to a 
   * more readable list format
   *
   * Assumes sort has been called
   */
  lowest_card : function() {
    return this.cards[0];
  },

  /** 
   * Convert the cards in the hand to a 
   * more readable list format
   *
   * example:
   *  > hand.to_sting();
   *  > ['queen-hears', 'ace-spades', 'jack-clubs']
   */
  to_string: function() {
    var card_strings = [];

    for (i = 0; i < this.cards.length; i++) {
      card_strings.push(this.cards[i].human_name);
    }

    return card_strings;
  }
});

/**
* Chosen Hand Object (Hand Child)
*
* Will control all actions associated with
* a players chosen hand such as: sort, get_card,
* add_card, etc ..
*
* Example:
* > var cards = [Card('queen-hearts'), Card('jack-clubs')];
* > var hand = ChosenHand(cards);
*/
var ChosenHand = Hand.$extend({
  __init__ : function(cards) {
    this.cards = cards || [];

    // Total Hand Value
    this.value = 0;

    // Boolean for valid hand
    this.is_valid = false;

    // Booleans for special hands
    this.is_buster = false;
    this.is_lock = false;

    // Hand type and types for human
    // readable purposes
    this.human_hand_type = '';
    this.human_hand_types = {
      's': 'Single',
      'tk': 'Two of a Kind',
      'trk': 'Three of a Kind',
      'fk': 'Four of a kind (buster)',
      'str': 'Straight',
      'sl': 'Straight Lock',
      'sp': 'Straight of Pairs (buster)'
    };

    // Hand type for logic
    this.hand_type = '';
  },

  /** 
   * Resets a hand to default values
   */
  reset : function() {
    this.value = 0;
    this.human_hand_type = '';
    this.hand_type = '';
    this.is_valid = false;
    this.is_buster = false;
    this.is_lock = false;
  },


  /** 
   * Checks if one or more cards have
   * the same face values. For pairs
   * and three of a kind, and four
   * or a kind
   *
   * Returns boolean
   */ 
  have_same_face_values : function() {
    var same = false;
    var prev_face_value = 0;

    for (i =0; i < this.cards.length; i++) {
      if (prev_face_value > 0) {
        if (prev_face_value == this.cards[i].face_value) {
          same = true;
        } else {
          same = false;
        }
      }
      prev_face_value = this.cards[i].face_value;
    }

    return same;
  },

  /** 
   * Checks if one or more card have the same suit
   *
   * Returns boolean
   */ 
  have_same_suit : function() {
    var same = false;
    var prev_suit = '';

    for (i =0; i < this.cards.length; i++) {
      if (prev_suit != '') {
        if (prev_suit == this.cards[i].card.split('-')[1]) {
          same = true;
        } else {
          same = false;
        }
      }
      prev_suit = this.cards[i].card.split('-')[1];
    }

    return same;   
  },

  /** 
   * Checks if 2 or more cards are sequential
   *
   * Returns boolean
   */ 
  is_sequential : function(cards) {
    var cards = cards || this.cards;
    var desired_sequence = [];
    var fc_face_value = cards[0].face_value;

    for (i = fc_face_value; i < fc_face_value + cards.length; i++) {
      desired_sequence.push(i);
    }

    for (i = 0; i < cards.length; i++) {
        if (cards[i].face_value != desired_sequence[i])
            return false;
    }

    return true;
  },

   /** 
   * Checks if 3 or more card pairs are sequential
   *
   * Returns boolean
   */ 
  is_sequential_pairs : function() {
    var odd_indexed_cards = [];
    var even_indexed_cards = [];

    for (i = 0; i < this.cards.length; i++) {
      if ((i + 1) % 2 == 0)
        even_indexed_cards.push(this.cards[i]);
      if ((i + 1) % 2 == 1)
        odd_indexed_cards.push(this.cards[i]);        
    }

    return this.is_sequential(even_indexed_cards) && this.is_sequential(odd_indexed_cards);
  },

  /**
  * Checks to see if the cards make a
  * valid hand: two of a kind, three, etc.
  * Lots of logic here
  *
  * Possible hands:
  *   Single card
  *   Two of a kind
  *   Three of a kind
  *   Four of a kind (buster)
  *   Straight
  *   Straight of same suit (Lock)
  *   Straight of pairs (buster)
  */
  set_hand : function() {
    var hand_type = '';

    // reset hand flags
    this.reset();

    // detect single card
    if (this.cards.length == 1) {
      hand_type = 's';
      this.is_valid = true;
      this.hand_type = hand_type;
    }

    // detect two of a kind
    if (this.cards.length == 2) {
      if (this.have_same_face_values()) {
        hand_type = 'tk';
        this.is_valid = true;
      }
    }
        
    
    // detect three of a kind or straight
    if (this.cards.length == 3) {
      // detect three of a kind
      if (this.have_same_face_values()) {
        hand_type = 'trk';
        this.is_valid = true;
      }

      // detect straight
      if (this.is_sequential()) {
        hand_type = 'str';
        this.is_valid = true;

        if (this.have_same_suit())
          this.is_lock = true;
      }
    }

    // detect four of a kind, straight, and straight w/lock
    if (this.cards.length == 4) {
      // detect four of a kind
      if (this.have_same_face_values()) {
        hand_type = 'fk';
        this.is_valid = true;
        this.is_buster = true;
      }

      // detect straight
      if (this.is_sequential()) {
        hand_type = 'str';
        this.is_valid = true;

        if (this.have_same_suit())
          this.is_lock = true;
      }
    }

    // detect straight, paired straigh, and straight w/lock
    if (this.cards.length > 4) {
      // detect straight
      if (this.is_sequential()) {
        hand_type = 'str';
        this.is_valid = true;

        if (this.have_same_suit())
          this.is_lock = true;
      }

      // detect straight of pairs
      if (this.cards.length % 2 == 0 && this.cards.length >= 6) {
          if (this.is_sequential_pairs()) {
              this.is_valid = true;
              this.is_buster = true;
          }
      }
    } 

    // set the value and type of the hand
    this.set_value();
    this.hand_type = hand_type;
    this.human_hand_type = this.human_hand_types[hand_type];  
  }
});


/**
* Table Hand Object (Hand Child)
*
* Will control all actions associated with
* a hand that is layed on the table
*
* Example:
* > var cards = [Card('queen-hearts'), Card('jack-clubs')];
* > var hand = TableHand(cards);
*/
var TableHand = ChosenHand.$extend({
  __init__ : function(cards) {
    this.$super(cards || []);
  }
});


/**
* Card Object
*
* Creates a card object that contains
* cards raw value, face value, and human
* readable name
*
* Example:
* > var card = Card('queen-hearts');
*/
var Card = Class.$extend({
  __init__ : function(card) {
    /* Card raw value */
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

    /* Value modifier for suits */
    this.suit_modifier = {
      'hearts': 0.4,
      'diamonds': 0.3,
      'clubs': 0.2,
      'spades': 0.1
    }

    /* Card values and human name */
    this.face_value = 0;
    this.value = 0;
    this.human_name = '';

    this.initialize();
  },

  /* Initialize card parameters */
  initialize : function() {
    var split = this.card.split('-');
  
    // set the face value of the card for matching purposes
    this.face_value = this.face_values[split[0]];

    // set the numerical face value of the card
    this.value = this.face_values[split[0]] + this.suit_modifier[split[1]];

    // set the cards human name
    this.human_name = this.cap_first(split[0]) + ' of ' + this.cap_first(split[1]);
  },

  /** 
   * String functionality. Captializes
   * the first letter in a string
   *
   * example:
   *  > card.cap_first('any-string');
   *  > 'Any-string'
   */
  cap_first: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
});


/**
* Deck Object
*
* Holds all information about the games deck.
* Generates, shuffles, and deals
*
* Example:
* > var deck = Deck(num_of_players);
* > deck.shuffle();
* > var hands = deck.deal();
*/
var Deck = Class.$extend({
  __init__ : function(players) {
    /* Total number of players */
    this.players = players;

    /* All the hands that are dealt */
    this.hands = [];

    /* Cards left to deal and total amount to deal */
    this.cards_to_deal = 13 * players;
    this.cards_left_to_deal = 13 * players;

    /* A list holding the entire deck */
    this.deck = [];

    /* Card faces */
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

    /* Card suits */
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

  /** 
   * Shuffles the deck using Fisher-Yates algorithm
   */
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

  /** 
   * Deals the cards in a standard alternating
   * fashion for N players. Returns a list of
   * Hand objects
   */
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
  }
});


/**
* Player Object
*
* Stores player information and creates
* player abilities such as play hand, choose
* card, remove cards, etc.
*
* Example:
* > var hand = Hand(Card('queen-hearts'), Card('jack-clubs'));
* > var player = Player('name', hand, TableHand());
*/
var Player = Class.$extend({
  __init__ : function(name, hand, table_hand) {
    /* The players name */
    this.name = name || 'Rodrigo';

    /* A list of cards the player has */
    this.hand = hand;

    /* The byref table hand */
    this.table_hand = table_hand;

    /* Boolean if they are finished or not */
    this.is_finished = false;

    /* Boolean if player has passed */
    this.has_passed = false;

    /* Place they finished */
    this.place = 0;

    /* Cards the player has chosen to play */
    this.chosen_hand = ChosenHand();
  },

  /** 
   * Pass, if cards are in the chosen hand
   * place them back into the players hand
   * sort them, and reset the chosen_hand
   */
  pass : function() {
      // put the cards back in the hand
      for (i = 0; i < this.chosen_hand.cards.length; i++) {
          this.hand.add_card(this.chosen_hand.cards[i]);
      }
      this.hand.sort();
      this.chosen_hand.reset();
      this.has_passed = true;
  },

  /** 
   * Put the cards onto the table hand
   * 
   * Params allow_override Boolean Allow the player to override
   * the table hand. Happens when all players have passed.
   *
   * Returns [Boolean, Message String]
   */
  play : function(allow_override) {
    this.chosen_hand.set_hand();

    if (this.chosen_hand.is_valid) {
        var num_table_cards = this.table_hand.cards.length;

        // set the table hand
        this.table_hand.set_hand();

        // Play the hand regardless of the hand
        // on the table, happens when a player has control
        // because all other players have passed
        if (allow_override) {
            this.table_hand.remove_all_cards();
            this.table_hand.add_cards(this.chosen_hand.cards);
            this.chosen_hand.remove_all_cards();
            return [true, 'Hand is valid from override'];
        }

        // validate the hand and play if possible
        if (this.chosen_hand.hand_type == this.table_hand.hand_type || num_table_cards == 0) {
            if (this.chosen_hand.value > this.table_hand.value) {
                this.table_hand.remove_all_cards();
                this.table_hand.add_cards(this.chosen_hand.cards);
                this.chosen_hand.remove_all_cards();
                return [true, 'Hand is valid and better'];
            } else {
                return [false, 'Hand is valid, but not better'];
            }
        } else {
            return [false, 'Hand types do not match'];
        }
    }
    return [false, 'Hand is not valid'];
  },

  /** 
   * Choose a card from the players hand
   * and put in in the chosen hand.
   *
   * example:
   *  > player.choose_card('queen-hearts');
   */
  choose_card : function(card) {
    var chosen_card = this.hand.get_card(card);
    if (chosen_card.length != 0) {
      this.chosen_hand.add_card(chosen_card);
      this.hand.remove_card(card);
    }
  },

  /** 
   * Loses a card from the players hand
   * that the player might not have wanted
   *
   * example:
   *  > player.lose_card('queen-hearts');
   */
  lose_card : function(card) {
    var chosen_card = this.chosen_hand.get_card(card);
    if (chosen_card.length != 0) {
      this.chosen_hand.remove_card(card);
      this.hand.add_card(chosen_card);
      this.hand.sort();
    }
  },
});


/** 
 * Game Object
 * 
 * Bootstraps the entire game. Creates
 * all of the Player, Hand, Card, and Deck
 * objects and stores them in attributes.
 * Majority of the game play will happen here.
 * 
 * Example:
 * > var game = Game(['player_name', 'player_name']);
 */
var Game = Class.$extend({
  __init__ : function(players) {
    /* The numbers of players in the game */
    this.num_players = 0;

    /* A list of the player in the game */
    this.players = [];

    /* The Entire Deck */
    this.deck = null;

    /* All Hands */
    this.hands = null;

    /* Table Hand */
    this.table_hand = TableHand([]);

    /* Players who's turn it is */
    this.current_player = null;

    /* Status of the game */
    this.is_started = false;

    /* Game over - wah, wah */
    this.is_over = false;

    this.initialize(players);
  },

  initialize : function (players) {
    if (typeof(players) != 'object')
      throw "Game must be initialize with an array of player names";

    // get the number of players
    this.num_players = players.length;

    if (this.num_players <= 1)
      throw "There must be at least 2 players to initialize a game";

    // initialize the deck and shuffle
    this.deck = Deck(this.num_players);
    this.deck.shuffle();

    // deal the hands
    this.hands = this.deck.deal();

    // initialize the players with hands
    for (i = 0; i < players.length; i++) {
      this.players.push(Player(players[i], this.hands.pop(), this.table_hand));
    }

    this.set_start_player();
  },

  /** 
   * Detects who has the lowest card and
   * sets that player as the current_player
   */
  set_start_player : function() {
      var players = [];
      var g_counter = 0;

      // set a default start player
      players.push(this.players[0]);

      // get the real start player from card values
      for (i = 1; i < this.players.length; i++) {
        var i_card_value = this.players[i].hand.lowest_card().value;

        for (j = 0; j < players.length; j++) {
          var j_card_value = players[j].hand.lowest_card().value;
          if (i_card_value < j_card_value)
            g_counter++;
        }

        if (g_counter == players.length) {
          players.splice(0,0, this.players[i]);
        } else {
          players.push(this.players[i]);
        }
      }

      this.current_player = players[0];
  },

  /** 
   * Get the current players and automatically 
   * sets who needs to go next
   */
  set_next_player : function() {
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].name == this.current_player.name) {
        var next_index = (i + 1);

        // set index to zero if we are on the last player
        if (i == this.players.length - 1)
            next_index = 0

        if (this.players[next_index].is_finished) {
          continue; // go to next player if finished
        } else {
          this.current_player = this.players[next_index];
          break;
        }
      }
    }
  },

  /** 
   * Remove a player from the players list
   */
  remove_player : function(player) {
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].name == player.name) {
        this.players.splice(i, 1);
      }
    }
  },

  /** 
   * Reset all players had_passed flag
   */
  reset_passed_players : function() {
    for (i = 0; i < this.players.length; i++) {
      this.players[i].has_passed = false;
    }
  },

  /** 
  * Have all other players passed?
  * Returns Boolean
  */
  other_players_passed : function() {
    var passed_count = 0;
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].has_passed)
        passed_count++;
    }

    return ((this.players.length - 1) == passed_count);
  },

   /** 
   * Is this the second to last player?
   * Returns Boolean
   */
  is_second_to_last_player : function() {
    return ((this.players.length - this.player_finished_total()) == 1);
  },

  /** 
   * Calulate the current place total
   */
  player_finished_total : function() {
    var total = 0;

    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].is_finished) {
        total++;
      }
    }

    return total;
  },
 
   /** 
   * Set a player to finished
   */
  player_finish : function(player) {
    var place = this.player_finished_total();
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].name == player.name) {
        this.players[i].place = place + 1;
        this.players[i].is_finished = true;
      }
    } 
  },

  /** 
   * Will play the current players hand
   * to the table hand
   *
   * returns list of validity and reason
   * [boolean, msg]
   */
  player_play : function() {
    if (this.is_over)
      return [false, 'Game is over.']
    if (!this.is_started)
      return [false, 'Game has not started yet.'];

    // Set a default, if we see this, something bad
    // has happened in the logic
    var result = [false, 'Bad logic'];

    if (this.other_players_passed()) {
        // play with an overrid allowed.
        result = this.current_player.play(true);
        if (result[0] == true)
          this.reset_passed_players();
    } else {
        result = this.current_player.play(false);
    }

    // hand is valid and better
    if (result[0] == true) {
      // player is out of cards
      if (this.current_player.hand.cards.length == 0) {
        // set player to finished and set place
        this.player_finish(this.current_player);

        if (this.is_second_to_last_player()) {
          // end the game
          this.is_over = true;
          this.is_started = false;

          // eliminate the last player
          this.set_next_player();
          this.player_finish(this.current_player);
        } else {
          this.set_next_player();
        }
      } else {  // player still has cards
        this.set_next_player();
      }
    } 
    return result;
  },

  /** 
   * Gives the play to the next player
   */
  player_pass : function() {
      this.current_player.pass();
      this.set_next_player();

      return [true, 'passed'];
  },

  /** 
   * Sets the game started boolean
   * flag to true
   */
  start : function() {
    this.is_started = true;
  },

  /** 
   * Sets the game started boolean
   * flag to false
   */
  quit : function() {
    this.is_started = false;
  }
});
