import { AmenityCode } from "./amenities";

export interface Amenity {
  code: AmenityCode,
  size?: 1 | 2 | 4,
  density?: 1 | 2 | 4,
  usage?: 'LOW' | 'MEDIUM' | 'HIGH',
  age?: number,
}

export class District {
  name: string;
  amenities: Amenity[];

  constructor(name: string, amenities: Amenity[]) {
    this.name = name;
    this.amenities = amenities;
  }
}

export const getDistrict = (x: number, y: number): District => {
  const amenities: Amenity[] = [{code: AmenityCode.Water, size: 1, density: 1}];

  // a diagonal starting road going to the Northwest
  if (x === y && x <= 0) {
    amenities.push({code: AmenityCode.Road});
  }

  return new District(`District #${x}${y}`, amenities);
}
