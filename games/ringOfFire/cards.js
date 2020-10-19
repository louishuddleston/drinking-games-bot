exports.availableCards = [
  { name: '2', fileName: '2D.png' },
  { name: '3', fileName: '3D.png' },
  { name: '4', fileName: '4D.png' },
  { name: '5', fileName: '5D.png' },
  { name: '6', fileName: '6D.png' },
  { name: '7', fileName: '7D.png' },
  { name: '8', fileName: '8D.png' },
  { name: '9', fileName: '9D.png' },
  { name: '10', fileName: '10D.png' },
  { name: 'J', fileName: 'JD.png' },
  { name: 'Q', fileName: 'QD.png' },
  { name: 'K', fileName: 'KD.png' },
  { name: 'A', fileName: 'AD.png' },
  { name: '2', fileName: '2H.png' },
  { name: '3', fileName: '3H.png' },
  { name: '4', fileName: '4H.png' },
  { name: '5', fileName: '5H.png' },
  { name: '6', fileName: '6H.png' },
  { name: '7', fileName: '7H.png' },
  { name: '8', fileName: '8H.png' },
  { name: '9', fileName: '9H.png' },
  { name: '10', fileName: '10H.png' },
  { name: 'J', fileName: 'JH.png' },
  { name: 'Q', fileName: 'QH.png' },
  { name: 'K', fileName: 'KH.png' },
  { name: 'A', fileName: 'AH.png' },
  { name: '2', fileName: '2S.png' },
  { name: '3', fileName: '3S.png' },
  { name: '4', fileName: '4S.png' },
  { name: '5', fileName: '5S.png' },
  { name: '6', fileName: '6S.png' },
  { name: '7', fileName: '7S.png' },
  { name: '8', fileName: '8S.png' },
  { name: '9', fileName: '9S.png' },
  { name: '10', fileName: '10S.png' },
  { name: 'J', fileName: 'JS.png' },
  { name: 'Q', fileName: 'QS.png' },
  { name: 'K', fileName: 'KS.png' },
  { name: 'A', fileName: 'AS.png' },
  { name: '2', fileName: '2C.png' },
  { name: '3', fileName: '3C.png' },
  { name: '4', fileName: '4C.png' },
  { name: '5', fileName: '5C.png' },
  { name: '6', fileName: '6C.png' },
  { name: '7', fileName: '7C.png' },
  { name: '8', fileName: '8C.png' },
  { name: '9', fileName: '9C.png' },
  { name: '10', fileName: '10C.png' },
  { name: 'J', fileName: 'JC.png' },
  { name: 'Q', fileName: 'QC.png' },
  { name: 'K', fileName: 'KC.png' },
  { name: 'A', fileName: 'AC.png' },
];

exports.getCards = (array) => {
  let currentIndex = array.length; let temporaryValue; let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


exports.rules = {
  2: '2 is **Choose**:\nYou choose a person to drink.',
  3: '3 is **Me**:\nYou must drink!',
  4: '4 is **Whores**:\nAll Females must drink.',
  5: '5 is **Thumbmaster**:\nYou are now the Thumbmaster, you can send a 👍 emoji at any time. Everyone must respond with a 👍 ASAP. The last person to do it must drink!.\nOnce this card is picked again, all powers are passed on.',
  6: '6 is **Dicks**:\nAll men must drink.',
  7: '7 is **Heaven**:\nAs soon as this card is picked, everyone must send this emoji 🙌.\nThe last person to do it must drink!',
  8: '8 is **Mate**:\nYou choose someone to drink with you.',
  9: '9 is **Rhyme**:\nYou choose a word, going round the group everyone must say a word that rhymes with it.\nIf you hesitate for too long, get it wrong or say a word that has already been said. You must drink!',
  10: '10 is **Categories**:\nYou choose a category e.g (make of cars), going round the group everyone must say a word related to that category.\nIf you hesitate for too long, say a word that has already been said, or get it wrong. You must drink!',
  J: 'Jack is **Make up a rule**:\nYou make up a rule to be played in the game until the next Jack is picked.',
  Q: 'Queen is **Question Master**:\nYou are now the Question Master, if anyone responds to a question from you they must drink.\nOnce this card is picked again, all powers are passed on.',
  K: 'King is **Take a shot**:\nTake a shot for the first three kings, if you have picked the last king, you must finish your drink!',
  A: 'Ace is **Waterfall**:\nStarting from the person that picked the card, going round the group everyone must drink until the person before you stops drinking.',
};
