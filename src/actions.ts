import { AttributeCode } from "./attributes";

export interface Action {
  name: string,
  cardRequirements: {attributeId: AttributeCode, count: number}[],
  spaceRequired: number,
}

export const Actions: { [id: string]: Action} = {
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
