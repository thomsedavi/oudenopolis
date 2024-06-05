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
