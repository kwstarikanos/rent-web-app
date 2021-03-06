import {File} from './file';

export interface Hotel {
  id: number;
  name: string;
  number_of_rooms: number;
  address: string;
  stars: string;
  hotel_photos: Array<File>;
  email: string;
  lat: string;
  lng: string;
  description_short: string;
  description_long: string;
  amenities: any[];
  min_room_price: number;
  max_room_price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
