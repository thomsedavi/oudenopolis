import { AmenityCode } from "./amenities";

export interface Amenity {
  amenityCode: AmenityCode,
  size: 1 | 2 | 4,
  density: 1 | 2 | 4,
  usage?: 'LOW' | 'MEDIUM' | 'HIGH',
  age?: number,
}

export class District {
  amenities: Amenity[];

  constructor(amenities: Amenity[]) {
    this.amenities = amenities;
  }
}
