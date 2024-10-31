export interface User {
    idUtente: number;
    email: string;
    nome: string;
    cognome: string;
    
  }
  
  export interface Recensione {
    id: number;
    text: string;
    user: User;
  }