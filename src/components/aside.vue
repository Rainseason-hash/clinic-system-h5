<template>
    <el-menu
    :style="{width:isCollapse?'80px':'230px'}"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
       
        class="aside-container"
        :collapse="isCollapse"
        :default-active="menuActive"
        @open="handleOpen"
        @close="handleClose"
      >
      <p class="logo">{{ isCollapse?'DIDI':'DIDI陪诊' }}</p>
      <tree-menu :index="1" :menuData="menuData"></tree-menu>  
      </el-menu>
</template>

<script setup>
import treeMenu from './treeMenu.vue'
import { useRouter } from 'vue-router'
import { reactive,computed} from 'vue'
import { useStore } from 'vuex'
const router=useRouter()
const store=useStore()
// const menuData=reactive(router.options.routes[0].children)//拿到路由数据传给子组件
const menuData=computed(()=>store.state.menu.routerList)
const isCollapse=computed(()=>store.state.menu.isCollapse)
const menuActive=computed(()=>store.state.menu.menuActive)
// console.log(router)
const handleOpen=()=>{
    console.log('open')
}
const handleClose=()=>{
    console.log('close')
}
</script>

<style lang="less" scoped>
.aside-container{
  height:100%;
   .logo{
     font-size: 20px;
     color: #fff;
     text-align: center;
     line-height: 50px;
     height:50px;
   }
}
</style>