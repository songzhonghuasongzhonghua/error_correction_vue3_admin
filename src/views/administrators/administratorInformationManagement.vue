<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { addAction, deleteAction, editAction, getAdminUserList } from '@/api/login'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate, formatDateTime } from '../../utils/index'

const formInline = reactive({
  id: '',
  type: 1
})
const form = reactive({
  id: '',
  username: '',
  password: '',
  phone: '',
  birth: '',
  type: 1
})
const tableData = ref([])
const dialogVisible = ref(false)
const dialogType = ref()
const formRef = ref()
const background = ref(false)
const total = ref(1)
const page = ref(1)
const pageSize = ref(1)
const small = ref(false)
const disabled = ref(false)
onMounted(() => {
  getList()
})
const getList = async(ids?:any) => {
  const parmas = {
    page: page.value,
    pageSize: pageSize.value,
    type: formInline.type,
    id: ids ?? formInline.id
  }
  const res = await getAdminUserList(parmas)
  console.log(res.data.info.records, 'res')
  tableData.value = res.data.info.records
  total.value = res.data.info.total
}
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  page.value = val
  getList()
}
const onSubmit = () => {
  getList(formInline.id)
}

const addFn = () => {
  dialogType.value = 'add'
  form.birth = ''
  form.id = ''
  form.password = ''
  form.phone = ''
  form.username = ''
  dialogVisible.value = true
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm(`${dialogType.value === 'edit' ? '确定退出编辑?' : '确定退出新增?'}`)
    .then(() => {
      form.birth = ''
      form.password = ''
      form.phone = ''
      form.username = ''
      done()
    })
    .catch(() => {
      // catch error
    })
}
const formRules = reactive<any>({
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入用户手机号', trigger: 'blur' }
  ],

  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  birth: [
    { required: true, message: '请选择生日日期', trigger: 'blur' }
  ]
})
const editFn = (scope:any) => {
  console.log(scope, 'scopescopescopescope')
  form.birth = formatDate(scope.birth)
  form.id = scope.id
  form.password = scope.password
  form.phone = scope.phone
  form.username = scope.username
  dialogType.value = 'edit'
  dialogVisible.value = true
}
const elDialogOn = async() => {
  formRef.value.validate(async(valid: boolean) => {
    if (valid) {
      console.log(formatDateTime(form.birth), 'wwwwwwwww')
      form.birth = formatDateTime(form.birth)
      console.log(form, '22')
      const parmas = {
        phone: form.phone,
        password: form.password,
        username: form.username,
        birth: form.birth,
        type: form.type,
        id: form.id

      }
      const res:any = await (dialogType.value === 'add' ? addAction(parmas) : editAction(parmas))
      console.log(res, '2222222')

      if (res.code === 0) {
        await ElMessage({
          message: `${dialogType.value === 'add' ? '添加成功' : '编辑成功'}`,
          type: 'success',
          duration: 2000
        })
        page.value = 1
        getList()
        dialogVisible.value = false
      } else {
        await ElMessage({
          message: `${dialogType.value === 'add' ? '添加失败' : '编辑失败'}`,
          type: 'success',
          duration: 2000
        })
        getList()
        dialogVisible.value = false
      }
    } else {
      return false
    }
  })
}
const confirmEvent = async(scope:any) => {
  const parmas = {
    id: scope.row.id
  }
  const res:any = await deleteAction(parmas)
  if (res.code === 0) {
    await ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000
    })
    getList()
  }
}
</script>

<template>
  <div class="administratorInformationManagement">
    <div class="main">
      <div class="buttons">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="ID:">
            <el-input v-model="formInline.id" placeholder="请输入用户ID" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">
              搜索
            </el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" @click="addFn">
          新增
        </el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" fit>
        <!-- <el-table-column fixed prop="date" label="Date" /> -->
        <el-table-column prop="id" label="用户ID" />
        <el-table-column prop="username" label="用户名称" />
        <el-table-column prop="phone" label="用户手机号" />
        <!-- <el-table-column prop="creatTime" label="创建时间" /> -->
        <!-- <el-table-column prop="birthday" label="生日日期" /> -->
        <el-table-column fixed="right" label="操作栏">
          <template #default="scope">
            <el-popconfirm
              confirm-button-text="确定"
              confirm-button-type="danger"
              cancel-button-text="取消"
              title="确定删除此项?"
              @confirm="confirmEvent(scope)"
            >
              <template #reference>
                <el-button type="danger" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
            <el-button link type="primary" size="small" @click="editFn(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginations">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="elDialog">
        <el-dialog
          v-model="dialogVisible"
          :title="`${dialogType==='edit'?'编辑':'新增'}`"
          width="500px"
          :close-on-click-modal="false"
          :destroy-on-close="true"
          :before-close="handleClose"
        >
          <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto" style="max-width: 300px">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" />
            </el-form-item>
            <el-form-item label="用户手机号" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>

            <el-form-item label="生日日期" prop="birth">
              <!-- <el-input v-model="form.birth" /> -->
              <el-date-picker
                v-model="form.birth"
                type="date"
                placeholder="请选择日期"
                size="default"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="elDialogOn">
                提交
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
.main{
  background-color: #fff;
  padding:20px;
  .buttons{
    display: flex;
    justify-content: space-between;
  }
  .paginations{
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
}

</style>
