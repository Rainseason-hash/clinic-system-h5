<template>
  <PanelHead :route="route"></PanelHead>
  <div class="btns">
    <el-button :icon="Plus" @click="open()" type="primary">添加陪护师</el-button>

    <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" title="你确定删除这条吗" width="250"
      @confirm="confirmEvent">
      <template #reference>
        <el-button :icon="Delete" type="danger">删除</el-button>
      </template>
    </el-popconfirm>

  </div>
  <el-table :data="tableData.list" style="width:100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column width="100px" align="center" label="id" prop="id"></el-table-column>
    <el-table-column label="昵称" align="center" prop="name"></el-table-column>
    <el-table-column label="头像" align="center">
      <template #default="scope">
        <el-image :src="scope.row.avatar" style="width:50px;height:50px"></el-image>
      </template>
    </el-table-column>
    <el-table-column label="性别" align="center" prop="sex">
      <template #default="scope">
        {{ scope.row.sex==1?'男':'女' }}
      </template>
    </el-table-column>
    <el-table-column label="手机号" align="center" prop="mobile"></el-table-column>
    <el-table-column label="状态" align="center" prop="active">
      <template #default="{row}">
        <el-tag :type=" row.active ? 'success' :'danger' ">{{ row.active ? '生效' : '失效'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" prop="create_time">
      <template #default="{row}">
        <div class="flex-box">
          <el-icon>
            <Clock />
          </el-icon>
          <span style="margin-left:10px">{{ row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{row}">
        <el-button type="primary" @click="open(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination v-model:current-page="Pagelist.pageNum" :page-size="Pagelist.pageSize" size="small"
      :background="background" layout="total, prev, pager, next" :total="tableData.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
  <el-dialog v-model="dialogVision" :before-close="beforeClose" :title="form.id?'编辑陪护师':'添加陪护师'" width="500">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" label-position="left">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="昵称">
        <el-input palceholder="请输入昵称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="avatar" v-model="form.avatar" label="头像">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImgVision=true">点击上传</el-button>
        <el-image v-else :src="form.avatar" style="width:100px;height:100px"></el-image>
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-select v-model="form.sex">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input-number v-model="form.age" :min="18" :max="50"></el-input-number>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="active" label="是否生效">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogImgVision" :before-close="close" width="680" title="选择头像">
    <div class="image-list">
      <div v-for="(item,index) in photoList" :key="item.name" class="img-box" @click="selected=index">
        <div class="select" v-if="selected === index">
          <el-icon color="#fff">
            <Check />
          </el-icon>
        </div>
        <el-image style="width:148px;height:148px" :src="item.url"></el-image>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVision = false">取消</el-button>
        <el-button type="primary" @click="confirmImg">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { companionList, createCompanion, deleteCompanion, getAvatarList } from '../../../api/apis'
import { Plus, InfoFilled ,Delete} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref ,onMounted, nextTick} from 'vue'
import { useRoute } from 'vue-router'
const route=useRoute()
const dialogVision = ref(false)
const dialogImgVision = ref(false)
const formRef = ref(null)
const photoList= ref([])
//选中图片的索引
const selected = ref([])
const selectTableData=ref([])
const Pagelist=ref({
  pageNum:1,
  pageSize:10
})
const tableData=ref({
  list:[],
  total:0
})
const form = ref({
  id: '',
  mobile: '',
  name: '',
  age: 28,
  active: 1,
  sex: '',
  avatar: ''
})
const rules = ref({
  name:[{required:true, message:'请输入昵称',trigger:'blur'}],
  avatar:[{required:true, message:'请选择头像'}],
  sex:[{required:true, message:'请选择性别',trigger:'change'}],
  mobile:[{required:true, message:'请输入手机号',trigger:'blur'}],
})
onMounted(()=>{
  getAvatarList().then(({data})=>{
    // console.log(res)
    photoList.value = data.data
  })
  getList()
})
//陪护列表
const getList=async()=>{
     const res=await companionList(Pagelist.value)
    //  console.log(res)
    const {data:{list,total}}=res.data
    tableData.value.list=list
    tableData.value.total=total
}
//表单前的选中框
const handleSelectionChange=(val)=>{
  selectTableData.value = val.map(item=>({id:item.id}))
}
const confirmEvent=()=>{
  if(!selectTableData.value.length){
    return ElMessage.error('请至少选择一条数据删除')
  }else{
    deleteCompanion({id:selectTableData.value}).then(({data})=>{
      if(data.code===10000){
        ElMessage.success('删除成功')
        getList()
      }
    })
  }
}
const close = () => {
  dialogImgVision.value = false
  selected.value = -1
}

//这里有添加编辑判断
const open=(rowData={})=>{
  dialogVision.value = true
  nextTick(()=>{
    //如果是编辑
    if(rowData){
     Object.assign(form.value,rowData)
    }
  })
}
const beforeClose = () => {
  dialogVision.value = false
  formRef.value.resetFields()
}
const cancel=()=>{
  beforeClose()
}
const confirm = async(formRef) => {
  if(!formRef) return
      await formRef.validate((valid) => {
        if(valid){
          createCompanion(form.value).then(({data})=>{
            if(data.code===10000){
                 ElMessage.success('成功')
                 beforeClose()
                 getList()
            }else{
              ElMessage.error(data.message)
            }
          })
        }
      })
}
const confirmImg=()=>{
  form.value.avatar=photoList.value[selected.value].url
  dialogImgVision.value=false
}
const handleSizeChange=(val)=>{
  Pagelist.value.pageSize = val
  getList()
}
const handleCurrentChange=(val)=>{
  Pagelist.value.pageNum = val
  getList()
}
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}

.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .img-box {
    position: relative;

    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>