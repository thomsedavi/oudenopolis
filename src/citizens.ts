import { AttributeCode } from "./attributes";

interface ICitizens { [id: string]: { name: string, attributes: AttributeCode[] } }

export enum CitizenId {
  Actor = '7-11',
  Architect = '0-04',
  Artist = '9-28',
  Astronaut = '1-24',
  Athlete = '1-13',
  Banker = '2-09',
  Captain = '0-86',
  Chef = '2-80',
  Cryptid = '9-71',
  Daredevil = '7-73',
  Doctor = '4-56',
  Driver = '0-13',
  Engineer = '3-16',
  Explorer = '7-27',
  FactoryWorker = '6-80',
  Farmer = '0-36',
  FireFighter = '7-08',
  Guru = '1-98',
  Historian = '0-99',
  HomeOwner = '9-04',
  Inventor = '3-23',
  Mathematician = '9-74',
  Mayor = '9-87',
  Miner = '2-41',
  Musician = '1-57',
  Mystic = '6-69',
  OfficeWorker = '2-83',
  Pilot = '9-18',
  PoliceOfficer = '8-19',
  Robot = '0-73',
  Scientist = '7-56',
  Shopkeeper = '4-28',
  Soldier = '7-67',
  Teacher = '4-76',
  Tourist = '6-63',
  Writer = '1-42',
  ZooKeeper = '5-76',
}

export const Citizens: ICitizens = {
  [CitizenId.Actor]: {
    name: 'Actor',
    attributes: [
      AttributeCode.Theatre,
      AttributeCode.Road,
      AttributeCode.Health,
      AttributeCode.Exploration,
    ]
  },
  [CitizenId.Architect]: {
    name: 'Architect',
    attributes: [
      AttributeCode.Landmark,
      AttributeCode.History,
      AttributeCode.Art,
      AttributeCode.Electricity,
    ]
  },
  [CitizenId.Artist]: {
    name: 'Artist',
    attributes: [
      AttributeCode.Art,
      AttributeCode.Theatre,
      AttributeCode.Commerce,
      AttributeCode.Nature,
    ]
  },
  [CitizenId.Astronaut]: {
    name: 'Astronaut',
    attributes: [
      AttributeCode.Space,
      AttributeCode.Military,
      AttributeCode.Train,
      AttributeCode.Technology,
    ]
  },
  [CitizenId.Athlete]: {
    name: 'Athlete',
    attributes: [
      AttributeCode.Sport,
      AttributeCode.Health,
      AttributeCode.Nature,
      AttributeCode.Food,
    ]
  },
  [CitizenId.Banker]: {
    name: 'Banker',
    attributes: [
      AttributeCode.Finance,
      AttributeCode.Train,
      AttributeCode.Law,
      AttributeCode.Government,
    ]
  },
  [CitizenId.Captain]: {
    name: 'Captain',
    attributes: [
      AttributeCode.Sea,
      AttributeCode.Resources,
      AttributeCode.Dining,
      AttributeCode.Mathematics,
    ]
  },
  [CitizenId.Chef]: {
    name: 'Chef',
    attributes: [
      AttributeCode.Dining,
      AttributeCode.Food,
      AttributeCode.Tourism,
      AttributeCode.Fire,
    ]
  },
  [CitizenId.Cryptid]: {
    name: 'Cryptid',
    attributes: [
      AttributeCode.Mysticism,
      AttributeCode.Thrill,
      AttributeCode.Exploration,
      AttributeCode.Mathematics,
    ]
  },
  [CitizenId.Daredevil]: {
    name: 'Dare Devil',
    attributes: [
      AttributeCode.Thrill,
      AttributeCode.Theatre,
      AttributeCode.Landmark,
      AttributeCode.Sport,
    ]
  },
  [CitizenId.Doctor]: {
    name: 'Doctor',
    attributes: [
      AttributeCode.Health,
      AttributeCode.Residency,
      AttributeCode.Air,
      AttributeCode.Office,
    ]
  },
  [CitizenId.Driver]: {
    name: 'Driver',
    attributes: [
      AttributeCode.Road,
      AttributeCode.Thrill,
      AttributeCode.Music,
      AttributeCode.Law,
    ]
  },
  [CitizenId.Engineer]: {
    name: 'Engineer',
    attributes: [
      AttributeCode.Electricity,
      AttributeCode.Technology,
      AttributeCode.Industry,
      AttributeCode.Office,
    ]
  },
  [CitizenId.Explorer]: {
    name: 'Explorer',
    attributes: [
      AttributeCode.Exploration,
      AttributeCode.History,
      AttributeCode.Sea,
      AttributeCode.Space,
    ]
  },
  [CitizenId.FactoryWorker]: {
    name: 'Factory Worker',
    attributes: [
      AttributeCode.Industry,
      AttributeCode.Residency,
      AttributeCode.Space,
      AttributeCode.Robotics,
    ]
  },
  [CitizenId.Farmer]: {
    name: 'Farmer',
    attributes: [
      AttributeCode.Food,
      AttributeCode.Train,
      AttributeCode.Animals,
      AttributeCode.Exploration,
    ]
  },
  [CitizenId.FireFighter]: {
    name: 'Fire Fighter',
    attributes: [
      AttributeCode.Fire,
      AttributeCode.Health,
      AttributeCode.Industry,
      AttributeCode.Commerce,
    ]
  },
  [CitizenId.Guru]: {
    name: 'Guru',
    attributes: [
      AttributeCode.Mysticism,
      AttributeCode.Education,
      AttributeCode.Finance,
      AttributeCode.Military,
    ]
  },
  [CitizenId.Historian]: {
    name: 'Historian',
    attributes: [
      AttributeCode.History,
      AttributeCode.Books,
      AttributeCode.Theatre,
      AttributeCode.Science,
    ]
  },
  [CitizenId.HomeOwner]: {
    name: 'Home Owner',
    attributes: [
      AttributeCode.Residency,
      AttributeCode.Dining,
      AttributeCode.Road,
      AttributeCode.Finance,
    ]
  },
  [CitizenId.Inventor]: {
    name: 'Inventor',
    attributes: [
      AttributeCode.Technology,
      AttributeCode.Science,
      AttributeCode.Sea,
      AttributeCode.Government,
    ]
  },
  [CitizenId.Mathematician]: {
    name: 'Mathematician',
    attributes: [
      AttributeCode.Mathematics,
      AttributeCode.Education,
      AttributeCode.Robotics,
      AttributeCode.Technology,
    ]
  },
  [CitizenId.Mayor]: {
    name: 'Mayor',
    attributes: [
      AttributeCode.Government,
      AttributeCode.Tourism,
      AttributeCode.Residency,
      AttributeCode.Military,
    ]
  },
  [CitizenId.Miner]: {
    name: 'Miner',
    attributes: [
      AttributeCode.Resources,
      AttributeCode.Industry,
      AttributeCode.Nature,
      AttributeCode.Landmark,
    ]
  },
  [CitizenId.Musician]: {
    name: 'Musician',
    attributes: [
      AttributeCode.Music,
      AttributeCode.Art,
      AttributeCode.Air,
      AttributeCode.Education,
    ]
  },
  [CitizenId.Mystic]: {
    name: 'Mystic',
    attributes: [
      AttributeCode.Mysticism,
      AttributeCode.Electricity,
      AttributeCode.Fire,
      AttributeCode.Animals,
    ]
  },
  [CitizenId.OfficeWorker]: {
    name: 'Office Worker',
    attributes: [
      AttributeCode.Office,
      AttributeCode.Music,
      AttributeCode.Train,
      AttributeCode.Books,
    ]
  },
  [CitizenId.Pilot]: {
    name: 'Pilot',
    attributes: [
      AttributeCode.Air,
      AttributeCode.Fire,
      AttributeCode.Thrill,
      AttributeCode.Resources,
    ]
  },
  [CitizenId.PoliceOfficer]: {
    name: 'Police Officer',
    attributes: [
      AttributeCode.Law,
      AttributeCode.Commerce,
      AttributeCode.Animals,
      AttributeCode.Sea,
    ]
  },
  [CitizenId.Robot]: {
    name: 'Robot',
    attributes: [
      AttributeCode.Robotics,
      AttributeCode.Science,
      AttributeCode.Dining,
      AttributeCode.Electricity,
    ]
  },
  [CitizenId.Scientist]: {
    name: 'Scientist',
    attributes: [
      AttributeCode.Science,
      AttributeCode.Space,
      AttributeCode.Sport,
      AttributeCode.Mathematics,
    ]
  },
  [CitizenId.Shopkeeper]: {
    name: 'Shopkeeper',
    attributes: [
      AttributeCode.Commerce,
      AttributeCode.Music,
      AttributeCode.Food,
      AttributeCode.Finance,
    ]
  },
  [CitizenId.Soldier]: {
    name: 'Soldier',
    attributes: [
      AttributeCode.Military,
      AttributeCode.Resources,
      AttributeCode.Law,
      AttributeCode.Robotics,
    ]
  },
  [CitizenId.Teacher]: {
    name: 'Teacher',
    attributes: [
      AttributeCode.Education,
      AttributeCode.Books,
      AttributeCode.Sport,
      AttributeCode.Government,
    ]
  },
  [CitizenId.Tourist]: {
    name: 'Tourist',
    attributes: [
      AttributeCode.Tourism,
      AttributeCode.Air,
      AttributeCode.Landmark,
      AttributeCode.Road,
    ]
  },
  [CitizenId.Writer]: {
    name: 'Writer',
    attributes: [
      AttributeCode.Books,
      AttributeCode.Art,
      AttributeCode.Mysticism,
      AttributeCode.Tourism,
    ]
  },
  [CitizenId.ZooKeeper]: {
    name: 'Zoo Keeper',
    attributes: [
      AttributeCode.Animals,
      AttributeCode.Nature,
      AttributeCode.Office,
      AttributeCode.History,
    ]
  },
}

export const startingCitizens: CitizenId[] = [
  CitizenId.Athlete,
  //CitizenId.Doctor,
  //CitizenId.Driver,
  //CitizenId.Engineer,
  //CitizenId.Farmer,
  CitizenId.FireFighter,
  CitizenId.HomeOwner,
  CitizenId.Mayor,
  //CitizenId.Pilot,
  //CitizenId.PoliceOfficer,
  //CitizenId.Shopkeeper,
  //CitizenId.Teacher,
]
