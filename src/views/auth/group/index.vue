<template>
  <PanelHead :route="route"></PanelHead>
  <div class="btns"> 
    <el-button :icon="Plus" type="primary" @click="open()">添加权限</el-button>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column prop="permissionName" label="菜单权限"></el-table-column>
    <el-table-column label="操作">
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
  <el-dialog :before-close="beforeClose" v-model="dialogVisible" :title="form.id ? '编辑权限' : '添加权限'" width="500">
    <el-form ref="FormRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree ref="treeRef" :data="permissionData" style="max-width:600px" node-key="id" show-checkbox
          :default-checked-keys="defaultKeys" :default-expand-all="[2]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(FormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {Plus} from '@element-plus/icons-vue'
import { ref, onMounted, nextTick } from 'vue'
import { userGetMenu, userSetMenu, getmenuList } from '../../../api/apis'
import PanelHead from '../../../components/panelHead.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const FormRef = ref()
const treeRef = ref()
//树形菜单权限数据
const permissionData = ref([])
//弹窗的显示隐藏
const dialogVisible = ref(false)
//列表数据
const tableData = ref({
  list: [],
  total: 0
})
//Form表单数据
const form = ref({
  name: '',
  permissions: '',
  id: ''
})
const rules = ref({
  name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }],
})
//默认选中权限
const defaultKeys = [4, 5]
const paginationData = ref({
  pageNum: 1,
  pageSize: 10
})
onMounted(() => {
  userGetMenu().then(({ data }) => {
    // console.log(res)
    permissionData.value = data.data
  })
  getList()
})
//请求列表数据
const getList = () => {
  getmenuList(paginationData.value).then(({ data }) => {
    const { list, total } = data.data
    tableData.value.list = list
    tableData.value.total = total
  })
}
//打开弹窗  添加or编辑
const open = (rowData = {}) => {
  dialogVisible.value = true
  FormRef.value.resetFields()//重置
  treeRef.value.setCheckedKeys(defaultKeys)//重置
  
  //弹窗打开form生成是异步的
  nextTick(() => {
    if (rowData) {
      Object.assign(form.value, { id: rowData.id, name: rowData.name })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })

}
//弹窗关闭回调
const beforeClose = () => {
  dialogVisible.value = false
  
}
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!')
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({ name: form.value.name, permissions, id: form.value.id }).then(res => {
        console.log(res)
        beforeClose()
        getList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
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
.btns{
  padding:10px 0 10px 10px;
  background-color: #fff;
}</style>