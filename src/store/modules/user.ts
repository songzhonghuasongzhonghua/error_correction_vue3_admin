import store from '@/store'
import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from '@/utils/cookies'
import { resetRouter } from '@/router'
import { accountLogin } from '@/api/login'
interface userInfoItem {
  birth?: string
  id?: number
  password?: string
  phone?: string
  type?:number
  username?: string
  createAt?: string
}
interface IUserState {
  token: string
  roles: string[]
  userInfos:userInfoItem
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => {
    return {
      token: getToken() || '',
      roles: [],
      userInfos: {}
    }
  },
  actions: {
    /** 设置角色数组 */
    setRoles(roles: string[]) {
      this.roles = roles
    },
    /** 登录 */
    login(userInfo: { username: string, password: string }) {
      return new Promise((resolve, reject) => {
        accountLogin({
          username: userInfo.username.trim(),
          password: userInfo.password
        })
          .then((res: any) => {
            console.log(res.data.info, '登录接口数据')

            localStorage.setItem('roles', res.data.info.user.type === 0 ? 'user' : 'admin')
            localStorage.setItem('userId', res.data.info.user.id)
            setToken(res.data.info.token)
            this.token = res.data.info.token
            this.userInfos = res.data.info.user
            resolve(true)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /** 获取用户详情 */
    getInfo() {
      this.roles = localStorage.getItem('roles') === 'user' ? ['user'] : ['admin']
    },
    // /** 切换角色 */
    // async changeRoles(role: string) {
    //   const token = role + '-token'
    //   this.token = token
    //   setToken(token)
    //   await this.getInfo()
    //   const permissionStore = usePermissionStore()
    //   permissionStore.setRoutes(this.roles)
    //   resetRouter()
    //   permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
    //     router.addRoute(item)
    //   })
    // },
    /** 登出 */
    logout() {
      removeToken()
      localStorage.removeItem('roles')
      this.token = ''
      this.roles = []
      resetRouter()
      window.location.reload()
    },
    /** 重置 token */
    resetToken() {
      removeToken()
      this.token = ''
      this.roles = []
    }
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
