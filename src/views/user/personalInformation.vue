<template>
  <div class="personalInformation">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <span>个人信息预览</span>
        </div>
      </template>
      <el-form ref="formRef" :rules="formRules" :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item prop="phoneNumber" label="手机号">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" disabled />
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="form.birthday" disabled />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-input v-model="form.registrationTime" disabled />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="margin-left: 35%;" @click="onSubmit">
            修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { formatDate, formatDateTime } from '../../utils/index'
import { userInfoRequest, editAction } from '@/api/login'
import { ElMessage } from 'element-plus'

// do not use same name with ref
const form = reactive({
  phoneNumber: '',
  password: '',
  name: '',
  birthday: '',
  id: '',
  registrationTime: '',
  type: 0
})
const formRef = ref()
const onSubmit = () => {
  formRef.value.validate(async(valid: boolean) => {
    if (valid) {
      form.birthday = formatDateTime(form.birthday)
      console.log(form, '22')
      const parmas = {
        phone: form.phoneNumber,
        password: form.password,
        username: form.name,
        birth: form.birthday,
        type: form.type,
        id: form.id

      }
      const res:any = await editAction(parmas)
      console.log(res, '2222222')

      if (res.code === 0) {
        await ElMessage({
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        getList()
      } else {
        await ElMessage({
          message: '修改失败',
          type: 'success',
          duration: 2000
        })
        getList()
      }
    } else {
      return false
    }
  })
  console.log('submit!', form)
}
onMounted(async() => {
  getList()
})
const getList = async() => {
  const res = await userInfoRequest()
  console.log(formatDate(res.data.info.birth), '2222222')
  form.birthday = res.data.info.birth ? formatDate(res.data.info.birth) : ''
  form.name = res.data.info.username
  form.password = res.data.info.password
  form.phoneNumber = res.data.info.phone
  form.id = res.data.info.id
  form.registrationTime = res.data.info.createAt ? formatDate(res.data.info.createAt) : ''
}
const formRules = reactive<any>({
  phoneNumber: [
    { required: true, message: '请输入用户手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' }
  ]

})
</script>

<style lang='scss' scoped>
.el-card{
  width: 800px;
  height: 600px;
}
.el-form-item{
  margin-bottom: 40px;
}
.personalInformation{
  display: flex;
  justify-content: center;
}
</style>
