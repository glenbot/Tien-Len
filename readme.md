# Tien Len

Side project. Creating an HTML 5 version of the card game Tien Len.
It's currently in an infant state.

Progress can be seen at http://tienlen13.net

### What is Tien Len?

Old school card game I used to play in High School. Very underrated.

### How do I play this Tien Len?

See rules. http://www.pagat.com/climbing/thirteen.html

### Can I contribute?

Sure, Just fork it and go. Pull requests accepted ;)

### Testing

Tien Len uses qunit to run tests. You can find current tests in the
tests folder.

### TODO

- finish text only version of the game
- create visual version with AI only
- create multiplayer version using Tornado or Node.js

### Current game play example

    var game = Game(['player1','player2']);
    game.start();

    game.current_player.hand.to_string();
    ["Three of Spades", "Three of Hearts", "Five of Spades", "Five of Clubs", "Five of Diamonds", "Six of Spades", "Six of Diamonds", "Eight of Spades", "Eight of Hearts", "Nine of Clubs", "Ten of Spades", "Queen of Hearts", "Ace of Diamonds"]
    game.current_player.choose_card('three-spades');
    game.current_player.choose_card('three-hearts');
    game.player_play();
    [true, "Hand is valid and better"]

    game.current_player.hand.to_string();
    ["Four of Spades", "Four of Diamonds", "Seven of Spades", "Seven of Diamonds", "Eight of Clubs", "Ten of Clubs", "Jack of Spades", "Jack of Hearts", "Queen of Spades", "King of Spades", "King of Hearts", "Ace of Spades", "Two of Diamonds"]
    game.current_player.choose_card('four-spades');
    game.current_player.choose_card('four-diamonds');
    game.player_play();
    [true, "Hand is valid and better"]

    game.current_player.hand.to_string();
    ["Five of Spades", "Five of Clubs", "Five of Diamonds", "Six of Spades", "Six of Diamonds", "Eight of Spades", "Eight of Hearts", "Nine of Clubs", "Ten of Spades", "Queen of Hearts", "Ace of Diamonds"]
    game.player_pass();
    [true, "passed"]
    game.current_player.hand.to_string();
    ["Seven of Spades", "Seven of Diamonds", "Eight of Clubs", "Ten of Clubs", "Jack of Spades", "Jack of Hearts", "Queen of Spades", "King of Spades", "King of Hearts", "Ace of Spades", "Two of Diamonds"]

and so on .......

### License - MIT

Copyright (c) 2012 Glen Zangirolami

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
