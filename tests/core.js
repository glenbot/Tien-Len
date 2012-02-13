test('game initialization', function() {
    var init_exc_1 = "Game must be initialize with an array of player names";
    var init_exc_2 = "There must be at least 2 players to initialize a game";

    // test invalid initialization
    raises(function() {
        Game(1,2);
    }, function(err) {
        return err === init_exc_1;
    }, "Game(1,2) is not a valid initialization");

    raises(function() {
        Game('player1', 'player2');
    }, function(err) {
        return err === init_exc_1;
    }, "Game('player1', 'player2') is not a valid initialization");

    raises(function() {
        Game(['Player1']);
    }, function(err) {
        return err === init_exc_2;
    }, "Game(['Player1'] is valid but not enough players");

    var game = Game(['Player1', 'Player 2']);
    ok(game instanceof Game, "Game(['Player1', 'Player 2'] is a correct initialization)");
});

test('game attributes', function() {
    var game = Game(['Player1', 'Player 2']);
    
    ok(game.deck instanceof Deck, 'game.deck instanceof Deck');
    ok(game.players[0] instanceof Player, 'game.players[0] instanceof Player');
    ok(game.players[1] instanceof Player, 'game.players[1] instanceof Player');
});

/**
* General ChosenHand Tests
*/
test('chosen_hand.is_valid', function() {
    var chosen_hand = null;

    // single card play
    var cards = [Card('ace-spades')];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_valid, chosen_hand.to_string() + ' is valid single.');

    // two of a kind play
    cards = [Card('two-clubs'), Card('two-diamonds')];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_valid, chosen_hand.to_string() + ' is valid two of a kind');

    // three of a kind play
    cards = [
        Card('three-clubs'),
        Card('three-diamonds'),
        Card('three-spades'),
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_valid, chosen_hand.to_string() + ' is valid three of a kind');

    // four of a kind play
    cards = [
        Card('four-clubs'),
        Card('four-diamonds'),
        Card('four-spades'),
        Card('four-hearts')
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_valid, chosen_hand.to_string() + ' is valid four of a kind');

    // straight play
    cards = [
        Card('eight-clubs'),
        Card('nine-diamonds'),
        Card('ten-spades'),
        Card('jack-hearts')
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_valid, chosen_hand.to_string() + ' is valid straight');

    // straight of pairs play
    cards = [
        Card('eight-clubs'),
        Card('eight-diamonds'),
        Card('nine-spades'),
        Card('nine-hearts'),
        Card('ten-hearts'),
        Card('ten-spades')
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_valid, chosen_hand.to_string() + ' is valid paired straight');
})

test('chosen_hand.is_sequential', function() {
    var chosen_hand = null;
    var cards = [
        Card('three-clubs'),
        Card('four-spades'),
        Card('five-diamonds'),
        Card('six-hearts')
    ];

    chosen_hand = ChosenHand(cards);
    ok(chosen_hand.is_sequential(), chosen_hand.to_string() + ' is sequential');

    cards = [
        Card('jack-clubs'),
        Card('queen-spades'),
        Card('king-diamonds'),
        Card('ace-hearts')
    ];

    chosen_hand = ChosenHand(cards);
    ok(chosen_hand.is_sequential(), chosen_hand.to_string() + ' is sequential');
})

test('chosen_hand.is_lock', function() {
    var chosen_hand = null;
    var cards = [
        Card('three-clubs'),
        Card('four-clubs'),
        Card('five-clubs'),
        Card('six-clubs')
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_lock, chosen_hand.to_string() + ' is a lock');

    cards = [
        Card('queen-hearts'),
        Card('king-hearts'),
        Card('ace-hearts')
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_lock, chosen_hand.to_string() + ' is a lock');
})

test('chosen_hand.is_buster', function() {
    var chosen_hand = null;
    var cards = [
        Card('three-clubs'),
        Card('three-spades'),
        Card('three-hearts'),
        Card('three-diamonds')
    ];
    
    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_buster, chosen_hand.to_string() + ' is a buster');

    var cards = [
        Card('three-clubs'),
        Card('three-spades'),
        Card('four-hearts'),
        Card('four-diamonds'),
        Card('five-clubs'),
        Card('five-diamonds')
    ];

    chosen_hand = ChosenHand(cards);
    chosen_hand.set_hand();
    ok(chosen_hand.is_buster, chosen_hand.to_string() + ' is a buster');
})
