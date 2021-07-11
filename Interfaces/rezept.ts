interface Rezept {
    _id?: string;
    titel: string; 
    imageUrl: string; 
    zutatenliste: Menge[];
    schritte: string[];
    author: string;
    likedBy?: string[];
}