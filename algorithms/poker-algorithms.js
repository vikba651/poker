require('core-js/actual/array/group-by')

Array.prototype.sample = function () {
  return
}

export function PokerHand(button) {
  // let cardArray = cardStringToArray(hand)
  // let cardArray2 = cardStringToArray(hand2)
  console.log('Starting testing')
  let start = Date.now()
  for (let i = 0; i < 1; i++) {
    let unpack = generateTwoPlayerAllIn(button)
    printCardArray(unpack[0])
    console.log(hands[getHandQuality(unpack[0]).handType])
    console.log('---')
    printCardArray(unpack[1])
    console.log(hands[getHandQuality(unpack[1]).handType])
    console.log(isFirstWinner(unpack[1], unpack[1]))
  }
  const millis = Date.now() - start
  console.log(millis)
}
const suitEmoji = ['♧', '♦', '♥', '♤']
const suits = ['C', 'D', 'H', 'S']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const hands = [
  'Straight flush',
  'Four of a kind',
  'Full house',
  'Flush',
  'Straight',
  'Three of a kind',
  'Two pairs',
  'Pair',
  'High card',
]
const results = {
  win: 1,
  tie: 0,
  lose: -1,
}

function printCardArray(cardArray) {
  cardArray.forEach((card) => {
    console.log(`${card.rank} ${suitEmoji[suits.indexOf(card.suit)]}`)
  })
}

function cardStringToArray(handString) {
  let cardArray = handString.split(' ').map((card) => {
    return {
      rank: card.charAt(0),
      suit: card.charAt(1),
    }
  })
  return cardArray
}

function flush(cardArray, five_cards = true) {
  const suitGroups = cardArray.groupBy((suitGroup) => {
    return suitGroup.suit
  })
  let flushHand = []
  for (const suit in suitGroups) {
    if (suitGroups[suit].length >= 5) {
      flushHand = suitGroups[suit]
    }
  }
  flushHand = flushHand.sort(function (a, b) {
    return ranks.indexOf(a.rank) - ranks.indexOf(b.rank)
  })
  if (five_cards) {
    if (flushHand.len >= 5) {
      flushHand = flushHand.slice(-5)
    }
  }
  return flushHand
}

function straight(cardArray) {
  cardArray = cardArray.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank))
  let uniqueCardArray = ['A'].concat(ranks).map((rank) => {
    return cardArray.find((card) => card.rank === rank)
  })
  uniqueCardArray = uniqueCardArray.filter((card) => {
    return card !== undefined
  })
  let straightHand = []

  if (uniqueCardArray.length < 5) {
    return straightHand
  }
  const rankString = 'A' + ranks.map((rank) => rank).join('')

  for (let i = 0; i <= uniqueCardArray.length - 5; i++) {
    let cardString = uniqueCardArray
      .slice(i, i + 5)
      .map((card) => card.rank)
      .join('')
    if (rankString.includes(cardString)) {
      straightHand = uniqueCardArray.slice(i, i + 5)
    }
  }
  return straightHand
}

function filterCardArrayRank(cardArray, removeRanks) {
  cardArray = cardArray.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank))
  return cardArray.filter((card) => !removeRanks.includes(card.rank))
}

export function getHandQuality(cardArray) {
  const rankGroups = cardArray.groupBy((rankGroup) => {
    return rankGroup.rank
  })
  let quads = []
  let trips = []
  let pairs = []
  for (const rank in rankGroups) {
    if (rankGroups[rank].length === 4) {
      quads.push(rank)
    }
    if (rankGroups[rank].length === 3) {
      trips.push(rank)
      trips.sort((a, b) => ranks.indexOf(a) - ranks.indexOf(b))
    }
    if (rankGroups[rank].length === 2) {
      pairs.push(rank)
      pairs.sort((a, b) => ranks.indexOf(a) - ranks.indexOf(b))
    }
  }

  // prettier-ignore
  if (straight(flush(cardArray, five_cards = false)).length) {
    return {
      handType: hands.indexOf('Straight flush'),
      comp: undefined,
      highCards: straight(flush(cardArray)),
    }
  } else if (quads.length) {
    return {
      handType: hands.indexOf('Four of a kind'),
      comp: { quad: quads.pop() },
      highCards: filterCardArrayRank(cardArray, trips.slice(-1)).slice(-1),
    }
  } else if (trips.length & pairs.length) {
    return {
      handType: hands.indexOf('Full house'),
      comp: { trip: trips.pop(), pair: pairs.pop() },
      highCards: undefined,
    }
  } else if (flush(cardArray).length) {
    return {
      handType: hands.indexOf('Flush'),
      comp: undefined,
      highCards: flush(cardArray),
    }
  } else if (straight(cardArray).length) {
    return {
      handType: hands.indexOf('Straight'),
      comp: undefined,
      highCards: straight(cardArray),
    }
  } else if (trips.length) {
    return {
      handType: hands.indexOf('Three of a kind'),
      comp: {
        trip: trips[0],
      },
      highCards: filterCardArrayRank(cardArray, trips.pop()).slice(-2),
    }
  } else if (pairs.length >= 2) {
    return {
      handType: hands.indexOf('Two pairs'),
      comp: {
        pairs: pairs.slice(-2),
      },
      highCards: filterCardArrayRank(cardArray, trips.slice(-1)).slice(-1),
    }
  } else if (pairs.length) {
    return {
      handType: hands.indexOf('Pair'),
      comp: {
        pair: pairs[0],
      },
      highCards: filterCardArrayRank(cardArray, pairs).slice(-3),
    }
  } else {
    return {
      handType: hands.indexOf('High card'),
      comp: undefined,
      highCards: cardArray.slice(-5),
    }
  }
}

function isFirstWinner(cardArray1, cardArray2) {
  let handQuality1 = getHandQuality(cardArray1)
  let handQuality2 = getHandQuality(cardArray2)

  function highestCard(subCardArray1, subCardArray2) {
    for (let i = subCardArray1.length - 1; i >= 0; i--) {
      if (ranks.indexOf(subCardArray1[i].rank) > ranks.indexOf(subCardArray2[i].rank)) {
        return results.win
      } else if (ranks.indexOf(subCardArray1[i].rank) < ranks.indexOf(subCardArray2[i].rank)) {
        return results.lose
      }
    }
    return results.tie
  }

  function highestSetCard(setObject1, setObject2, setType) {
    if (ranks.indexOf(setObject1[setType]) > ranks.indexOf(setObject2[setType])) {
      return results.win
    } else if (ranks.indexOf(setObject1[setType]) < ranks.indexOf(setObject2[setType])) {
      return results.lose
    }
    return results.tie
  }

  function highestTwoPair(pairArray1, pairArray2) {
    while (pairArray1.pairs) {
      // Do this two times
      if (ranks.indexOf(pairArray1.pairs[-1]) > ranks.indexOf(pairArray2.pairs[-1])) {
        return results.win
      } else if (ranks.indexOf(pairArray1.pairs.pop()) < ranks.indexOf(pairArray2.pairs.pop())) {
        return results.lose
      }
    }
    return results.tie
  }

  if (handQuality1.handType === handQuality2.handType) {
    let outcome = results.tie
    if (hands[handQuality1.handType] === 'Straight flush') {
      return highestCard(handQuality1.highCards, handQuality2.highCards)
    } else if (hands[handQuality1.handType] === 'Four of a kind') {
      outcome = highestSetCard(handQuality1.comp, handQuality2.comp, 'quad')
      if (!outcome) {
        return highestCard(handQuality1.highCards, handQuality2.highCards)
      }
    } else if (hands[handQuality1.handType] === 'Full house') {
      outcome = highestSetCard(handQuality1.comp, handQuality2.comp, 'trip')
      if (!outcome) {
        return highestSetCard(handQuality1.comp, handQuality2.comp, 'pair')
      }
    } else if (hands[handQuality1.handType] === 'Flush') {
      return highestCard(handQuality1.highCards, handQuality2.highCards)
    } else if (hands[handQuality1.handType] === 'Straight') {
      return highestCard(handQuality1.highCards, handQuality2.highCards)
    } else if (hands[handQuality1.handType] === 'Three of a kind') {
      outcome = highestSetCard(handQuality1.comp, handQuality2.comp, 'trip')
      if (!outcome) {
        return highestCard(handQuality1.highCards, handQuality2.highCards)
      }
    } else if (hands[handQuality1.handType] === 'Two pairs') {
      outcome = highestTwoPair(handQuality1.comp, handQuality2.comp)
      if (!outcome) {
        return highestCard(handQuality1.highCards, handQuality2.highCards)
      }
    } else if (hands[handQuality1.handType] === 'Pair') {
      outcome = highestSetCard(handQuality1.comp, handQuality2.comp, 'pair')
      if (!outcome) {
        return highestCard(handQuality1.highCards, handQuality2.highCards)
      }
    } else if (hands[handQuality1.handType] === 'High card') {
      return highestCard(handQuality1.highCards, handQuality2.highCards)
    }
    return outcome
  }

  for (let i = 0; i < hands.length; i++) {
    if (handQuality1.handType === i) {
      return results.win
    }
    if (handQuality2.handType === i) {
      return results.lose
    }
  }

  return results.tie
}

function sampleArray(array, n) {
  // Modifies array inplace
  let samples = []
  for (let i = 0; i < n; i++) {
    let index = Math.floor(Math.random() * array.length)
    samples.push(array[index])
    array.splice(index, 1)
  }
  return samples
}

function generateTwoPlayerAllIn(button) {
  let deck = []
  ranks.forEach((rank) => {
    suits.forEach((suit) => {
      deck.push({
        rank,
        suit,
      })
    })
  })
  button = cardStringToArray(button)

  function customIncludes(sourceCards, targetCard) {
    for (let card of sourceCards) {
      if ((card.suit === targetCard.suit) & (card.rank === targetCard.rank)) {
        return true
      }
    }
    return false
  }

  deck = deck.filter((card) => {
    return !customIncludes(button, card)
  })

  let opponentButton = sampleArray(deck, 2)
  let tableCards = sampleArray(deck, 5)

  let hand = button.concat(tableCards)
  let opponentHand = opponentButton.concat(tableCards)
  return [hand, opponentHand]
}
