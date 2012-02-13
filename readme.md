# Tien Len

Side project. Creating an HTML 5 version of the card game Tien Len.
It's currently in an infant state.

### What is Tien Len?

Old school card game I used to play in High School. Very underrated.

### How do I play this Tien Len?

See rules. http://www.pagat.com/climbing/thirteen.html

### Can I contribute?

Sure, Just fork it and go. Pull requests accepted ;)

### TODO

- finish text only version of the game
- create visual version with AI only
- create multiplayer version using Tornado or Node.js

### Current example

Choosing a card:

    > var game = Game(['Glenbot', 'Computer Player 1']);
    > game.players[0].name
    "Glenbot"
    > game.players[0].hand.to_string();
    ["Three of Diamonds", "Three of Hearts", "Six of Diamonds", "Seven of Clubs", "Eight of Diamonds", "Nine of Hearts", "Queen of Clubs", "Queen of Diamonds", "Queen of Hearts", "King of Spades", "Ace of Clubs", "Ace of Diamonds", "Two of Diamonds"]
    > game.players[0].choose_card('three-diamonds');

Setting a hand:

    > var game = Game(['Glenbot', 'Computer Player 1']);

    > game.players[0].hand.to_string();
    ["Four of Diamonds", "Five of Clubs", "Six of Clubs", "Six of Diamonds", "Nine of Spades", "Nine of Clubs", "Nine of Hearts", "Ten of Clubs", "Jack of Hearts", "Queen of Clubs", "King of Spades", "Ace of Hearts", "Two of Spades"]

    > game.players[0].choose_card('nine-spades');
    > game.players[0].choose_card('nine-clubs');
    > game.players[0].choose_card('nine-hearts');

    > game.players[0].chosen_hand.to_string();
    ["Nine of Spades", "Nine of Clubs", "Nine of Hearts"]

    > game.players[0].chosen_hand.set_hand();

    > game.players[0].chosen_hand.hand_type;
    "trk"

    > game.players[0].chosen_hand.human_hand_type;
    "Three of a Kind"

    > game.players[0].chosen_hand.is_valid;
    true

    > game.players[0].chosen_hand.value;
    27.699999999999996

### License - MIT

Copyright (c) 2012 Glen Zangirolami

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
