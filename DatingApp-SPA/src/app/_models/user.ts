import { Photo } from './photo';

export interface User {
    id: string;
    userName: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: String;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    lookingFor: string;
    photos?: Photo[];
    roles?: string[];
}
