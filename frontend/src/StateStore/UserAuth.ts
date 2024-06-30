import { atom } from 'recoil';

const LOGGEDIN = atom({
  key: 'loggedIn', 
  default: false 
});

type tok = string | null

const TOKEN = atom<tok>({
    key: 'token',
    default : localStorage.getItem("token") ? localStorage.getItem("token") : null
})

const USERDETAILS = atom({
    key : 'userDetails',
    default : {
      firstName : "John" , 
      lastName : "Doe"
    }
})

export {
  TOKEN , USERDETAILS , LOGGEDIN
}