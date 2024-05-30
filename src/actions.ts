import { AttributeCode } from "./attributes";

export interface Action {
  name: string,
  cardRequirements: {attributeId: AttributeCode, count: number}[],
  spaceRequired: number,
}

export const Actions: { [id: string]: Action} = {
  '0-39': {
    name: 'Build Industrial Garage',
    cardRequirements: [{attributeId: AttributeCode.Industry, count: 2}],
    spaceRequired: 2,
  },
  '4-48': {
    name: 'Build Grocery Cart',
    cardRequirements: [{attributeId: AttributeCode.Food, count: 2}],
    spaceRequired: 2,
  },
  '5-99': {
    name: 'Build Petting Zoo',
    cardRequirements: [{attributeId: AttributeCode.Animals, count: 2}],
    spaceRequired: 2,
  },
  '0-18': {
    name: 'Build Whirly Goober',
    cardRequirements: [{attributeId: AttributeCode.Thrill, count: 2}],
    spaceRequired: 2,
  },
  '4-17': {
    name: 'Build Small Homes',
    cardRequirements: [{attributeId: AttributeCode.Residency, count: 2}],
    spaceRequired: 2,
  },
  '0-88': {
    name: 'Build Medium Homes',
    cardRequirements: [{attributeId: AttributeCode.Residency, count: 3}],
    spaceRequired: 3,
  },
  '8-60': {
    name: 'Build Small Offices',
    cardRequirements: [{attributeId: AttributeCode.Office, count: 2}],
    spaceRequired: 2,
  },
  '5-95': {
    name: 'Build Medium Offices',
    cardRequirements: [{attributeId: AttributeCode.Office, count: 3}],
    spaceRequired: 3,
  },
}
