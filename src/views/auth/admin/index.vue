<template>
  <PanelHead :route="route"></PanelHead>
  <el-table :data="tableData.list">
    <el-table-column width="80px" align="center" prop="id" label="id"></el-table-column>
    <el-table-column align="center" prop="name" label="昵称"></el-table-column>
    <el-table-column align="center" prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
    <el-table-column align="center" prop="ative" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' :'danger'">{{ scope.row.active ? '正常' : '禁用'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="flex-box" style="margin-left: 35px;">
          <el-icon style="margin-right: 5px;">
            <Clock />
          </el-icon>
          <span>{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize" size="small"
      :background="background" layout="total, prev, pager, next" :total="tableData.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
  <el-dialog 
  v-model="dialogVisible" 
  :before-close="beforeClose" 
  title="编辑权限"
  width="500">
  <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="100px">
    <el-form-item prop="mobile" label="手机号">
      <el-input placeholder="请输入手机号" v-model="form.mobile" disabled></el-input>
    </el-form-item>
    <el-form-item prop="name" label="昵称">
      <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
    </el-form-item>
    <el-form-item prop="permissions_id" label="菜单权限">
      <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width:240px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </el-form-item>
  </el-form>
   <template #footer>
      <el-button type="primary" @click="confirm(formRef)">确认</el-button>
   </template>
  </el-dialog>
</template>

<script setup>
import { authAdmin,menuSelectList,updateUser } from '../../../api/apis';
import {ref,onMounted} from 'vue';
import dayjs from 'dayjs';
import PanelHead from '../../../components/panelHead.vue';
import { useRouter ,useRoute} from 'vue-router';
const route=useRoute()
const router=useRouter()
const paginationData=ref({
  pageNum:1,
  pageSize:10
})
//列表数据
const tableData = ref({
  list: [],
  total: 0
})
const formRef=ref(null)
//弹窗
const dialogVisible=ref(false)
//弹窗中的Form
const form =ref({
  mobile:'',
  name:'',
  permissions_id:''
})
const options=ref([])
const rules={
  name:[
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  permissions_id:[
    { required: true, message: '请选择菜单权限', trigger: 'change' },
  ]
}
onMounted(()=>{
 getList()
  menuSelectList().then(({data})=>{
    // console.log(data)
    options.value=data.data
  })
})
//根据权限id获取权限名称
const permissionName=(id)=>{
  //当前的id和传入的id比较
   const data=options.value.find(item=>item.id===id)
    return data ?data.name : '超级管理员'
}
//获取列表
const getList=()=>{
  authAdmin(paginationData.value).then(res => {
    console.log(res)
    const { list, total } = res.data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    });
    tableData.value.list = list
    tableData.value.total = total
  })
}
const open=(rowData)=>{
   dialogVisible.value=true
   //编辑回显，因为这里不涉及到添加编辑两种情况，生成form不是异步的，不用nextTick
   Object.assign(form.value,{name:rowData.name,mobile:rowData.mobile,permissions_id:rowData.permissions_id})
}
//表单提交
const confirm=async(formEl)=>{
   if(!formEl) return
   await formEl.validate((valid,fields)=>{
    if(valid){
       const {name,permissions_id} =form.value
       updateUser({name,permissions_id}).then(({data})=>{
           if(data.code===10000){
            dialogVisible.value=false
            getList()
           }
       })
    }else{
      console.log('error submit!',fields)
    }
   })
}
//关闭弹窗
const beforeClose=()=>{
  dialogVisible.value=false
}
//分页器
const handleSizeChange = (val) => {
  paginationData.value.pageSize = val
  getList()
}
const handleCurrentChange = (val) => {
  paginationData.value.pageNum = val
  getList()
}
</script>

<style lang="less" scoped>
.flex-box{
  display: flex;
  align-items: center;
}
</style>