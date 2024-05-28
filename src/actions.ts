import { AttributeCode } from "./attributes";

export interface Action {
  name: string,
  cardRequirements: {attributeId: AttributeCode, count: number}[],
}

export const Actions: { [id: string]: Action} = {
  '4-17': {
    name: 'Build Small Homes',
    cardRequirements: [{attributeId: AttributeCode.Residency, count: 2}],
  },
  '8-60': {
    name: 'Build Small Offices',
    cardRequirements: [{attributeId: AttributeCode.Office, count: 2}],
  },
}
