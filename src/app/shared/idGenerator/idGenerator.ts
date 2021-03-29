

const  idGenerator = () => {

    const Id =  Math.random().toString(36).substring(7)  + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)   ;
    
    return Id;
  
  }

export default idGenerator;