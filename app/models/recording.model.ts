export interface Recording {
  id: string;
  date: Date;
  images: ImageData[];
}

export interface ImageData {
  path: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
}