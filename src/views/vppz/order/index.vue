<template>
  <PanelHead :route="route"></PanelHead>
  <div class=form>
    <el-form :inline="true" :model="searchForm">
      <el-form-item prop="out_trade_no">
        <el-input placeholder="订单号" v-model="searchForm.out_trade_no"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData.list">
    <el-table-column label="订单号" width="150" align="center" prop="out_trade_no"></el-table-column>
    <el-table-column label="就诊医院" align="center" prop="hospital_name"></el-table-column>
    <el-table-column label="陪诊服务" width="150" align="center" prop="service_name"></el-table-column>
    <el-table-column label="陪护师">
      <template #default="{row}">
        <el-image :src="row.companion.avatar" :style="{width:'40px' ,height:'40px'}"></el-image>
      </template>
    </el-table-column>
    <el-table-column label="陪护师手机号" width="150">
      <template #default="{row}">
        {{ row.companion.mobile }}
      </template>
    </el-table-column>
    <el-table-column label="总价" align="center" prop="price"></el-table-column>
    <el-table-column label="已付" align="center" prop="paidPrice"></el-table-column>
    <el-table-column label="下单时间" width="120" align="center">
      <template #default="{row}">
        {{ dayjs(row.order_start_time).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" align="center">
      <template #default="{row}">
        <el-tag :type="stateMap(row.trade_state)">{{ row.trade_state }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="接单状态" align="center" prop="service_state"></el-table-column>
    <el-table-column label="联系人手机号" width="150" align="center" prop="tel"></el-table-column>
    <el-table-column label="操作" fixed="right" width="120" align="center">
      <template #default="{row}">
        <el-popconfirm v-if="row.trade_state==='待服务'" confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled"
          icon-color="#626AEF" @confirm="confirmEvent(row.out_trade_no)">
          <template #reference>
            <el-button type="primary" link>服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" link disabled>暂无服务</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination v-model:current-page="pageData.pageNum" :page-size="pageData.pageSize" size="small"
      :background="background" layout="total, prev, pager, next" :total="tableData.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup>
import { orderList, updateOrder } from '../../../api/apis';
import { onMounted,reactive,ref } from 'vue';
import { useRoute } from 'vue-router';
import PanelHead from '../../../components/PanelHead.vue';
import { InfoFilled } from '@element-plus/icons-vue';
import dayjs from 'dayjs'

const route=useRoute()
const searchForm=ref({
  out_trade_no:''
})
const pageData=reactive({
    pageNum:1,
    pageSize:10
})
const tableData=reactive({
  list:[],
  total:0
})
onMounted(()=>{
  getList()
})
const onSubmit = () => {
  getList(searchForm.value)
}
const getList=(params={})=>{
  orderList({...pageData,...params}).then(({ data }) => {
    tableData.list = data.data.list
    tableData.total = data.data.total
  })
}
const stateMap=(key)=>{
  const obj={
    '已取消':'info',
    '待支付':'warning',
    '已完成':'success'
  }
}
const handleSizeChange = (val) => {
  pageData.value.pageSize = val
  getList()
}
const handleCurrentChange = (val) => {
  pageData.value.pageNum = val
  getList()
}
const confirmEvent=(id)=>{
  updateOrder({id}).then(({data})=>{
    if(data.code===10000){
      getList()
    }
  })
}

</script>

<style lang="less" scoped>
.form{
  display: flex;
  justify-content: flex-end;
  padding:10px 0 10px 10px;
  background-color: #fff;
}
</style>