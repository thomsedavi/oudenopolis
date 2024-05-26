import { useState } from 'react';
import { CitizenCode, Citizens, startingCitizens } from './citizens';
import { AttributeCode, Attributes } from './attributes';
import { District } from './districts';

export default function Game(): JSX.Element {
  const [availableCards, setAvailableCards] = useState<CitizenCode[]>([]);
  const [cardsInHand, setCardsInHand] = useState<CitizenCode[]>([]);
  const [discardedCards, setDiscardedCards] = useState<CitizenCode[]>([]);
  const [selectedCards, setSelectedCards] = useState<CitizenCode[]>([]);
  const [grid, setGrid] = useState<{[coords: string]: District}>({});
  const [errors, setErrors] = useState<string[]>([]);

  const getId = (ids: string[]): string => {
    let id = `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

    while (ids.includes(id)) {
      id = `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    }

    return id;
  }

  const cardsInDeck = (): CitizenCode[] => {
    return availableCards.filter(c => !cardsInHand.includes(c) && !discardedCards.includes(c));
  }

  const toggleCard = (cardId: CitizenCode): void => {
    let cards = [...selectedCards];

    if (cards.includes(cardId)) {
      cards = cards.filter(thisCard => thisCard != cardId);
    } else {
      cards.push(cardId);
    }

    setSelectedCards(cards);
  }

  const startGame = (): void => {
    const citizenCodes = startingCitizens.sort(() => Math.random() - 0.5);

    setAvailableCards(startingCitizens);
    setDiscardedCards([]);    
    setCardsInHand([citizenCodes[0], citizenCodes[1], citizenCodes[2], citizenCodes[3]]);
    setSelectedCards([]);

    const grid: {[coords: string]: District} = {};

    grid['(-1,-1)'] = new District();
    grid['(1,-1)'] = new District();
    grid['(-2,0)'] = new District();
    grid['(0,0)'] = new District();
    grid['(2,0)'] = new District();
    grid['(-1,1)'] = new District();
    grid['(1,1)'] = new District();

    setGrid(grid);
  }

  const validateCards = (): void => {
    let newErrors: string[] = [];

    Object.values(CitizenCode).forEach((i: CitizenCode) => {
      Object.values(CitizenCode).forEach((j: CitizenCode) => {
        if (i !== j) {
          const iAttributes = Citizens[i]?.attributes ?? [];
          const jAttributes = Citizens[j]?.attributes ?? [];
          const sharedAttributes = iAttributes.filter(iAttribute => jAttributes.includes(iAttribute));

          if (sharedAttributes.length > 1) {
            newErrors.push(`${Citizens[i].name} and ${Citizens[i].name} share attributes ${sharedAttributes.map((k: AttributeCode) => Attributes[k].name)}. `);
          }
        }
      });  
    });
    
    Object.values(AttributeCode).forEach((i: AttributeCode) => {
      const usedCitizens = Object.keys(Citizens).filter(c => Citizens[c].attributes.includes(i));

      let availableCitizens = Object.keys(Citizens).filter(citizen => !usedCitizens.includes(citizen));

      availableCitizens = availableCitizens.filter(citizen => {
        const citizenAttributes = Citizens[citizen];

        let result: boolean = true;

        if (citizenAttributes.attributes.length > 3 || usedCitizens.length > 3) {
          result = false;
        }

        usedCitizens.forEach(usedCitizen => {
          const usedCitizenAttributes = Citizens[usedCitizen].attributes;

          const crossover = citizenAttributes.attributes.filter(att => usedCitizenAttributes.includes(att));

          if (crossover.length > 0) {
            result = false;
          }
        });

        return result;
      });

      newErrors.push(`${Attributes[i].name} (${usedCitizens.length}) (has: ${usedCitizens.map(citizen => Citizens[citizen].name)}) (available: ${availableCitizens.map(citizen => Citizens[citizen].name)})`);
    });

    setErrors(newErrors);
  }

  const getAttributeColor = (attributeId: AttributeCode): string => {
    let count = 0;

    cardsInHand.forEach(cardId => {
      const attributes = Citizens[cardId].attributes;

      attributes.includes(attributeId) && count++;
    });

    return count > 1 ? 'black' : 'none';
  }

  const discardCards = (): void => {
    let newCards = cardsInHand.map(cardId => selectedCards.includes(cardId) ? null : cardId);

    const myCardsInDeck = cardsInDeck();
    let index = 0;

    newCards = newCards.map(cardId => {
      if (cardId === null) {
        if (myCardsInDeck.length <= index) {
          return null;
        } else {
          return myCardsInDeck[index++];
        }
      } else {
        return cardId;
      }
    });

    const newCardsInHand: CitizenCode[] = [];

    newCards.forEach(cardId => {
      cardId != null && (newCardsInHand.push(cardId));
    });

    setCardsInHand(newCardsInHand);
    setDiscardedCards(prev => [...prev, ...selectedCards]);
    setSelectedCards([]);
  }

  const cardElements: JSX.Element[] = cardsInHand.map((cardId: CitizenCode, index: number) => {
    const card = Citizens[cardId];
    const nameBits = card.name.split(' ');

    let attribute0: JSX.Element[] = [];
    let attribute1: JSX.Element[] = [];
    let attribute2: JSX.Element[] = [];
    let attribute3: JSX.Element[] = [];

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[0])).length > 1) {
      attribute0 = Attributes[card.attributes[0]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='black' fill={getAttributeColor(card.attributes[0])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute0 = Attributes[card.attributes[0]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeColor(card.attributes[0])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[1])).length > 1) {
      attribute1 = Attributes[card.attributes[1]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='black' fill={getAttributeColor(card.attributes[1])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute1 = Attributes[card.attributes[1]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeColor(card.attributes[1])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[2])).length > 1) {
      attribute2 = Attributes[card.attributes[2]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='black' fill={getAttributeColor(card.attributes[2])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute2 = Attributes[card.attributes[2]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeColor(card.attributes[2])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[3])).length > 1) {
      attribute3 = Attributes[card.attributes[3]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='black' fill={getAttributeColor(card.attributes[3])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute3 = Attributes[card.attributes[3]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeColor(card.attributes[3])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    return <g key={`card${index}`} transform={`translate(${120 + (index * 220)} ${selectedCards.includes(cardId) ? 1395 : 1400}) scale(2.3)`}>
      {selectedCards.includes(cardId) && <rect x='-42' width='90' y='-77' height='160' fill='black'/>}
      <rect x='-45' width='90' y='-80' height='160' fill='black'/>
      <rect x='-42' width='84' y='-77' height='154' fill='white'/>
      <text x={0 - (nameBits[0].length * 3.6)} y='-60' fontSize='1em' fontFamily='monospace' fill='black'>{nameBits[0]}</text>
      {nameBits[1] && <text x={0 - (nameBits[1].length * 3.6)} y='-40' fontSize='1em' fontFamily='monospace' fill='black'>{nameBits[1]}</text>}
      <g transform='translate(-40 -20) scale(35)'>
        {attribute0}
      </g>
      <g transform='translate(0 -20) scale(35)'>
        {attribute1}
      </g>
      <g transform='translate(-40 20) scale(35)'>
        {attribute2}
      </g>
      <g transform='translate(0 20) scale(35)'>
        {attribute3}
      </g>
      <rect x='-45' width='90' y='-80' height='160' fill='transparent' cursor='pointer' onClick={() => toggleCard(cardId)}></rect>
    </g>;
  });

  const mapElements: JSX.Element[] = Object.keys(grid).map(coordsString => {
    const coords = coordsString.substring(1, coordsString.length - 1).split(',');

    return <rect key={`district${coordsString}`} x={350 + (Number(coords[0]) * 100)} y={675 + (Number(coords[1]) * 100)} width='200' height='100' stroke='black' fill='none' />;
  })

  return (
    <>
      <div>
        <svg viewBox='0 0 900 1600' xmlns='http://www.w3.org/2000/svg' width='18em'>
          <rect width='900' height='1600' fill='black' stroke='none' />
          <rect x='5' y='5' width='890' height='1590' fill='white' stroke='none' />
          {cardsInDeck().length > 0 && <g transform='translate(15 15)'>
            {cardsInDeck().length > 4  && <>
              <rect x='20' y='20' width='90' height='160' fill='black' stroke='none' />
              <rect x='25' y='25' width='80' height='150' fill='white' stroke='none' />
            </>}
            {cardsInDeck().length > 1  && <>
              <rect x='10' y='10' width='90' height='160' fill='black' stroke='none' />
              <rect x='15' y='15' width='80' height='150' fill='white' stroke='none' />
            </>}
            <rect width='90' height='160' fill='black' stroke='none' />
            <rect x='5' y='5' width='80' height='150' fill='white' stroke='none' />
            <text x={45 - 35} y='125' fontSize='10em' fontFamily='monospace' fill='black'>{cardsInDeck().length}</text>
          </g>}
          {discardedCards.length > 0 && <g transform='translate(775 15)'>
            {discardedCards.length > 4  && <>
              <rect x='20' y='20' width='90' height='160' fill='black' stroke='none' />
              <rect x='25' y='25' width='80' height='150' fill='white' stroke='none' />
            </>}
            {discardedCards.length > 1  && <>
              <rect x='10' y='10' width='90' height='160' fill='black' stroke='none' />
              <rect x='15' y='15' width='80' height='150' fill='white' stroke='none' />
            </>}
            <rect width='90' height='160' fill='black' stroke='none' />
            <rect x='5' y='5' width='80' height='150' fill='white' stroke='none' />
            <text x={45 - 35} y={discardedCards.length > 9 ? '105' : '125'} fontSize={discardedCards.length > 9 ? '5em' : '10em'} fontFamily='monospace' fill='black'>{discardedCards.length}</text>
          </g>}
          {selectedCards.length > 0 && <g transform='translate(20 1115)'>
            <rect x='5' y='5' width='280' height='80' fill='black' stroke='none' />
            <rect width='280' height='80' fill='black' stroke='none' />
            <rect x='5' y='5' width='270' height='70' fill='white' stroke='none' />
            <text x='15' y='65' fontSize='5em' fontFamily='monospace' fill='black'>DISCARD</text>
            <rect width='280' height='80' fill='transparent' stroke='none' cursor='pointer' onClick={() => discardCards()} />
          </g>}
          {mapElements}
          {cardElements}
        </svg>
      </div>
      <button onClick={() => startGame()}>Start Game</button>
      {false && <button onClick={() => validateCards()}>Validate Cards</button>}
      {errors.map((error: string, i: number) => <div key={`error${i}`}>{error}</div>)}
    </>
  )
}
