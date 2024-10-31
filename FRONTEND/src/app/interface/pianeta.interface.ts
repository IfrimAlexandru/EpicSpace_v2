export const planetDetails = {
    luna: {
        flightTime: '3 hrs',
        distance: '384,400 km',
        price: 'Since $10000'
      },
      marte: {
        flightTime: '84 days/ 2hrs with warp',
        distance: '78 million km',
        price: 'Since $20000'
      },
      venere: {
        flightTime: '44 days/ 1hr with warp',
        distance: '41 million km',
        price: 'Since $30000'
      },
      nettuno: {
        flightTime: '5 days with warp(127hrs)',
        distance: '4351 billion km',
        price: 'Since $40000'
      },
      mercurio: {
        flightTime: '83 days(2003hrs)/ 2hrs with warp',
        distance: '77 million km',
        price: 'Since $50000'
      },
      giove: {
        flightTime: '16hrs with warp',
        distance: '628 million km',
        price: 'Since $60000'
      },
      saturno: {
        flightTime: '33hrs with warp',
        distance: '1275 billion km',
        price: 'Since $70000'
      },
      urano: {
        flightTime: '3 days with warp(74 hrs)',
        distance: '2723 billion km',
        price: 'Since $80000'
      },
      plutone: {
        flightTime: '6 days with warp(153 hrs)',
        distance: '5913 billion km',
        price: 'Since $90000'
      }
};    

export interface Pianeta {
    id: number; 
    nome: keyof typeof planetDetails;
    immagine: string;
    flightTime: string;
    distance: string;
    price: string;
    
  }
  