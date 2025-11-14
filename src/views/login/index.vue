<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width:480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{ formType ? '返回登录' :'注册账号' }}</el-link>
      </div>
      <el-form ref="formRef" :model="loginForm" :rules="rules" style="max-width:600px" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="请输入用户名" :prefix-icon="UserFilled"></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" placeholder="请输入密码" type="password" :prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" placeholder="请输入验证码">
            <template #append>
              <span @click="sendCode">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :style="{width:'100%'}" type="primary" @click="submitForm">{{ formType ? '注册账号' :'登录' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import {ref,computed,toRaw} from 'vue'
import { getValidateCode ,registerUser,login, userPermission} from '../../api/apis'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
import { UserFilled,Lock } from '@element-plus/icons-vue'
const imgUrl=new URL('../../../public/login-head.png',import.meta.url).href
const formRef=ref(null)
const router=useRouter()
const store=useStore()
const routerList=computed(()=>store.state.menu.routerList)
//表单校验
const validatUserName=(rule,value,callback)=>{
  if(value ===''){
    callback(new Error('请输入账号'))
  }else{
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    phoneReg.test(value) ? callback() : callback(new Error('请输入正确的手机号'))
  }
}
const validatPass=(rule,value,callback)=>{
  if(value ===''){
    callback(new Error('请输入密码'))
  }else{
    const passReg=/^[a-zA-Z0-9_-]{4,16}$/
    passReg.test(value) ? callback() : callback(new Error('密码需要4-16位'))
  }
}
const rules=ref({
  userName:[{required:true,trigger:'blur',validator:validatUserName}],
  passWord:[{required:true,trigger:'blur',validator:validatPass}],
})
const countdown =ref({
  validText:'发送验证码',
  time:60
})
//登录注册切换  0登录1注册
const formType=ref(0)
const handleChange=()=>{
  formType.value=formType.value?0:1
}
const loginForm=ref({
  userName:'',
  passWord:'',
  validCode:''
})
//获取验证码
let flag=false
const sendCode=()=>{
  if(flag) return
  //判断手机号
  const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if(!loginForm.value.userName || !phoneReg.test(loginForm.value.userName)){
    return ElMessage({
      message:'请输入正确的手机号',
      type:'warning'
    })
  }
    const time=  setInterval(()=>{
      if(countdown.value.time<=0){
        countdown.value.validText='获取验证码'
        countdown.value.time=60
        clearInterval(time)
        flag=false
      }else{
        countdown.value.time--
        countdown.value.validText=`剩余${countdown.value.time}秒`
      }
     },1000)
     flag=true
     getValidateCode({tel:loginForm.value.userName}).then(({data})=>{
       console.log(data)
       if(data.code===10000){
         ElMessage.success('发送成功')
       }
     })
}
const submitForm=async(formEl)=>{
  if(!formEl) return
  await formRef.value.validate((valid)=>{
    if(valid){
      //如果是注册页面
      if(formType.value){
        registerUser(loginForm.value).then(({data})=>{
          if(data.code===10000){
            ElMessage.success('注册成功')
            formType.value=0//跳动登录页
          }
        })
      }else{
        //登录页
        login(loginForm.value).then(({data})=>{
          if(data.code===10000){
            ElMessage.success('登录成功')
            localStorage.setItem('token',data.data.token)
            localStorage.setItem('userInfo',JSON.stringify(data.data.userInfo))
      
            // window.location.href='/'
            userPermission().then(({data})=>{
              store.commit('dynamicMenu',data.data)
              // router.push('/')
              // console.log(routerList)
              //toRaw将响应式数据转为普通数据
              toRaw(routerList.value).forEach(item=>{
                router.addRoute('main',item)
              })
              router.push('/')
            })
           
          }
        })
      }
    }else{
      // console.log('校验失败')
    }
  })
}
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0
}

.login-container {
  height: 100%;

  .card-header {
    background-color: #899fe1;

    img {
      width: 430px;
    }
  }

  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
