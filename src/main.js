import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";
import store from "./store";
import PanelHead from "./components/panelHead.vue"
//刷新动态路由白屏解决
const localData=localStorage.getItem('clinic')
if(localData){
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item=>{
    router.addRoute('main',item)
  })
}
router.beforeEach((to, from) => {
  const token= localStorage.getItem("token");
  //非登录页面token不存在
  if(!token && to.path !=='/login'){
    return '/login'
  }else if(token && to.path=='/login'){
     return '/'
  }else{
    return true
  }
})
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component("PanelHead", PanelHead);
app.use(router);
app.use(store);

app.mount("#app");

