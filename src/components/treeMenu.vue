<template>
        <!-- 没有子菜单的清况 没有children属性,直接渲染，有子菜单递归组件渲染-->
        <template v-for="(item,index) in res.menuData">
           <el-menu-item @click="goMenu(item,`${res.index}-${item.meta.id}`)" v-if="!item.children || item.children.length==0"
          :index="`${res.index}-${item.meta.id}`"
          :key="`${res.index}-${item.meta.id}`">
          <!-- //图标 -->
         <el-icon size="20">
          <component :is="item.meta.icon"></component>
         </el-icon>
         <span>{{ item.meta.name }}</span>
        </el-menu-item>
      <!-- 有子菜单 -->
       <el-sub-menu v-else :index="`${res.index}-${item.meta.id}`">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
           <span>{{ item.meta.name }}</span>
        </template>
        <tree-menu :index="`${res.index}-${item.meta.id}`" :menuData="item.children" />
       </el-sub-menu>
        </template>
       
</template>

<script setup>
import { useRouter } from 'vue-router';
import {useStore} from 'vuex'
const router=useRouter()
const store=useStore()
const res=defineProps(['menuData','index'])
// console.log(res)
//点击菜单跳转
const goMenu=(item,active)=>{
  store.commit('addMenu',item.meta)
  store.commit('updateMenuActive',active)
  router.push(item.meta.path)
}
</script>

<style lang="less" scoped>

</style>