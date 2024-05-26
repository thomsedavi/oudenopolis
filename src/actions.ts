import { AttributeCode } from "./attributes";

export interface Action {
  name: string,
  requirements: {attributeId: AttributeCode, count: number}[],
}

export const Actions: { [id: string]: Action} = {
  '4-17': {
    name: 'Expand Small Homes',
    requirements: [{attributeId: AttributeCode.Residency, count: 2}],
  },
  '8-60': {
    name: 'Expand Small Offices',
    requirements: [{attributeId: AttributeCode.Office, count: 2}],
  },
}
