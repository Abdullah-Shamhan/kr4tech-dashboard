


  export const sortByTitle = (a , b) => {
 
    if ( a.enTitle < b.enTitle ){
      return -1;
    }
    if ( a.enTitle > b.enTitle ){
      return 1;
    }
    return 0;

  }

  export const sortByDate = (a , b) => {
    
    const a_Date = Date.parse(a.dateAdded);
    const b_Date = Date.parse(b.dateAdded);

    if ( a_Date < b_Date ){
      return 1;
    }
    if ( a_Date > b_Date ){
      return -1;
    }
    return 0;

  }

  export const sortByPageType = (a , b) => {
  
    if ( a.pageType < b.pageType ){
      return -1;
    }
    if ( a.pageType > b.pageType ){
      return 1;
    }
    return 0;

  }

  export const sortByCost = (a , b) => {
    
    if ( a.isFree < b.isFree ){
      return -1;
    }
    if ( a.isFree > b.isFree ){
      return 1;
    }
    return 0;

  }

  export const sortByName = (a , b) => {
 
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;

  }

  export const filter = (list: any[]  , filterBy: string) => {

    if (filterBy !== 'all')
    return list.filter(item => item.pageType === filterBy);

    else
    return list;

  }