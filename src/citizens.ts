import { AttributeCode } from "./attributes";

interface ICitizens { [id: string]: { name: string, attributes: AttributeCode[] } }

export enum CitizenCode {
  Actor = '7-11',
  Architect = '0-04',
  Artist = '9-28',
  Astronaut = '1-24',
  Athlete = '1-13',
  Captain = '0-86',
  Chef = '2-80',
  Cryptid = '9-71',
  Daredevil = '7-73',
  Doctor = '4-56',
  Driver = '0-13',
  Engineer = '3-16',
  FactoryWorker = '6-80',
  Farmer = '0-36',
  FireFighter = '7-08',
  Guru = '1-98',
  Historian = '0-99',
  HomeOwner = '9-04',
  Inventor = '3-23',
  Mayor = '9-87',
  Miner = '2-41',
  Musician = '1-57',
  Mystic = '6-69',
  OfficeWorker = '2-83',
  Pilot = '9-18',
  PoliceOfficer = '8-19',
  Scientist = '7-56',
  Shopkeeper = '4-28',
  Teacher = '4-76',
  Tourist = '6-63',
  Writer = '1-42',
  ZooKeeper = '5-76',
}

export const Citizens: ICitizens = {
  [CitizenCode.FactoryWorker]: {
    name: 'Factory Worker',
    attributes: [
      AttributeCode.Industry,
      AttributeCode.Residency,
      AttributeCode.Space,
      AttributeCode.History,
    ]
  },
  [CitizenCode.Musician]: {
    name: 'Musician',
    attributes: [
      AttributeCode.Music,
      AttributeCode.Art,
      AttributeCode.Air,
      AttributeCode.Education,
    ]
  },
  [CitizenCode.HomeOwner]: {
    name: 'Home Owner',
    attributes: [
      AttributeCode.Residency,
      AttributeCode.Dining,
      AttributeCode.Road,
      AttributeCode.Law,
    ]
  },
  [CitizenCode.ZooKeeper]: {
    name: 'Zoo Keeper',
    attributes: [
      AttributeCode.Animals,
      AttributeCode.Science,
      AttributeCode.Nature,
      AttributeCode.Office,
    ]
  },
  [CitizenCode.Daredevil]: {
    name: 'Dare Devil',
    attributes: [
      AttributeCode.Thrill,
      AttributeCode.Theatre,
      AttributeCode.Landmark,
      AttributeCode.Sport,
    ]
  },
  [CitizenCode.Inventor]: {
    name: 'Inventor',
    attributes: [
      AttributeCode.Technology,
      AttributeCode.Science,
      AttributeCode.Law,
      AttributeCode.Sea,
    ]
  },
  [CitizenCode.Actor]: {
    name: 'Actor',
    attributes: [
      AttributeCode.Theatre,
      AttributeCode.Sea,
      AttributeCode.Road,
      AttributeCode.Health,
    ]
  },
  [CitizenCode.Mystic]: {
    name: 'Mystic',
    attributes: [
      AttributeCode.Mysticism,
      AttributeCode.Electricity,
      AttributeCode.Fire,
      AttributeCode.Animals,
    ]
  },
  [CitizenCode.Farmer]: {
    name: 'Farmer',
    attributes: [
      AttributeCode.Food,
      AttributeCode.Residency,
      AttributeCode.Animals,
      AttributeCode.Government,
    ]
  },
  [CitizenCode.Mayor]: {
    name: 'Mayor',
    attributes: [
      AttributeCode.Government,
      AttributeCode.Tourism,
      AttributeCode.Law,
      AttributeCode.Train,
    ]
  },
  [CitizenCode.Doctor]: {
    name: 'Doctor',
    attributes: [
      AttributeCode.Health,
      AttributeCode.Residency,
      AttributeCode.Air,
      AttributeCode.Office,
    ]
  },
  [CitizenCode.Tourist]: {
    name: 'Tourist',
    attributes: [
      AttributeCode.Tourism,
      AttributeCode.Air,
      AttributeCode.Landmark,
      AttributeCode.Road,
    ]
  },
  [CitizenCode.Historian]: {
    name: 'Historian',
    attributes: [
      AttributeCode.History,
      AttributeCode.Books,
      AttributeCode.Theatre,
      AttributeCode.Government,
    ]
  },
  [CitizenCode.Shopkeeper]: {
    name: 'Shopkeeper',
    attributes: [
      AttributeCode.Commerce,
      AttributeCode.Music,
      AttributeCode.Food,
      AttributeCode.History,
    ]
  },
  [CitizenCode.Pilot]: {
    name: 'Pilot',
    attributes: [
      AttributeCode.Air,
      AttributeCode.Fire,
      AttributeCode.Thrill,
      AttributeCode.Resources,
    ]
  },
  [CitizenCode.PoliceOfficer]: {
    name: 'Police Officer',
    attributes: [
      AttributeCode.Law,
      AttributeCode.Commerce,
      AttributeCode.Education,
      AttributeCode.Animals,
    ]
  },
  [CitizenCode.Captain]: {
    name: 'Captain',
    attributes: [
      AttributeCode.Sea,
      AttributeCode.Resources,
      AttributeCode.Electricity,
      AttributeCode.Dining,
    ]
  },
  [CitizenCode.Architect]: {
    name: 'Architect',
    attributes: [
      AttributeCode.Landmark,
      AttributeCode.History,
      AttributeCode.Technology,
      AttributeCode.Art,
    ]
  },
  [CitizenCode.Writer]: {
    name: 'Writer',
    attributes: [
      AttributeCode.Books,
      AttributeCode.Art,
      AttributeCode.Mysticism,
      AttributeCode.Tourism,
    ]
  },
  [CitizenCode.Scientist]: {
    name: 'Scientist',
    attributes: [
      AttributeCode.Science,
      AttributeCode.Space,
      AttributeCode.Electricity,
      AttributeCode.Sport,
    ]
  },
  [CitizenCode.Artist]: {
    name: 'Artist',
    attributes: [
      AttributeCode.Art,
      AttributeCode.Theatre,
      AttributeCode.Commerce,
      AttributeCode.Nature,
    ]
  },
  [CitizenCode.Astronaut]: {
    name: 'Astronaut',
    attributes: [
      AttributeCode.Space,
      AttributeCode.Technology,
      AttributeCode.Government,
      AttributeCode.Thrill,
    ]
  },
  [CitizenCode.Chef]: {
    name: 'Chef',
    attributes: [
      AttributeCode.Dining,
      AttributeCode.Food,
      AttributeCode.Tourism,
      AttributeCode.Fire,
    ]
  },
  [CitizenCode.Athlete]: {
    name: 'Athlete',
    attributes: [
      AttributeCode.Sport,
      AttributeCode.Health,
      AttributeCode.Food,
      AttributeCode.Train,
    ]
  },
  [CitizenCode.FireFighter]: {
    name: 'Fire Fighter',
    attributes: [
      AttributeCode.Fire,
      AttributeCode.Health,
      AttributeCode.Industry,
      AttributeCode.Commerce,
    ]
  },
  [CitizenCode.Cryptid]: {
    name: 'Cryptid',
    attributes: [
      AttributeCode.Mysticism,
      AttributeCode.Nature,
      AttributeCode.Space,
      AttributeCode.Dining,
    ]
  },
  [CitizenCode.Engineer]: {
    name: 'Engineer',
    attributes: [
      AttributeCode.Electricity,
      AttributeCode.Technology,
      AttributeCode.Industry,
      AttributeCode.Office,
    ]
  },
  [CitizenCode.Teacher]: {
    name: 'Teacher',
    attributes: [
      AttributeCode.Education,
      AttributeCode.Books,
      AttributeCode.Sport,
      AttributeCode.Resources,
    ]
  },
  [CitizenCode.Miner]: {
    name: 'Miner',
    attributes: [
      AttributeCode.Resources,
      AttributeCode.Industry,
      AttributeCode.Nature,
      AttributeCode.Landmark,
    ]
  },
  [CitizenCode.Guru]: {
    name: 'Guru',
    attributes: [
      AttributeCode.Mysticism,
      AttributeCode.Education,
      AttributeCode.Sea,
      AttributeCode.Train,
    ]
  },
  [CitizenCode.Driver]: {
    name: 'Driver',
    attributes: [
      AttributeCode.Road,
      AttributeCode.Thrill,
      AttributeCode.Music,
      AttributeCode.Science,
    ]
  },
  [CitizenCode.OfficeWorker]: {
    name: 'Office Worker',
    attributes: [
      AttributeCode.Office,
      AttributeCode.Music,
      AttributeCode.Train,
      AttributeCode.Books,
    ]
  },
}

export const startingCitizens: CitizenCode[] = [
  CitizenCode.HomeOwner,
  CitizenCode.Teacher,
  CitizenCode.Farmer,
  CitizenCode.OfficeWorker,
  CitizenCode.FireFighter,
  CitizenCode.Engineer,
  CitizenCode.PoliceOfficer,
  CitizenCode.Athlete,
  CitizenCode.Doctor,
  CitizenCode.Driver,
  CitizenCode.Shopkeeper,
  CitizenCode.Pilot,
]
