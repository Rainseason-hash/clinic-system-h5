const localData=localStorage.getItem('clinic')
const state=localData?JSON.parse(localData):{
  // 是否折叠
     isCollapse:false,
     selectMenu:[],
     routerList:[],
     menuActive:'1-1'
}
const mutations={
  collapseMenu(state){
    state.isCollapse=!state.isCollapse
  },
  addMenu(state,payload){
    // payload是当前点击时的路径，这里是去重，防止重复添加在导航栏上
    if(state.selectMenu.findIndex(item=>item.path === payload.path) ===-1){
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state,payload){
    // payload是当前点击时的路径
    //找到点击数据的索引
    const index=state.selectMenu.findIndex(item=>item.name===payload.name)
    state.selectMenu.splice(index,1)
  },
  dynamicMenu(state,payload){
    console.log(payload)
    //通过glob导入文件
    const modules=import.meta.glob('../views/**/**/*.vue')
    console.log(modules)
    function routeSet(router){
        router.forEach(route => {
          //判断没有子菜单，拼接路由数据
          if(!route.children){
            const url=`../views${route.meta.path}/index.vue`
            route.component=modules[url]
          }else{
            //有子菜单就递归
            routeSet(route.children)
          }
        });
    }
    routeSet(payload)
    //拿到完整的路由数据
    state.routerList=payload
  },
  updateMenuActive(state,payload){
    state.menuActive=payload

  }
}
export default {
  state,
  mutations
}