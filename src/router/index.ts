import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const Layout = () => import('@/layout/index.vue')

/** 常驻路由 */

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  }
]

/**
 * 动态路由
 * 用来放置有权限的路由
 * 必须带有 name 属性
 */
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/chineseErrorCorrection',
    children: [
      {
        path: 'chineseErrorCorrection',
        component: () => import('@/views/user/chineseErrorCorrection.vue'),
        name: 'ChineseErrorCorrection',
        meta: {
          title: '中文纠正',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/englishErrorCorrection',
    component: Layout,
    redirect: '/englishErrorCorrection',
    children: [
      {
        path: '',
        component: () => import('@/views/user/englishErrorCorrection.vue'),
        name: 'EnglishErrorCorrection',
        meta: {
          title: '英文纠正',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/personalInformation',
    component: Layout,
    redirect: '/personalInformation',
    children: [
      {
        path: '',
        component: () => import('@/views/user/personalInformation.vue'),
        name: 'PersonalInformation',
        meta: {
          title: '个人信息',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*', // 必须将 'ErrorPage' 路由放在最后, Must put the 'ErrorPage' route at the end
    component: Layout,
    redirect: '/404',
    name: 'ErrorPage',
    meta: {
      title: '错误页面',
      icon: '404',
      hidden: true
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        name: '401',
        meta: {
          title: '401'
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: '404',
        meta: {
          title: '404'
        }
      }
    ]
  }
]
export const asyncRoutes2: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/userInformationManagement',
    children: [
      {
        path: 'userInformationManagement',
        component: () => import('@/views/administrators/userInformationManagement.vue'),
        name: 'UserInformationManagement',
        meta: {
          title: '用户信息管理',
          icon: 'bug'
        }
      }
    ]
  },
  {
    path: '/textInformationManagement',
    component: Layout,
    redirect: '/textInformationManagement',
    children: [
      {
        path: '',
        component: () => import('@/views/administrators/textInformationManagement.vue'),
        name: 'TextInformationManagement',
        meta: {
          title: '文本信息管理',
          icon: 'bug'
        }
      }
    ]
  },
  {
    path: '/administratorInformationManagement',
    component: Layout,
    redirect: '/administratorInformationManagement',
    children: [
      {
        path: '',
        component: () => import('@/views/administrators/administratorInformationManagement.vue'),
        name: 'AdministratorInformationManagement',
        meta: {
          title: '管理员信息管理',
          icon: 'bug'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*', // 必须将 'ErrorPage' 路由放在最后, Must put the 'ErrorPage' route at the end
    component: Layout,
    redirect: '/404',
    name: 'ErrorPage',
    meta: {
      title: '错误页面',
      icon: '404',
      hidden: true
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        name: '401',
        meta: {
          title: '401'
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: '404',
        meta: {
          title: '404'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      console.log(name, meta)

      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器，不过体验不是很好
    window.location.reload()
  }
}

export default router
