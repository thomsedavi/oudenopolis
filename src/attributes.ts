interface IAttributes { [id: string]: { name: string, paths: string[] } }

export enum AttributeCode {
  Air = '7-81',
  Animals = '0-92',
  Art = '0-01',
  Books = '5-83',
  Commerce = '2-81',
  Dining = '6-87',
  Education = '3-50',
  Electricity = '8-63',
  Fire = '6-49',
  Food = '9-15',
  Government = '9-32',
  Health = '5-48',
  History = '3-03',
  Industry = '8-26',
  Landmark = '2-88',
  Law = '0-60',
  Music = '2-12',
  Mysticism = '8-83',
  Nature = '9-43',
  Office = '4-57',
  Residency = '4-25',
  Resources = '4-19',
  Road = '9-37',
  Science = '2-08',
  Sea = '2-14',
  Space = '5-68',
  Sport = '9-06',
  Technology = '6-13',
  Theatre = '8-59',
  Thrill = '9-39',
  Tourism = '6-96',
  Train = '1-10',
}

export const Attributes: IAttributes = {
  [AttributeCode.Air]: {
    name: 'Air',
    paths: [
      'M 0.5,0 L 0.6,0.1 L 0.6,0.3 L 1,0.6 L 0.6,0.6 L 0.6,0.9 L 0.7,1 L 0.3,1 L 0.4,0.9 L 0.4,0.6 L 0,0.6 L 0.4,0.3 L 0.4,0.1 Z',
    ]
  },
  [AttributeCode.Animals]: {
    name: 'Animals',
    paths: [
      'M 0,0.5 L 0.2,0.3 L 0.2,0.5 L 1,0.5 L 0.8,0.5 L 0.8,1 L 0.8,0.7 L 0.4,0.7 L 0.4, 1 L 0.4,0.5 Z',
    ]
  },
  [AttributeCode.Art]: {
    name: 'Art',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Books]: {
    name: 'Books',
    paths: [
      'M 0,0 L 0.5,0.25 L 1,0 L 1,0.75 L 0.5,1 L 0,0.75 Z',
    ]
  },
  [AttributeCode.Commerce]: {
    name: 'Commerce',
    paths: [
      'M 0,0 L 0.3,0 L 1,0.7 L 0.7,1 L 0,0.3 Z',
    ]
  },
  [AttributeCode.Dining]: {
    name: 'Dining',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Education]: {
    name: 'Education',
    paths: [
      'M 0,0.2 L 1,0.2 L 1,0.8 L 1,0.2 L 0.65,0.2 L 0.8,0.6 L 0.2,0.6 L 0.35,0.2 Z',
    ]
  },
  [AttributeCode.Electricity]: {
    name: 'Electricity',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Fire]: {
    name: 'Fire',
    paths: [
      'M 0.5,1 L 0.1,0.6 L 0.1,0.2 L0.3,0 L 0.3,0.3 L 0.6,0 L 0.9,0.3 L 0.9,0.6 Z',
    ]
  },
  [AttributeCode.Food]: {
    name: 'Food',
    paths: [
      'M 0.4,1 L 0.2,0.8 L 0.2,0.6 L 0.4,0.4 L 0.2,0.4 L 0.35,0.3 L 0.5,0.4 L 0.6,0.4 L 0.8,0.6 L 0.8,0.8 L 0.6,1 Z',
    ]
  },
  [AttributeCode.Government]: {
    name: 'Government',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Health]: {
    name: 'Health',
    paths: [
      'M 0,1 L 0.2,0.8 L 0.1,0.7 L 0.5,0.3 L 0.6,0.4 L 0.9,0.1 L 0.8,0 L 1,0.2 L 0.9,0.1 L 0.6,0.4 L 0.7,0.5 L 0.3,0.9 L 0.2,0.8 Z',
    ]
  },
  [AttributeCode.History]: {
    name: 'History',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Industry]: {
    name: 'Industry',
    paths: [
      'M 0,1 L 0,0.25 L 0.5,0 L 0.5,0.25 L 1,0 L1,1 Z',
    ]
  },
  [AttributeCode.Landmark]: {
    name: 'Landmark',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Law]: {
    name: 'Law',
    paths: [
      'M 0,0 L 1,0 L 1,0.1 L 0,0.1 Z',
      'M 0,0.9 L 1,0.9 L 1,1 L 0,1 Z',
      'M 0.1,0.1 L 0.2,0.1 L 0.2,0.9 L 0.1,0.9 Z',
      'M 0.45,0.1 L 0.55,0.1 L 0.55,0.9 L 0.45,0.9 Z',
      'M 0.8,0.1 L 0.9,0.1 L 0.9,0.9 L 0.8,0.9 Z',
    ]
  },
  [AttributeCode.Music]: {
    name: 'Music',
    paths: [
      'M 0.4,0 L 0.8,0.4 L 0.8,0.6 L 0.6,0.4 L 0.6,1 L 0.4,1 L 0.2,0.8 L 0.4,0.6 Z',
    ]
  },
  [AttributeCode.Mysticism]: {
    name: 'Mysticism',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Nature]: {
    name: 'Nature',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Office]: {
    name: 'Office',
    paths: [
      'M 0.2,1 L 0.2,0 L 0.8,0 L 0.8,1 L 0.6,1 L 0.6,0.6 M 0.6,0.4 L 0.6,0.2 L 0.4,0.2 L 0.4,0.4 L 0.6,0.4 M 0.6,0.6 L 0.4,0.6 L 0.4,1 L 0.2,1',
    ]
  },
  [AttributeCode.Residency]: {
    name: 'Residency',
    paths: [
      'M 0,1 L 0,0.5 L 0.5,0 L 1,0.5 L 1,1 Z',
    ]
  },
  [AttributeCode.Resources]: {
    name: 'Resources',
    paths: [
      'M 0,1 L 0,0.5 L 0.3,0.5 L 0.3,0 L 0.8,0 L 0.8,0.5 L 1,0.5 L 1,1 Z',
    ]
  },
  [AttributeCode.Road]: {
    name: 'Road',
    paths: [
      'M 0,1 L 0.5,0 L 1,1 L 0.9,1 L 0.5,0.2 L 0.1,1 Z',
      'M 0.45,0.8 L 0.55,0.8 L 0.55,1 L 0.45,1 Z',
      'M 0.45,0.4 L 0.55,0.4 L 0.55,0.6 L 0.45,0.6 Z',
    ]
  },
  [AttributeCode.Science]: {
    name: 'Science',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Sea]: {
    name: 'Sea',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Space]: {
    name: 'Space',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Sport]: {
    name: 'Sport',
    paths: [
      'M 0,0 L 0.4,0.8 L 0.6,0.8 L 0.7,1 L 0.5,1 Z',
      'M 0.7,0.4 L 0.9,0.4 L 1,0.6 L 0.8,0.6 Z',
    ]
  },
  [AttributeCode.Technology]: {
    name: 'Technology',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Theatre]: {
    name: 'Theate',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Thrill]: {
    name: 'Thrill',
    paths: [
      'M 0,0 L 0.1,0.1 L 0.1,0.6 L 0,1 L 1,1 L 0.7,0.6 L 0.1,0.6 L 0.1,0.1 Z',
    ]
  },
  [AttributeCode.Tourism]: {
    name: 'Tourism',
    paths: [
      'M 0.1,0.3 A 0.2,0.2 0,0,1 0.5,0.3 A 0.2,0.2 0,0,1 0.9,0.3 Q 0.9,0.6 0.5,0.9 Q 0.1,0.6 0.1,0.3 z',
    ]
  },
  [AttributeCode.Train]: {
    name: 'Train',
    paths: [
      'M 0,1 L 0.5,0 L 1,1 L 0.9,1 L 0.5,0.2 L 0.1,1 Z',
      'M 0.2,0.8 L 0.8,0.8 L 0.85,0.9 L 0.15,0.9 Z',
      'M 0.35,0.5 L 0.65,0.5 L 0.7,0.6 L 0.3,0.6 Z',
    ]
  },
}
