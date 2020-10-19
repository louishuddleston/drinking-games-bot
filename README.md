# Discord Drinking Games Bot
A drinking games bot for Discord

Add the live bot [here](https://discord.com/api/oauth2/authorize?client_id=705739513955352606&permissions=51264&scope=bot)

## Run locally with docker

Copy .env.sample to .env and add your Discord token

then run `npm start`

## Commands

**Ring of Fire:**

``!start rof`` Start a new game.

``!listrules`` List of rules.

``!pick`` Pick a card.

``!stop`` Stop the current game.

``!cardcount`` Shows the amount of cards left in the current game.


**Who\'s most likely to:**

Tag the person most likely to do what the question says, whoever gets the most votes must drink!

``!start mlt [amount of questions] [seconds to answer]`` Start a new game.

``!stop`` Stop the current game.