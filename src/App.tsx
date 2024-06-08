import { useState } from 'react';
import { CitizenId, Citizens, startingCitizens } from './citizens';
import { AttributeCode, Attributes } from './attributes';
import { Amenity, District, getDistrict } from './districts';
import { AmenityCode } from './amenities';
import { Action, DistrictState, Result } from './actions';
import { EmploymentRate } from './enums';
import { getCreateResidencySmall } from './actions/residency';
import { getCreateHealthSmall } from './actions/health';

// Volume calculated by multiplying size by density and then looking up value in this dictionary
// eg house with size of 2 and density of 4 has volume of 15
const Volume: {[key: number]: number} = {1: 1, 2: 3, 4: 7, 8: 15, 16: 31};
const MaxLineLength: number = 42;
const FontSize: number = 30;
const LineSpacing: number = 38;
const ParagraphSpacing: number = 52;

export default function Game(): JSX.Element {
  const [availableCards, setAvailableCards] = useState<CitizenId[]>([]);
  const [cardsInHand, setCardsInHand] = useState<CitizenId[]>([]);
  const [discardedCards, setDiscardedCards] = useState<CitizenId[]>([]);
  const [selectedCards, setSelectedCards] = useState<CitizenId[]>([]);
  const [grid, setGrid] = useState<{[coords: string]: District}>({});
  const [selectedCellId, setSelectedCellId] = useState<string | undefined>(undefined);
  const [availableActions, setAvailableActions] = useState<Action[]>([]);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | undefined>(undefined);
  const [rollResults, setRollResults] = useState<{description: string, dice: number, rotation: number} | undefined>(undefined);
  const [inspectDistrict, setInspectDistrict] = useState<boolean>(false);
  const [offset, setOffset] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [errors, setErrors] = useState<string[]>([]);

  const cardsInDeck = (): CitizenId[] => {
    return availableCards.filter(c => !cardsInHand.includes(c) && !discardedCards.includes(c));
  }

  const getVolume = (amenities: Amenity[], amenityCodes: AmenityCode[]): number => {
    let volume: number = 0;

    const matchingAmenities = amenities.filter(amenity => amenityCodes.includes(amenity.code));

    matchingAmenities.forEach(amenity => {
      volume += Volume[(amenity.density ?? 0) * (amenity.size ?? 0)];
    });

    return volume;
  }

  // TODO this should also depend on nearby districts, also have a better balance like one home to every two employers
  const getEmploymentRate = (cellId: string): EmploymentRate => {
    const cell = grid[cellId];

    if (cell === undefined)
      return EmploymentRate.Medium;
    
    const housingVolume = getVolume(cell.amenities, [AmenityCode.Housing]);
    const employmentVolume = getVolume(cell.amenities, [AmenityCode.Commerce, AmenityCode.Medical]);
    
    if (housingVolume === 0 && employmentVolume === 0)
      return EmploymentRate.Medium;

    const ratio = employmentVolume / (housingVolume * 2);

    if (ratio >= 19 / 20)
      return EmploymentRate.High;
    else if (ratio >= 9 / 10)
      return EmploymentRate.Medium;
    else
      return EmploymentRate.Low;
  }

  const reloadAvailableActions = (cellId: string, cards: CitizenId[]): void => {
    let availableSpace = 7;

    const selectedCell = grid[cellId];

    selectedCell.amenities.forEach(amenity => {
      availableSpace -= amenity.size ?? 0;
    });

    const residencyCount = cards.filter(cardId => Citizens[cardId].attributes.includes(AttributeCode.Residency)).length;
    const healthCount = cards.filter(cardId => Citizens[cardId].attributes.includes(AttributeCode.Health)).length;

    const newAvailableActions: Action[] = [];

    const districtState: DistrictState = {
      employmentRate: getEmploymentRate(cellId)
    }

    if (residencyCount >= 2 && availableSpace >= 1) {
      newAvailableActions.push(getCreateResidencySmall(districtState));
    }

    if (healthCount >= 2 && availableSpace >= 1) {
      newAvailableActions.push(getCreateHealthSmall(districtState));
    }

    setAvailableActions(newAvailableActions);
  }

  const toggleCard = (citizenId: CitizenId): void => {
    let cards = [...selectedCards];

    if (cards.includes(citizenId)) {
      cards = cards.filter(thisCard => thisCard !== citizenId);
    } else {
      cards.push(citizenId);
    }

    setSelectedCards(cards);
    setSelectedActionIndex(undefined);
    selectedCellId !== undefined && reloadAvailableActions(selectedCellId, cards);
  }

  const updateSelectedCell = (cellId: string): void => {
    if (selectedCellId === cellId) {
      setSelectedCellId(undefined);
      setAvailableActions([]);
    } else {
      setSelectedCellId(cellId);
      reloadAvailableActions(cellId, selectedCards);
    }
  }

  const startGame = (): void => {
    const CitizenIds = startingCitizens.sort(() => Math.random() - 0.5);

    setAvailableCards(startingCitizens);
    setDiscardedCards([]);    
    setCardsInHand([CitizenIds[0], CitizenIds[1], CitizenIds[2], CitizenIds[3]]);
    setSelectedCards([]);
    setSelectedCellId(undefined);
    setRollResults(undefined);
    setSelectedActionIndex(undefined);

    const grid: {[coords: string]: District} = {};

    grid['(0,0)'] = getDistrict(0, 0);

    setGrid(grid);
  }

  const startNewDay = (): void => {
    const CitizenIds = availableCards.sort(() => Math.random() - 0.5);

    setDiscardedCards([]);    
    setCardsInHand([CitizenIds[0], CitizenIds[1], CitizenIds[2], CitizenIds[3]]);
    setSelectedCards([]);
    setRollResults(undefined);
    setSelectedActionIndex(undefined);
    setSelectedCellId(undefined);
    setAvailableActions([]);

    const newgrid = {...grid};

    Object.keys(newgrid).forEach(key => {
      newgrid[key].amenities.forEach(amenity => {
        if ([AmenityCode.Housing].includes(amenity.code)) {
          amenity.age = amenity.age !== undefined ? amenity.age + 1 : 1;
        }
      });
    });

    setGrid(newgrid);
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

  const discardCards = (cardCodes: CitizenId[]): void => {
    let newCards = cardsInHand.map(cardId => cardCodes.includes(cardId) ? null : cardId);

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
    setDiscardedCards(prev => [...prev, ...cardCodes]);
    setSelectedCards(prev => prev.filter(cardId => !cardCodes.includes(cardId)));
  }

  const actionElements: JSX.Element[] = [];

  let actionElement: JSX.Element | undefined = undefined;

  if (selectedActionIndex !== undefined) {
    let lineBreaks = 0;
    let paragraphBreaks = 0;

    const action = availableActions[selectedActionIndex];

    const descriptionElements: JSX.Element[] = [];

    const description: string[] = action.description.split('\n');

    description.forEach(paragraph => {
      const words: string[] = paragraph.split(' ');
      let line = '';

      words.forEach(word => {
        if (line === '') {
          line = word;
        } else if ((`${line} ${word}`).length > MaxLineLength) {
          descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fill='black'>{line}</text>)
          line = word;
          lineBreaks++
        } else {
          line = `${line} ${word}`;
        }
      });

      descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fill='black'>{line}</text>)
      paragraphBreaks++;
    });

    lineBreaks++;

    action.results.forEach((result: Result) => {
      const resultDescription: string[] = result.description.split('\n');

      let roll: string = `ROLL ${result.roll}:`;

      resultDescription.forEach((paragraph, index) => {
        const words: string[] = paragraph.split(' ');
        let line = index === 0 ? roll : '';
  
        words.forEach(word => {
          if (line === '') {
            line = word;
          } else if ((`${line} ${word}`).length > MaxLineLength) {
            descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fontWeight={600} fill='darkgray'>{line}</text>)
            line = word;
            lineBreaks++;
          } else {
            line = `${line} ${word}`;
          }
        });
  
        descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fontWeight={600} fill='darkgray'>{line}</text>) 
        paragraphBreaks++;
      });
    });

    actionElement = <g transform='translate(50 50)'>
      <rect width={800} height={900} stroke='none' fill='black' />
      <rect x={5} y={5} width={790} height={890} stroke='none' fill='white' />
      <rect x={750} y={-30} width={80} height={80} stroke='none' fill='black' />
      <rect x={755} y={-25} width={70} height={70} stroke='none' fill='white' />
      <text x={775} y={26} fontSize='4em' fontFamily='monospace' fill='black'>X</text>
      <rect x={750} y={-30} width={80} height={80} stroke='none' fill='transparent' cursor='pointer' onClick={() => setSelectedActionIndex(undefined)} />
      {descriptionElements}
      <rect x={640} y={820} width={160} height={80} stroke='none' fill='black' />
      <rect x={645} y={825} width={150} height={70} stroke='none' fill='white' />
      <text x={665} y={876} fontSize='4em' fontFamily='monospace' fill='black'>ROLL</text>
      <rect x={640} y={820} width={160} height={80} stroke='none' fill='transparent' cursor='pointer' onClick={() => roll()} />
    </g>;
  }

  if (inspectDistrict && selectedCellId !== undefined) {
    const district = grid[selectedCellId];

    const descriptionElements: JSX.Element[] = [];

    descriptionElements.push(<text key={`districtname`} x={34} y={56} fontSize={FontSize} fontFamily='monospace' fontWeight={600} textDecoration='underline'>{district.name}</text>);

    let lineBreaks = 2;
    let paragraphBreaks = 0;

    const descriptions: string[] = [];

    if (district.amenities.length === 0) {
      descriptions.push('A bunch of unused land');
    } else {
      descriptions.push('Put some generic information here, maybe about land usage nature vs built up or something');

      district.amenities.forEach(amenity => {
        const size = amenity.size === 1 ? 'small' : (amenity.size === 2 ? 'medium' : 'large');

        let amenityName = 'unknown';

        if (amenity.code === AmenityCode.Water) {
          amenityName = 'water';
        } else if (amenity.code === AmenityCode.Housing) {
          amenityName = 'housing';
        } else if (amenity.code === AmenityCode.Road) {
          amenityName = 'road';
        }

        let density = 'averagely';

        if (amenity.density === 1) {
          density = 'lightly';
        } else if (amenity.density === 4) {
          density = 'heavily';
        }

        let usage = 'medium';

        if (amenity.usage === 'LOW') {
          usage = 'low';
        } else if (amenity.usage === 'HIGH') {
          usage = 'high';
        }

        descriptions.push(`A ${size}, ${density} built, ${amenity.age ?? 0} month old ${amenityName} with ${usage} usage`)
      });
    }

    descriptions.forEach((description: string) => {
      const resultDescription: string[] = description.split('\n');

      resultDescription.forEach((paragraph, index) => {
        const words: string[] = paragraph.split(' ');
        let line = '';
  
        words.forEach(word => {
          if (line === '') {
            line = word;
          } else if ((`${line} ${word}`).length > MaxLineLength) {
            descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fill='black'>{line}</text>)
            line = word;
            lineBreaks++;
          } else {
            line = `${line} ${word}`;
          }
        });
  
        descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fill='black'>{line}</text>) 
        paragraphBreaks++;
      });
    });

    actionElement = <g transform='translate(50 50)'>
      <rect width={800} height={900} stroke='none' fill='black' />
      <rect x={5} y={5} width={790} height={890} stroke='none' fill='white' />
      <rect x={750} y={-30} width={80} height={80} stroke='none' fill='black' />
      <rect x={755} y={-25} width={70} height={70} stroke='none' fill='white' />
      <text x={775} y={26} fontSize='4em' fontFamily='monospace' fill='black'>X</text>
      <rect x={750} y={-30} width={80} height={80} stroke='none' fill='transparent' cursor='pointer' onClick={() => setInspectDistrict(value => !value)} />
      {descriptionElements}
    </g>;
  }

  if (rollResults !== undefined) {
    let lineBreaks = 5;
    let paragraphBreaks = 0;

    const descriptionElements: JSX.Element[] = [];

    const description: string[] = rollResults.description.split('\n');

    description.forEach(paragraph => {
      const words: string[] = paragraph.split(' ');
      let line = '';

      words.forEach(word => {
        if (line === '') {
          line = word;
        } else if ((`${line} ${word}`).length > MaxLineLength) {
          descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fill='black'>{line}</text>)
          line = word;
          lineBreaks++
        } else {
          line = `${line} ${word}`;
        }
      });

      descriptionElements.push(<text key={`description${descriptionElements.length}`} x={34} y={56 + (lineBreaks * LineSpacing) + (paragraphBreaks * ParagraphSpacing)} fontSize={FontSize} fontFamily='monospace' fill='black'>{line}</text>)
      paragraphBreaks++;
    });

    const diceElements: JSX.Element[] = [];

    diceElements.push(<rect key='thedice' width={120} height={120} rx={10} strokeWidth={3} stroke='black' fill='none' />);

    if ([1, 3, 5].includes(rollResults.dice)) {
      diceElements.push(<circle key='thedice1' cx={60} cy={60} r={10} strokeWidth={3} stroke='black' fill='black' />);
    }

    if ([2, 3, 4, 5, 6].includes(rollResults.dice)) {
      diceElements.push(<circle key='thedice2' cx={30} cy={30} r={10} strokeWidth={3} stroke='black' fill='black' />);
      diceElements.push(<circle key='thedice3' cx={90} cy={90} r={10} strokeWidth={3} stroke='black' fill='black' />);
    }

    if ([4, 5, 6].includes(rollResults.dice)) {
      diceElements.push(<circle key='thedice4' cx={30} cy={90} r={10} strokeWidth={3} stroke='black' fill='black' />);
      diceElements.push(<circle key='thedice5' cx={90} cy={30} r={10} strokeWidth={3} stroke='black' fill='black' />);
    }

    if (rollResults.dice === 6) {
      diceElements.push(<circle key='thedice6' cx={30} cy={60} r={10} strokeWidth={3} stroke='black' fill='black' />);
      diceElements.push(<circle key='thedice7' cx={90} cy={60} r={10} strokeWidth={3} stroke='black' fill='black' />);
    }

    const diceElement: JSX.Element = <g transform={` translate(340 50) rotate(${rollResults.rotation * 360} 60 60)`}>{diceElements}</g>;

    actionElement = <g transform='translate(50 50)'>
      <rect width={800} height={900} stroke='none' fill='black' />
      <rect x={5} y={5} width={790} height={890} stroke='none' fill='white' />
      {diceElement}
      {descriptionElements}
      <rect x={720} width={80} height={80} stroke='none' fill='black' />
      <rect x={725} y={5} width={70} height={70} stroke='none' fill='white' />
      <text x={745} y={56} fontSize='4em' fontFamily='monospace' fill='black'>X</text>
      <rect x={720} width={80} height={80} stroke='none' fill='transparent' cursor='pointer' onClick={() => setRollResults(undefined)} />
    </g>;
  }

  const roll = (): void => {
    if (selectedActionIndex === undefined) return;

    const action = availableActions[selectedActionIndex];

    const dice: number = Math.floor(Math.random() * 6) + 1;

    let outcome: Result | undefined = action.results.filter(result => result.roll === dice)[0];

    if (outcome !== undefined) {
      if (selectedCellId !== undefined) {
        const newGrid = {...grid};

        const cell = newGrid[selectedCellId];

        cell.amenities.push(outcome.amenity);

        const coords = selectedCellId.substring(1, selectedCellId.length - 1).split(',');

        const surrounds: {x: number, y: number}[] = [
          {x: Number(coords[0]) + 1, y: Number(coords[1]) - 1},
          {x: Number(coords[0]) + 2, y: Number(coords[1])},
          {x: Number(coords[0]) + 1, y: Number(coords[1]) + 1},
          {x: Number(coords[0]) - 1, y: Number(coords[1]) + 1},
          {x: Number(coords[0]) - 2, y: Number(coords[1])},
          {x: Number(coords[0]) - 1, y: Number(coords[1]) - 1},
        ];

        surrounds.forEach(coord => {
          const id = `(${coord.x},${coord.y})`

          if (newGrid[id] === undefined) {
            newGrid[id] = getDistrict(coord.x, coord.y);
          }
        })

        setGrid(newGrid);

        setRollResults({description: outcome.resultDescription, dice: dice, rotation: Math.random()});
        discardCards([...selectedCards]);
      }
    }

    setSelectedActionIndex(undefined);
    setAvailableActions([]);
    setSelectedCellId(undefined);
  }

  availableActions.forEach((action, actionIndex) => {
      actionElements.push(<g key={`action${actionIndex}`} transform={`translate(50 ${910 + (actionIndex * 120)})`}>
        <rect width='800' height='100' stroke='none' fill='black' />
        <rect x={5} y={5} width={790} height={90} stroke='none' fill='white' />
        <text x={25} y={70} fontSize='5em' fontFamily='monospace' fill='black'>{action.name}</text>
        <rect width='800' height='100' stroke='none' fill='transparent' cursor='pointer' onClick={() => setSelectedActionIndex(actionIndex)} />
      </g>);
  });

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
      attribute0 = [<path strokeWidth='0.04' stroke='lightgray' fill='none' key={`card${index}path0`} d='M 0.5 0.25 L 0 0.25 L 0.5 0 L 1 0.25 L 0.25 0.5 L 0.75 0.5' />];
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[1])).length > 1) {
      attribute1 = Attributes[card.attributes[1]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[1])} fill={getAttributeFill(card.attributes[1])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute1 = [<path strokeWidth='0.04' stroke='lightgray' fill='none' key={`card${index}path1`} d='M 0.5 0.25 L 0 0.25 L 0.5 0 L 1 0.25 L 0.25 0.5 L 0.75 0.5' />];
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[2])).length > 1) {
      attribute2 = Attributes[card.attributes[2]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[2])} fill={getAttributeFill(card.attributes[2])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute2 = [<path strokeWidth='0.04' stroke='lightgray' fill='none' key={`card${index}path2`} d='M 0.5 0.25 L 0 0.25 L 0.5 0 L 1 0.25 L 0.25 0.5 L 0.75 0.5' />];
    }

    if (availableCards.filter(cardId => Citizens[cardId].attributes.includes(card.attributes[3])).length > 1) {
      attribute3 = Attributes[card.attributes[3]].paths.map((path: string, pathIndex: number) => <path strokeWidth='0.04' stroke={getAttributeStroke(card.attributes[3])} fill={getAttributeFill(card.attributes[3])} key={`card${index}path${pathIndex}`} d={path} />);
    } else {
      attribute3 = [<path strokeWidth='0.04' stroke='lightgray' fill='none' key={`card${index}path3`} d='M 0.5 0.25 L 0 0.25 L 0.5 0 L 1 0.25 L 0.25 0.5 L 0.75 0.5' />];
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
        <rect width={40} height={40} stroke='none' fill='transparent' cursor='pointer' onClick={() => discardCards([cardId])} />
      </g>}
    </g>;
  });

  const mapElements: JSX.Element[] = Object.keys(grid).sort(cellId => selectedCellId === cellId ? 1 : -1).map(cellId => {
    const coords = cellId.substring(1, cellId.length - 1).split(',');

    const amenityElements: JSX.Element[] = [];
    const amenities: Amenity[] = grid[cellId].amenities;

    const water = amenities.filter(amenity => amenity.code === AmenityCode.Water)[0];
    const road = amenities.filter(amenity => amenity.code === AmenityCode.Road)[0];
    const housing = amenities.filter(amenity => amenity.code === AmenityCode.Housing)[0];
    const medical = amenities.filter(amenity => amenity.code === AmenityCode.Medical)[0];

    if (water !== undefined) {
      if (water.size === 1) {
        amenityElements.push(<path key={`district${cellId}water`} d='M 90,70 L 110,80 L 130,70 L 150,80' stroke='black' fill='none' />);
      } else if (water.size === 2) {
        amenityElements.push(<path key={`district${cellId}water`} d='M 90,70 L 110,80 L 130,70 L 150,80 L 170,70 L 190,80' stroke='black' fill='none' />);
      } else if (water.size === 4) {
        amenityElements.push(<path key={`district${cellId}water`} d='M 50,70 L 70,80 L 90,70 L 110,80 L 130,70 L 150,80 L 170,70 L 190,80' stroke='black' fill='none' />);
      }
    }

    if (road !== undefined) {
      amenityElements.push(<line key={`district${cellId}road`} x1={50} x2={150} y1={50} y2={50} stroke='black' strokeWidth={1} />);
    }

    if (housing !== undefined) {
      if (housing.size === 1) {
        if (housing.usage === 'LOW') {
          amenityElements.push(<rect key={`district${cellId}housing`} x={20} y={20} width={20} height={20} strokeWidth={1} stroke='black' fill='lightgray' />);
        } else if (housing.usage === 'MEDIUM') {
          amenityElements.push(<rect key={`district${cellId}housing`} x={20} y={20} width={20} height={20} strokeWidth={1} stroke='black' fill='darkgray' />);
        } else {
          amenityElements.push(<rect key={`district${cellId}housing`} x={20} y={20} width={20} height={20} strokeWidth={1} stroke='black' fill='black' />);
        }
      }
    }

    if (medical !== undefined) {
      if (medical.size === 1) {
        if (medical.usage === 'LOW') {
          amenityElements.push(<rect key={`district${cellId}medical`} x={120} y={20} width={20} height={20} strokeWidth={1} stroke='black' fill='lightgray' />);
        } else if (medical.usage === 'MEDIUM') {
          amenityElements.push(<rect key={`district${cellId}medical`} x={120} y={20} width={20} height={20} strokeWidth={1} stroke='black' fill='darkgray' />);
        } else {
          amenityElements.push(<rect key={`district${cellId}medical`} x={120} y={20} width={20} height={20} strokeWidth={1} stroke='black' fill='black' />);
        }
      }
    }

    return <g key={`district${cellId}`} mask="url(#mapMask)">
      <g transform={`translate(${150 + (Number(coords[0]) * 300) - (offset.x * 300)} ${290 + (Number(coords[1]) * 300) - (offset.y * 300)}) scale(3)`}>
        <rect width='200' height='100' stroke={selectedCellId === cellId ? 'black' : 'darkgray'} fill='none' />
        {amenityElements}
        <rect width='200' height='100' stroke='none' fill='transparent' cursor='pointer' onClick={() => {updateSelectedCell(cellId); setOffset({x: Number(coords[0]), y: Number(coords[1])})}} />
        {selectedCellId === cellId && <g transform={`translate(120 0) scale(0.4)`}>
          <rect x={160} y={-40} width={80} height={80} stroke='none' fill='black' />
          <rect x={165} y={-35} width={70} height={70} stroke='none' fill='white' />
          <text x={180} y={30} fontFamily='monospace' fontSize={80}>?</text>
          <rect x={160} y={-40} width={80} height={80} stroke='none' fill='transparent' cursor='pointer' onClick={() => setInspectDistrict(prev => !prev)} />
        </g>}
      </g>
    </g>;
  })

  return (
    <>
      <div>
        <svg viewBox='0 0 900 1600' xmlns='http://www.w3.org/2000/svg' width='18em'>
          <rect width='900' height='1600' fill='black' stroke='none' />
          <rect x='5' y='5' width='890' height='880' fill='white' stroke='none' />
          <rect x='5' y='890' width='890' height='260' fill='white' stroke='none' />
          <rect x='5' y='1155' width='890' height='440' fill='white' stroke='none' />
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
          <mask id="mapMask">
            <rect x='5' y='5' width='890' height='880' fill='white' stroke='none' />
          </mask>
          {mapElements}
          {actionElements}
          {actionElement}
          {cardElements}
        </svg>
      </div>
      <button onClick={() => startGame()}>Start Game</button>
      <button onClick={() => startNewDay()}>Start New Day</button>
      {false && <button onClick={() => validateCards()}>Validate Cards</button>}
      {errors.map((error: string, i: number) => <div key={`error${i}`}>{error}</div>)}
    </>
  )
}
