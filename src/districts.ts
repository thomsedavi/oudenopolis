import { AmenityCode } from "./amenities";

export interface Amenity {
  amenityId: AmenityCode,
  size: number,
}

export class District {
  amenities: Amenity[];

  constructor(amenities: Amenity[]) {
    this.amenities = amenities;
  }
}
