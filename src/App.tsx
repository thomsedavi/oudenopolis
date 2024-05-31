import { useState } from 'react';
import { CitizenId, Citizens, startingCitizens } from './citizens';
import { AttributeCode, Attributes } from './attributes';
import { Amenity, District } from './districts';
import { AmenityCode } from './amenities';
import { Actions } from './actions';

// Volume calculated by multiplying size by density and then looking up value in this dictionary
// eg house with size of 2 and density of 4 has volume of 15
const Volume: {[key: number]: number} = {1: 1, 2: 3, 4: 7, 8: 15, 16: 31};

export default function Game(): JSX.Element {
  const [availableCards, setAvailableCards] = useState<CitizenId[]>([]);
  const [cardsInHand, setCardsInHand] = useState<CitizenId[]>([]);
  const [discardedCards, setDiscardedCards] = useState<CitizenId[]>([]);
  const [selectedCards, setSelectedCards] = useState<CitizenId[]>([]);
  const [grid, setGrid] = useState<{[coords: string]: District}>({});
  const [selectedCellId, setSelectedCellId] = useState<string | undefined>(undefined);
  const [selectedAction, setSelectedAction] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);

  const cardsInDeck = (): CitizenId[] => {
    return availableCards.filter(c => !cardsInHand.includes(c) && !discardedCards.includes(c));
  }

  const toggleCard = (citizenId: CitizenId): void => {
    let cards = [...selectedCards];

    if (cards.includes(citizenId)) {
      cards = cards.filter(thisCard => thisCard !== citizenId);
    } else {
      cards.push(citizenId);
    }

    setSelectedCards(cards);
  }

  const startGame = (): void => {
    const CitizenIds = startingCitizens.sort(() => Math.random() - 0.5);

    setAvailableCards(startingCitizens);
    setDiscardedCards([]);    
    setCardsInHand([CitizenIds[0], CitizenIds[1], CitizenIds[2], CitizenIds[3]]);
    setSelectedCards([]);
    setSelectedCellId(undefined);

    const grid: {[coords: string]: District} = {};

    grid['(-1,-1)'] = new District([]);
    grid['(1,-1)'] = new District([]);
    grid['(-2,0)'] = new District([]);
    grid['(0,0)'] = new District([{amenityCode: AmenityCode.Water, size: 1, density: 4}]);
    grid['(2,0)'] = new District([{amenityCode: AmenityCode.Water, size: 2, density: 2}]);
    grid['(-1,1)'] = new District([]);
    grid['(1,1)'] = new District([{amenityCode: AmenityCode.Water, size: 4, density: 1}]);

    setGrid(grid);
  }

  const validateCards = (): void => {
    let newErrors: string[] = [];

    Object.values(CitizenId).forEach((i: CitizenId) => {
      Object.values(CitizenId).forEach((j: CitizenId) => {
        if (i !== j) {
          const iAttributes = Citizens[i]?.attributes ?? [];
          const jAttributes = Citizens[j]?.attributes ?? [];
          const sharedAttributes = iAttributes.filter(iAttribute => jAttributes.includes(iAttribute));

          if (sharedAttributes.length > 1) {
            newErrors.push(`WHOOPS ${Citizens[i].name} and ${Citizens[j].name} share attributes ${sharedAttributes.map((k: AttributeCode) => Attributes[k].name)}. `);
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

    Object.values(CitizenId).forEach((i: CitizenId) => {
      const citizen = Citizens[i];

      if (citizen.attributes.length !== 4) {
        newErrors.push(`${citizen.name} has ${citizen.attributes.length} elements`);
      }
    });

    Object.values(AttributeCode).forEach((id: AttributeCode) => {
      const startingCount = startingCitizens.filter(c => Citizens[c].attributes.includes(id)).length;

      startingCount !== 0 && (newErrors.push(`${Attributes[id].name} starting count ${startingCount}`));

    });

    setErrors(newErrors);
  }

  const getAttributeFill = (attributeId: AttributeCode): string => {
    let count = 0;

    cardsInHand.forEach(cardId => {
      const attributes = Citizens[cardId].attributes;

      attributes.includes(attributeId) && count++;
    });

    return count > 1 ? 'black' : 'none';
  }

  const getAttributeStroke = (attributeId: AttributeCode): string => {
    let count = 0;

    cardsInHand.forEach(cardId => {
      const attributes = Citizens[cardId].attributes;

      attributes.includes(attributeId) && count++;
    });

    return count > 1 ? 'black' : 'darkgray';
  }

  const discardCards = (cardCode: CitizenId): void => {
    let newCards = cardsInHand.map(cardId => cardCode === cardId ? null : cardId);

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

    const newCardsInHand: CitizenId[] = [];

    newCards.forEach(cardId => {
      cardId !== null && (newCardsInHand.push(cardId));
    });

    setCardsInHand(newCardsInHand);
    setDiscardedCards(prev => [...prev, cardCode]);
    setSelectedCards(prev => prev.filter(cardId => cardId !== cardCode));
  }

  const actionElements: JSX.Element[] = [];
  let actionIndex = 0;

  Object.keys(Actions).forEach(actionId => {
    const action = Actions[actionId];
    let included = true;

    action.cardRequirements.forEach(cardRequirement => {
      if (selectedCards.filter(cardId => Citizens[cardId].attributes.includes(cardRequirement.attributeId)).length < cardRequirement.count) {
        included = false;
      }
    });

    if (selectedCellId === undefined) {
      included = false;
    } else {
      const selectedCell = grid[selectedCellId];

      let availableSpace = 7;

      selectedCell.amenities.forEach(amenity => {
        availableSpace -= amenity.size;
      });

      if (availableSpace < action.spaceRequired) {
        included = false;
      }
    }
    
    if (included) {
      actionElements.push(<g key={`action${actionId}`} transform={`translate(50 ${(selectedAction === actionId ? 95 : 100) + (actionIndex * 120)})`}>
        {selectedAction === actionId && <rect width='800' height='105' stroke='none' fill='darkgray' />}
        <rect width='800' height='100' stroke='none' fill='black' />
        <rect x={5} y={5} width={790} height={90} stroke='none' fill='white' />
        <text x={25} y={70} fontSize='5em' fontFamily='monospace' fill='black'>{Actions[actionId].name}</text>
        <rect width='800' height='100' stroke='none' fill='transparent' cursor='pointer' onClick={() => setSelectedAction(actionId)} />
      </g>);

      actionIndex++;
    }
  });

  const getVolume = (amenities: Amenity[], amenityCodes: AmenityCode[]): number => {
    let volume: number = 0;

    const matchingAmenities = amenities.filter(amenity => amenityCodes.includes(amenity.amenityCode));

    matchingAmenities.forEach(amenity => {
      volume += Volume[amenity.density * amenity.size];
    });

    return volume;
  }

  const employmentRate = (): {housingVolume: number, employmentVolume: number} => {
    if (selectedCellId === undefined)
      return {housingVolume: 0, employmentVolume: 0};

    const cell = grid[selectedCellId];

    if (cell === undefined)
      return {housingVolume: 0, employmentVolume: 0};

    const housingVolume = getVolume(cell.amenities, [AmenityCode.Housing]);
    const employmentVolume = getVolume(cell.amenities, [AmenityCode.Commerce]);

    return {housingVolume: housingVolume, employmentVolume: employmentVolume};
  }

  const cardElements: JSX.Element[] = cardsInHand.map((cardId: CitizenId, index: number) => {
    const card = Citizens[cardId];
    const nameBits = card.name.split(' ');
    const selected = selectedCards.includes(cardId);

    let attribute0: JSX.Element[] = [];
    let attribute1: JSX.Element[] = [];
    let attribute2: JSX.Element[] = [];
    let attribute3: JSX.Element[] = [];

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[0])).length > 1) {
      attribute0 = Attributes[card.attributes[0]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[0])} fill={getAttributeFill(card.attributes[0])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute0 = Attributes[card.attributes[0]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeFill(card.attributes[0])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[1])).length > 1) {
      attribute1 = Attributes[card.attributes[1]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[1])} fill={getAttributeFill(card.attributes[1])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute1 = Attributes[card.attributes[1]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeFill(card.attributes[1])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[2])).length > 1) {
      attribute2 = Attributes[card.attributes[2]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[2])} fill={getAttributeFill(card.attributes[2])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute2 = Attributes[card.attributes[2]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeFill(card.attributes[2])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[3])).length > 1) {
      attribute3 = Attributes[card.attributes[3]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[3])} fill={getAttributeFill(card.attributes[3])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute3 = Attributes[card.attributes[3]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke='lightgray' fill={getAttributeFill(card.attributes[3])} key={`card${index}path${pathIndex}`} d={path} />);
    }

    return <g key={`card${index}`} transform={`translate(${120 + (index * 220)} ${selected ? 1395 : 1400}) scale(2.3)`}>
      {selected && <rect x='-42' width='90' y='-77' height='160' fill='darkgray'/>}
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
      <rect x='-45' width='90' y='-80' height='160' fill='transparent' cursor='pointer' onClick={() => toggleCard(cardId)} />
      {selected && <g transform={`translate(5 -100)`}>
        <rect width={40} height={40} stroke='none' fill='black' />
        <rect x={3} y={3} width={34} height={34} stroke='none' fill='white' />
        <text x={12} y={30} fontSize='2em' fontFamily='monospace' fill='black'>X</text>
        <rect width={40} height={40} stroke='none' fill='transparent' cursor='pointer' onClick={() => discardCards(cardId)} />
      </g>}
    </g>;
  });

  const mapElements: JSX.Element[] = Object.keys(grid).map(cellId => {
    const coords = cellId.substring(1, cellId.length - 1).split(',');

    const amenityElements: JSX.Element[] = [];
    const amenities: Amenity[] = grid[cellId].amenities;

    const water = amenities.filter(amenity => amenity.amenityCode === AmenityCode.Water)[0];

    if (water !== undefined) {
      if (water.size === 1) {
        amenityElements.push(<path key={`district${cellId}water`} d='M 90,70 L 110,80 L 130,70 L 150,80' stroke='black' fill='none' />);
      } else if (water.size === 2) {
        amenityElements.push(<path key={`district${cellId}water`} d='M 90,70 L 110,80 L 130,70 L 150,80 L 170,70 L 190,80' stroke='black' fill='none' />);
      } else if (water.size === 4) {
        amenityElements.push(<path key={`district${cellId}water`} d='M 50,70 L 70,80 L 90,70 L 110,80 L 130,70 L 150,80 L 170,70 L 190,80' stroke='black' fill='none' />);
      }
    }

    return <g key={`district${cellId}`} transform={`translate(${350 + (Number(coords[0]) * 100)} ${675 + (Number(coords[1]) * 100)})`}>
      <rect width='200' height='100' stroke={selectedCellId === cellId ? 'black' : 'darkgray'} fill='none' />
      {amenityElements}
      <rect width='200' height='100' stroke='none' fill='transparent' cursor='pointer' onClick={() => setSelectedCellId(prevCellId => prevCellId === cellId ? undefined : cellId)} />
    </g>;
  })

  return (
    <>
      <div>
        <svg viewBox='0 0 900 1600' xmlns='http://www.w3.org/2000/svg' width='18em'>
          <rect width='900' height='1600' fill='black' stroke='none' />
          <rect x='5' y='5' width='890' height='1590' fill='white' stroke='none' />
          {cardsInDeck().length > 0 && <g transform='translate(15 1020)'>
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
          {discardedCards.length > 0 && <g transform='translate(135 1020)'>
            {discardedCards.length > 4  && <>
              <rect x='20' y='20' width='90' height='160' fill='darkgray' stroke='none' />
              <rect x='25' y='25' width='80' height='150' fill='white' stroke='none' />
            </>}
            {discardedCards.length > 1  && <>
              <rect x='10' y='10' width='90' height='160' fill='darkgray' stroke='none' />
              <rect x='15' y='15' width='80' height='150' fill='white' stroke='none' />
            </>}
            <rect width='90' height='160' fill='darkgray' stroke='none' />
            <rect x='5' y='5' width='80' height='150' fill='white' stroke='none' />
            <text x={45 - 35} y={discardedCards.length > 9 ? '105' : '125'} fontSize={discardedCards.length > 9 ? '5em' : '10em'} fontFamily='monospace' fill='darkgray'>{discardedCards.length}</text>
          </g>}
          {actionElements}
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
