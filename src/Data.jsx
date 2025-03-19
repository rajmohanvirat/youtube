export const API_KEY='AIzaSyBAbPQZAIpZEhg2ksavPsia37-Sg81zE0w'

export const value_Conventer =(value)=>{
  
    if(value>=1000000){
      return Math.floor(value/1000000)+'M'
    }
    else if(value>=1000){
      return Math.floor(value/1000)+"K"
    }
    else{
      return value;
    }
}