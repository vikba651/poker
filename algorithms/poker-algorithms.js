const handOne = 'AC 4S 5S 8C AH'
const handTwo = '4S 5S 8C AS AD'

export function PokerHand(hand) {
  //get ranks of hands
  console.log(hand)
  let rankArray = []
  let suitArray = []

  // let rankArrayTwo = [];
  // let suitArrayTwo = [];

  let handArray = hand.split(' ')
  let cardArray = handArray.map((card) => {
    return {
      rank: card.charAt(0),
      suit: card.charAt(1),
    }
  })
  cardArray = cardArray.sort(function (a, b) {
    return ranks.indexOf(a.rank) - ranks.indexOf(b.rank)
  })
  cardArray.forEach((card) => {
    console.log(`rank ${card.rank}, suit:${card.suit}`)
  })

  flush(cardArray)
  // let sortedHand = sorted(arrayHand)

  // for (i = 0; i < sortedHand.length; i++) {
  //   rankArray.push(sortedHand[i].charAt(0))
  //   suitArray.push(sortedHand[i].charAt(1))
  // }
  console.log(rankArray)
  // whichHand(rankArray, suitArray)
}

const suits = ['C', 'D', 'H', 'S']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const hands = [
  'Royal flush',
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

function sorted(arrayHand) {
  let sortedHand = []
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < arrayHand.length; j++) {
      if (ranks[i] === arrayHand[j].charAt(0)) {
        sortedHand.push(arrayHand[j])
      }
    }
  }
  return sortedHand
}

// function countSuites(suitArray) {
//   let suitCount = {}
//   suitArray.forEach(function (x) {
//     suitCount[x] = (suitCount[x] || 0) + 1
//   })
//   return suitCount
// }

// function countRanks(rankArray) {
//   let rankCount = {}
//   rankArray.forEach(function (x) {
//     rankCount[x] = (rankCount[x] || 0) + 1
//   })
//   return rankCount
// }

function countSuites(cardArray) {
  let suitCount = {}
  cardArray.forEach(function (x) {
    suitCount[x.suit] = (suitCount[x.suit] || 0) + 1
  })
  return suitCount
}

function countRanks(cardArray) {
  let rankCount = {}
  cardArray.forEach(function (x) {
    rankCount[x.rank] = (rankCount[x.rank] || 0) + 1
  })
  return rankCount
}

function isFlush(suitArray) {
  let cS = countSuites(suitArray)
  if (Object.keys(cS).find((key) => cS[key] <= 5)) {
    return
  }
}

function flush(cardArray) {
  console.log(`cardarray: ${cardArray}`)
  const suitGroups = cardArray.groupBy((suitGroup) => {
    return suitGroup.suit
  })
  let suitedHand = Object.keys(suitGroups).find(
    (suit) => suitGroups[suit].length >= 5
  )
  if (suitedHand === undefined) {
    return false
  } else {
    suitedHand = suitedHand.sort(function (a, b) {
      return ranks.indexOf(a.rank) - ranks.indexOf(b.rank)
    })
    return suitedHand.slice(-5)
  }
}

function isStraight(rankArray) {
  let index = ranks.indexOf(rankArray[0])
  let ref = ranks.slice(index, index + 5).join('')
  let section = rankArray.slice(0).join('')
  if (section === '10JQKA' && section === ref) {
    return 'ROYALSTRAIGHT'
  } else if (section === 'A2345' || section === ref) {
    return 'STRAIGHT'
  } else {
    return 'FALSE'
  }
}

function pairs(rankArray) {
  let rS = countRanks(rankArray)
  return Object.keys(rS).filter((key) => rS[key] === 2).length
}

function whichHand(rankArray, suitArray) {
  console.log(rankArray, suitArray)
  let rS = countRanks(rankArray)
  if (
    isFlush(suitArray) === true &&
    isStraight(suitArray) === 'ROYALSTRAIGHT'
  ) {
    console.log('Royal Flush')
  } else if (
    isFlush(suitArray) === true &&
    isStraight(rankArray) === 'STRAIGHT'
  ) {
    console.log('Straight Flush')
  } else if (Object.keys(rS).find((key) => rS[key] === 4)) {
    console.log('Four of a Kind')
  } else if (Object.keys(rS).find((key) => rS[key] === 3) && pairs() === 2) {
    console.log('Full House')
  } else if (isFlush(suitArray) === true) {
    console.log('Flush')
  } else if (isStraight(rankArray) === 'STRAIGHT') {
    console.log('Straight')
  } else if (Object.keys(rS).find((key) => rS[key] === 3)) {
    console.log('Three of a Kind')
  } else if (pairs(rankArray) === 2) {
    console.log('Two Pair')
  } else if (pairs(rankArray) === 1) {
    console.log('Pair')
  } else {
    console.log('High Card', rankArray[rankArray.length - 1])
  }
}
