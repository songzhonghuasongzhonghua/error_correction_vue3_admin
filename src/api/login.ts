import { request } from '@/utils/service'

interface IUserRequestData {
  username: string
  password: string
}
interface registerLoginRequestData {
  username: string
  password: string
  phone: string
}
// interface ErrorCorrectionRequestData {
//   userId:number

//   language:string

//   type:string

//   file?:any

//   content?:string

// }
/** 登录，返回 token */
export function accountLogin(data: IUserRequestData) {
  return request({
    url: '/login',
    method: 'get',
    data
  })
}
export function registerLogin(data: registerLoginRequestData) {
  return request({
    url: '/register',
    method: 'get',
    data
  })
}
export function errorCorrectionApi(data:any) {
  return request({
    url: '/user/error_correction',
    method: 'post',
    data
  })
}
export function resetLogin(data: registerLoginRequestData) {
  return request({
    url: '/reset_pd',
    method: 'get',
    data
  })
}
/** 获取用户详情 */
export function userInfoRequest() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
export function getAdminUserList(data:any) {
  return request({
    url: '/admin/user_list',
    method: 'get',
    data
  })
}
export function deleteAction(data:any) {
  return request({
    url: '/admin/user_del',
    method: 'get',
    data
  })
}
export function addAction(data:any) {
  return request({
    url: '/admin/user',
    method: 'post',
    data
  })
}
export function editAction(data:any) {
  return request({
    url: '/user/info_edit',
    method: 'post',
    data
  })
}
export function deleteList(data:any) {
  return request({
    url: '/admin/text_del',
    method: 'get',
    data
  })
}
export function getTxtList(data:any) {
  return request({
    url: '/admin/text_list',
    method: 'get',
    data
  })
}
