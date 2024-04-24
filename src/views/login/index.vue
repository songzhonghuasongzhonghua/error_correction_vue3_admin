<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="container-left">
      <p>Hi ,您好！</p>
      <p>欢迎进入文本纠错系统</p>
      <p>Welcome to the text error correction system！</p>
    </div>
    <div class="login-card">
      <div class="title">
        <!-- <img src="@/assets/layout/logo-text-2.png"> -->
        {{ checkLoginType==='0'?'Please log in':checkLoginType==='1'?'Please register':' Please reset' }}
      </div>

      <div v-if="checkLoginType==='0'" class="content">
        <el-form
          ref="loginFormDom"
          :model="loginForm"
          :rules="loginRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              show-password
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="loginForm.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="4"
              size="large"
            />
            <span class="show-code">
              <!-- <img :src="codeUrl" @click="createCode"> -->
              <img :src="codeUrl" @click="createCode">
            </span>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6" :offset="18"
            >
              <el-link type="primary" @click="checkLoginTypeFN('2')">
                忘记密码？
              </el-link>
            </el-col>
          </el-row>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">
            登录
          </el-button>
        </el-form>
        <el-button
          type="primary" size="large" @click.prevent="checkLoginTypeFN('1')">
          注册
        </el-button>
      </div>
      <div v-if="checkLoginType==='1'" class="content">
        <el-form
          ref="registerFormDom"
          :model="registerForm"
          :rules="registerRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="registerUsername">
            <el-input
              v-model="registerForm.registerUsername"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="registerPhoneNumber">
            <el-input
              v-model="registerForm.registerPhoneNumber"
              placeholder="手机号"
              type="text"
              tabindex="2"
              :prefix-icon="Iphone"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="registerPassword">
            <el-input
              v-model="registerForm.registerPassword"
              placeholder="密码"
              show-password
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="registerConfirmPassword">
            <el-input
              v-model="registerForm.registerConfirmPassword"
              placeholder="确认密码"
              show-password
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>

          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">
            注册
          </el-button>
        </el-form>
        <el-button
          type="primary" size="large" @click.prevent="checkLoginTypeFN('0')">
          返回
        </el-button>
      </div>
      <div v-if="checkLoginType==='2'" class="content">
        <el-form
          ref="restFormDom"
          :model="resetForm"
          :rules="resetRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="resetUsername">
            <el-input
              v-model="resetForm.resetUsername"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="resetPhoneNumber">
            <el-input
              v-model="resetForm.resetPhoneNumber"
              placeholder="手机号"
              type="text"
              tabindex="2"
              :prefix-icon="Iphone"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="resetPassword">
            <el-input
              v-model="resetForm.resetPassword"
              placeholder="新密码"
              show-password
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="resetConfirmPassword">
            <el-input
              v-model="resetForm.resetConfirmPassword"
              placeholder="确认密码"
              show-password
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">
            重置
          </el-button>
        </el-form>
        <el-button
          :loading="loading" type="primary" size="large" @click.prevent="checkLoginTypeFN('0')">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { User, Lock, Key, Iphone } from '@element-plus/icons-vue'
import ThemeSwitch from '@/components/theme-switch/index.vue'
import { ElMessage } from 'element-plus'
import { registerLogin, resetLogin } from '@/api/login'
interface ILoginForm {
  /** admin 或 editor */
  username: string
/** 密码 */
  password: string
  /* 手机号 */
  phoneNumber:string
  /** 验证码 */
  code?: string
  /** 随机数 */
  codeToken: string
}
interface registerLoginForm {
  registerUsername: string
/** 密码 */
  registerPassword : string
  /* 手机号 */
  registerPhoneNumber:string
  registerConfirmPassword:string
}
interface resetLoginForm {
  resetUsername: string
/** 密码 */
resetPassword : string
  /* 手机号 */
  resetPhoneNumber:string
  resetConfirmPassword:string
}

const router = useRouter()

const loading = ref<boolean>(false)
const loginFormDom = ref<any>()
const registerFormDom = ref<any>()
const restFormDom = ref<any>()
const checkLoginType = ref<string>('0')
const codeUrl = ref<string>('https://bpic.588ku.com/element_origin_min_pic/01/37/32/26573c46f211bc8.jpg')
const loginForm = reactive<ILoginForm>({
  username: '',
  password: '',
  code: '5374',
  codeToken: '',
  phoneNumber: '13764602732'
})
const registerForm = reactive<registerLoginForm>({
  registerUsername: '',
  registerPassword: '',
  registerConfirmPassword: '',
  registerPhoneNumber: ''
})
const resetForm = reactive<resetLoginForm>({
  resetUsername: '',
  resetPassword: '',
  resetConfirmPassword: '',
  resetPhoneNumber: ''
})
const registeValidatePass = (rule: any, value: any, callback: any) => {
  if (value !== registerForm.registerPassword) { callback(new Error('两次密码不一致请重新输入')) } else if (value === '') { callback(new Error('请确认密码')) } else {
    callback()
  }
}
const resetValidatePass = (rule: any, value: any, callback: any) => {
  if (value !== resetForm.resetPassword) { callback(new Error('两次密码不一致请重新输入')) } else if (value === '') { callback(new Error('请确认密码')) } else {
    callback()
  }
}
const registeValidatePhoneNumber = (rule: any, value: any, callback: any) => {
  // if (!/^1[3-9]\d{9}$/.test(value)) {
  //   return callback(new Error('输入格式不正确'))
  //  }elseif(value === ''){return callback(new Error('请确认密码'))}else{
  // }
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('输入格式不正确'))
  } else {
    callback()
  }
  // if (value === '') {
  //   return callback(new Error('请确认密码'))
  // }
}
const loginRules = reactive<any>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})

const registerRules = reactive<any>({
  registerUsername: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  registerPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ],
  registerPhoneNumber: [
    { validator: registeValidatePhoneNumber, trigger: 'blur' }
  ],
  registerConfirmPassword: [{ validator: registeValidatePass, trigger: 'blur' }]
})
const resetRules = reactive<any>({
  resetUsername: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  resetPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ],
  resetPhoneNumber: [
    { validator: registeValidatePhoneNumber, trigger: 'blur' }
  ],
  resetConfirmPassword: [{ validator: resetValidatePass, trigger: 'blur' }]
})

const handleLogin = async() => {
  console.log(checkLoginType.value, 'checkLoginType.value ')

  if (checkLoginType.value === '0') {
    console.log(loginFormDom.value.validate, ' loginFormDom.value.validate loginFormDom.value.validate')

    loginFormDom.value.validate((valid: boolean) => {
      console.log(valid, 'validvalid')

      if (valid) {
        loading.value = true
        useUserStore().login({
          username: loginForm.username,
          password: loginForm.password
        }).then(() => {
          ElMessage({
            message: '登录成功',
            type: 'success',
            duration: 2000
          })
          router.push({ path: '/' }).catch((err) => {
            console.warn(err)
          })
        }).catch(() => {
          loading.value = false
          createCode()
        })
      } else {
        return false
      }
    })
  } else if (checkLoginType.value === '1') {
    console.log('zoole', restFormDom.value)

    registerFormDom.value.validate((valid: boolean) => {
      console.log(valid, 'validvalidvalid1111111')
      if (valid) {
        console.log('llllllll')

        loading.value = true
        registerLogin({
          username: registerForm.registerUsername || '',
          password: registerForm.registerPassword || '',
          phone: registerForm.registerPhoneNumber || ''
        }).then(() => {
          ElMessage({
            message: '注册成功',
            type: 'success',
            duration: 2000
          })
          checkLoginType.value = '0'
          loading.value = false
          // router.push({ path: '/login' }).catch((err) => {
          //   console.warn(err)
          // })
        }).catch(() => {
          loading.value = false
        })
      } else {
        console.log(222222)

        return false
      }
    })
  } else if (checkLoginType.value === '2') {
    restFormDom.value.validate((valid: boolean) => {
      console.log(valid, 'validvalidvalid1111111')
      if (valid) {
        console.log('llllllll')

        loading.value = true
        resetLogin({
          username: resetForm.resetUsername || '',
          password: resetForm.resetPassword || '',
          phone: resetForm.resetPhoneNumber || ''
        }).then((res) => {
          console.log(res, 'resres')

          ElMessage({
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
          checkLoginType.value = '0'
          loading.value = false
          // router.push({ path: '/login' }).catch((err) => {
          //   console.warn(err)
          // })
        }).catch(() => {
          loading.value = false
        })
      } else {
        console.log(222222)

        return false
      }
    })
  }
}
const checkLoginTypeFN = (value:string) => {
  console.log(checkLoginType.value)
  checkLoginType.value = value
}
/** 创建验证码 */
const createCode: () => void = () => {
  // 先清空验证码的输入
  loginForm.code = ''
  let codeToken = ''
  const codeLength = 12
  // 随机数
  const random: Array<number | string> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  for (let i = 0; i < codeLength; i++) {
    const index = Math.floor(Math.random() * 36)
    codeToken += random[index]
  }
  loginForm.codeToken = codeToken
  // 实际开发中，可替换成自己的地址，这里只是提供一个参考
  // codeUrl.value = `/api/v1/login/authcode?token=${codeToken}`
  codeUrl.value = 'https://bpic.588ku.com/element_origin_min_pic/01/37/32/26573c46f211bc8.jpg'
}
// 需要验证码的时候，需打开下方注释
// createCode()
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background: url('../../assets/login-bg.svg') no-repeat;
  width: 110vw;
    height: 100vh;
    background-position: right top;
    background-size: cover;
    .container-left{
      color: #fff;
      p{
        font-size: 60px;
      }
    }
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 50px;
      font-weight: 500;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      .show-code {
        position: absolute;
        right: 0px;
        top: 0px;
        cursor: pointer;
        user-select: none;
        img {
          width: 100px;
          height: 40px;
          border-radius: 4px;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
