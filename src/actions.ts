import { AmenityCode } from "./amenities";
import { AttributeCode } from "./attributes";
import { DistrictAttributes } from "./districtAttributes";
import { Amenity } from "./districts";
import { EmploymentRate } from "./enums";

export interface Result {
  type: 'ADD',
  amenity: Amenity,
  from: number,
  to: number,
  description: string,
  resultDescription: string,
}

export interface Action {
  name: string,
  description: string,
  cardRequirements: {attributes: {attributeId: AttributeCode, count: number}[], employmentRate?: EmploymentRate},
  spaceRequired: number,
  results: Result[],
}

export const Actions: { [id: string]: Action} = {
  '0-39': {
    name: 'Build Industrial Garage',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Industry, count: 2}]},
    spaceRequired: 2,
    results: [],
  },
  '4-48': {
    name: 'Build Grocery Cart',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Food, count: 2}]},
    spaceRequired: 2,
    results: [],
  },
  '5-99': {
    name: 'Build Petting Zoo',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Animals, count: 2}]},
    spaceRequired: 2,
    results: [],
  },
  '0-18': {
    name: 'Build Whirly Goober',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Thrill, count: 2}]},
    spaceRequired: 2,
    results: [],
  },
  '4-17': {
    name: 'Build Small Homes',
    description: 'Wouldn\'t it be great if someone moved in?',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Residency, count: 2}], employmentRate: EmploymentRate.NotApplicable},
    spaceRequired: 2,
    results: [
      {
        type: 'ADD',
        amenity: {amenityCode: AmenityCode.Housing, size: 1, density: 1, attributes: [DistrictAttributes.Abandoned]},
        from: 2,
        to: 2,
        description: 'Build houses, but no one moves in',
        resultDescription: 'People are too uncertain about the future, no one moves in',
      },
      {
        type: 'ADD',
        amenity: {amenityCode: AmenityCode.Housing, size: 1, density: 1, attributes: [DistrictAttributes.Occupied]},
        from: 3,
        to: 12,
        description: 'Build houses, and people move in',
        resultDescription: 'People are excited about the future and move in',
      },
    ],
  },
  '0-88': {
    name: 'Build Medium Homes',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Residency, count: 3}]},
    spaceRequired: 3,
    results: [],
  },
  '8-60': {
    name: 'Build Small Offices',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Office, count: 2}]},
    spaceRequired: 2,
    results: [],
  },
  '5-95': {
    name: 'Build Medium Offices',
    description: '',
    cardRequirements: {attributes: [{attributeId: AttributeCode.Office, count: 3}]},
    spaceRequired: 3,
    results: [],
  },
}
