import request from "../utils/request";
export const getValidateCode=(data)=>request.post('/get/code',data)
//注册用户
export const registerUser=(data)=>request.post('/user/authentication',data)
//登录
export const login=(data)=>request.post('/login',data)
//权限管理列表、
export const authAdmin=(params)=>request.get('/auth/admin',{params})
//菜单权限数据
export const userGetMenu=()=>request.get('/user/getmenu')
//权限修改
export const userSetMenu=(data)=>request.post('/user/setmenu',data)
//获取权限列表
export const getmenuList=(params)=>request.get('/menu/list',{params})
//权限下拉列表
export const menuSelectList=()=>request.get('/menu/selectlist')
//用户信息修改
export const updateUser=(data)=>request.post('/update/user',data)
//用户菜单权限
export const userPermission=()=>request.get('/menu/permissions')
//陪护师头像
export const getAvatarList=()=>request.get('/photo/list')
//陪护师创建
export const createCompanion=(data)=>request.post('/companion',data)
//陪护列表
export const companionList=(params)=>request.get('/companion/list',{params})
//陪护师删除
export const deleteCompanion=(data)=>request.post('/delete/companion',data)
//订单列表
export const orderList=(params)=>request.get('/admin/order',{params})
//服务状态完成
export const updateOrder=(data)=>request.post('/update/order',data)