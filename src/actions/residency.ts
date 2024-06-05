import { Action, DistrictState, Result } from "../actions";
import { AmenityCode } from "./../amenities";
import { EmploymentRate } from "./../enums";

export const getResidencySmall = (districtState: DistrictState): Action => {
  const lowResult: Result = {
    type: 'CREATE',
    amenity: {code: AmenityCode.Housing, size: 1, density: 1, usage: 'LOW'},
    description: 'Build small houses, no one moves in',
    resultDescription: 'People are too uncertain about the future, no one moves in',
  };

  const mediumResult: Result = {
    type: 'CREATE',
    amenity: {code: AmenityCode.Housing, size: 1, density: 1, usage: 'MEDIUM'},
    description: 'Build small houses, some people move in',
    resultDescription: 'A ho hum amount of people move in',
  };

  const highResult: Result = {
    type: 'CREATE',
    amenity: {code: AmenityCode.Housing, size: 1, density: 1, usage: 'HIGH'},
    description: 'Build small houses, everyone moves in',
    resultDescription: 'This sounds like a dream location, everyone moves in!',
  };

  return {
    name: 'Create Small Homes',
    description: 'Create some small homes, people may or may not move in',
    cardRequirements: [],
    results: [
      {roll: 1, ...lowResult},
      {roll: 2, ...(districtState.employmentRate === EmploymentRate.High ? mediumResult : lowResult)},
      {roll: 3, ...(districtState.employmentRate === EmploymentRate.Low ? lowResult : mediumResult)},
      {roll: 4, ...(districtState.employmentRate === EmploymentRate.High ? highResult : mediumResult)},
      {roll: 5, ...(districtState.employmentRate === EmploymentRate.Low ? mediumResult : highResult)},
      {roll: 6, ...highResult}],
  };
}
