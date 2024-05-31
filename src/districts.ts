import { AmenityCode } from "./amenities";

export interface Amenity {
  amenityCode: AmenityCode,
  size: 1 | 2 | 4,
  density: 1 | 2 | 4,
}

export class District {
  amenities: Amenity[];

  constructor(amenities: Amenity[]) {
    this.amenities = amenities;
  }
}
