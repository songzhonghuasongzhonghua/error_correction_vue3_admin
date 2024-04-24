/** cookies 封装 */

import Keys from '@/constant/key'
import Cookies from 'js-cookie'

export const getSidebarStatus = () => Cookies.get(Keys.sidebarStatus)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(Keys.sidebarStatus, sidebarStatus)

export const getToken = () => localStorage.getItem('token')
export const setToken = (token: string) => localStorage.setItem('token', token)
export const removeToken = () => localStorage.removeItem('token')

export const getActiveThemeName = () => Cookies.get(Keys.activeThemeName)
export const setActiveThemeName = (themeName: string) => { Cookies.set(Keys.activeThemeName, themeName) }
