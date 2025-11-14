import { createStore } from "vuex";
import menu from "./menu";
import createPersisted from "vuex-persistedstate"
export default createStore({
     plugins:[new createPersisted({
      key:'clinic'
     })],
     modules:{
       menu
     }
})