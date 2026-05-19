export interface WasteSpot {
  id: string;
  reporterId: string;
  reporterName: string;
  latitude: number;
  longitude: number;
  description: string;
  status: 'pending' | 'cleaning' | 'cleaned';
  imageUrl: string;
  createdAt: any;
  upvotes: number;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  xp: number;
}
