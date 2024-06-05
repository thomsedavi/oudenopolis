import { AttributeCode } from "./attributes";
import { Amenity } from "./districts";
import { EmploymentRate } from "./enums";

export interface DistrictState {
  employmentRate: EmploymentRate,
}

export interface Result {
  type: 'CREATE' | 'UPDATE' | 'FAILURE',
  amenity: Amenity,
  roll?: number,
  description: string,
  resultDescription: string,
}

export interface Action {
  name: string,
  description: string,
  cardRequirements: {attributeCode: AttributeCode, count: number}[],
  spaceRequired?: number,
  employmentRateRequired?: EmploymentRate,
  amenityRequirements?: Amenity[]
  results: Result[],
}

// this list is obsolete, just keeping it here for reference
const Actions: { [id: string]: Action} = {
  '0-39': {
    name: 'Build Industrial Garage',
    description: '',
    cardRequirements: [{attributeCode: AttributeCode.Industry, count: 2}],
    spaceRequired: 2,
    results: [],
  },
  '4-48': {
    name: 'Build Grocery Cart',
    description: '',
    cardRequirements: [{attributeCode: AttributeCode.Food, count: 2}],
    spaceRequired: 2,
    results: [],
  },
  '5-99': {
    name: 'Build Petting Zoo',
    description: '',
    cardRequirements: [{attributeCode: AttributeCode.Animals, count: 2}],
    spaceRequired: 2,
    results: [],
  },
  '0-18': {
    name: 'Build Whirly Goober',
    description: '',
    cardRequirements: [{attributeCode: AttributeCode.Thrill, count: 2}],
    spaceRequired: 2,
    results: [],
  },
  '8-60': {
    name: 'Build Small Offices',
    description: '',
    cardRequirements: [{attributeCode: AttributeCode.Office, count: 2}],
    spaceRequired: 2,
    results: [],
  },
  '5-95': {
    name: 'Build Medium Offices',
    description: '',
    cardRequirements: [{attributeCode: AttributeCode.Office, count: 3}],
    spaceRequired: 3,
    results: [],
  },
}
