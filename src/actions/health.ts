import { Action, DistrictState, Result } from "../actions";
import { EmploymentRate } from "../enums";
import { AmenityCode } from "./../amenities";

export const getCreateHealthSmall = (districtState: DistrictState): Action => {
  const lowResult: Result = {
    type: 'CREATE',
    amenity: {code: AmenityCode.Medical, size: 1, density: 1, usage: 'LOW'},
    description: 'Build small clinic, no one moves in',
    resultDescription: 'You build a clinic but no one works here',
  };

  const mediumResult: Result = {
    type: 'CREATE',
    amenity: {code: AmenityCode.Medical, size: 1, density: 1, usage: 'MEDIUM'},
    description: 'Build small clinic, some people move in',
    resultDescription: 'You build a clinic and a few people work there',
  };

  const highResult: Result = {
    type: 'CREATE',
    amenity: {code: AmenityCode.Medical, size: 1, density: 1, usage: 'HIGH'},
    description: 'Build small clinic, everyone moves in',
    resultDescription: 'You build a clinic and everyone works there',
  };

  return {
    name: 'Create Small Clinic',
    description: 'Create a small clinic, people may or may not ',
    cardRequirements: [],
    results: [
      {roll: 1, ...lowResult},
      {roll: 2, ...(districtState.employmentRate === EmploymentRate.Low ? mediumResult : lowResult)},
      {roll: 3, ...(districtState.employmentRate === EmploymentRate.High ? lowResult : mediumResult)},
      {roll: 4, ...(districtState.employmentRate === EmploymentRate.Low ? highResult : mediumResult)},
      {roll: 5, ...(districtState.employmentRate === EmploymentRate.High ? mediumResult : highResult)},
      {roll: 6, ...highResult}],
  };
}
