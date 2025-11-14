<template>
  <div class="header-container">
     <div class="header-left flex-box">
      <el-icon class="icon" size="20"  @click="store.commit('collapseMenu')">
        <component :is="isCollapse?'Fold':'Expand'"></component> 
      </el-icon>
      <ul class="flex-box">
        <li v-for="(item,index) in selectMenu" 
        :key="item.path" 
        class="tab flex-box" 
        :class="{selected :route.path===item.path}">
          <el-icon size="14" >
            <component :is="item.icon"></component>
          </el-icon>
          <router-link class="flex-box text" :to="{path:item.path}">
            {{item.name}}
          </router-link>
          <el-icon class="close"  size="14" @click="closeMenu(item,index)"><Close/></el-icon>
        </li>
      </ul>
     </div>
     <div class="header-right">
      
  <el-dropdown @command="handleClick">
    <div class="el-dropdown-link flex-box">
      <el-avatar  :src="info.avatar"></el-avatar>
    <p class="user-name">{{ info.name }}</p>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

     </div>
  </div>
</template>

<script setup>
import {useStore} from 'vuex'
import {computed} from 'vue'
// useroute是当前的路由对象，拿到当前的路径
import { useRoute,useRouter } from 'vue-router'
const route=useRoute()
const router=useRouter()
const store=useStore()
// 拿到数据
const isCollapse=computed(()=>store.state.menu.isCollapse)
const selectMenu=computed(()=>store.state.menu.selectMenu)
// 获得在mutations中定义的方法，通过commit调用
// console.log(store.state.menu)
const info=JSON.parse(localStorage.getItem('userInfo'))
//关闭菜单
const closeMenu=(item,index)=>{
  store.commit('closeMenu',item)
  //删除的非选中的tag
 if(route.path !== item.path){
   return
 }
 const selectMenuData=selectMenu.value
 //如果删除的是最后一项
 if(index ===selectMenuData.length){
      //如果只有一个tag，则跳转到首页
      if(!selectMenuData.length){
          router.push('/')
      }else{
        router.push({
          path:selectMenuData[index-1].path
        })
      }
}else{
  //删除的中间位置
  router.push({
    path:selectMenuData[index].path
  })
}
}
//退出登录
const handleClick=(command)=>{
     if(command==='cancel'){
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('clinic')
      router.push('/login')
     }
}
</script>

<style lang="less" scoped>
.flex-box{
  display: flex;  
  align-items: center;
  height: 100%;
}
.header-container {
   display: flex;
   justify-content: space-between;
   align-items: center;
   height: 100%;
   background-color: #fff;
   padding-right: 25px;
   .header-left {
    height: 100%;
     .icon{
      width:45px;
      height:100%;
     }
    
     .icon:hover{
      background-color: #f5f5f5;
      cursor: pointer;
     }
     .tab{
      padding:0 10px;
      height:100%;
      .text{
        margin:0 5px;
      }
      .close{
        visibility: hidden;
      }
      &.selected{
         a{
          color:#409eff;
        }
         i{
          color:#409eff;
        }
        background-color: #f5f5f5;
      }
     }
     .tab:hover{
      background-color: #f5f5f5;
      .close{
       visibility: inherit;
       cursor: pointer;
       color:#000;
      }
     }
   }
   .header-right{
    .user-name{
      margin-left: 15px;
    }
   }
   a{
    height: 100%;
    color:#333;
    font-size: 15px;
   }
}
</style>