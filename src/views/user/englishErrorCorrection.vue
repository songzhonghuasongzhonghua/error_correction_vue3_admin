<script setup lang='ts'>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, UploadRequestOptions } from 'element-plus'
import { errorCorrectionApi } from '@/api/login'

const drawer = ref(false)
const drawer2 = ref(false)
const fileList = ref([])
const fileListitem = ref()
const textarea = ref('')
const resuletTextarea = ref('')

const buttonFn = (value:any) => {
  if (value === 1) drawer.value = true
  if (value === 2) drawer2.value = true
}
const cancelClick = (value:any) => {
  if (value === 1) {
    resuletTextarea.value = ''
    textarea.value = ''
    drawer.value = false
  }
  if (value === 2) {
    fileList.value = []
    fileListitem.value = ''
    resuletTextarea.value = ''
    drawer2.value = false
  }
}
const drawer2Close = () => {
  console.log('111')
  fileList.value = []
  fileListitem.value = ''
  resuletTextarea.value = ''
  drawer2.value = false
}
const drawerClose = () => {
  drawer.value = false
  resuletTextarea.value = ''
  textarea.value = ''
  console.log('222')
}
const confirmClick = async(value:any) => {
  if (value === 2 && !fileListitem.value) {
    return ElMessage({
      message: '请上传文件',
      type: 'error',
      duration: 2000
    })
  }
  const fd = new FormData()
  const userIdValue:any = localStorage.getItem('userId')
  const languageValue:any = 1
  const typeValue:any = value === 1 ? 0 : 1
  fd.append('userId', userIdValue)
  fd.append('language', languageValue)
  fd.append('type', typeValue)
  value === 1 && fd.append('content', textarea.value)
  value === 2 && fd.append('file', fileListitem.value)
  const res = await errorCorrectionApi(fd)
  console.log(res, '2222222222')
  resuletTextarea.value = res.data.result
}
const onRemove = () => {
  console.log(111111111111)
  resuletTextarea.value = ''
}
// 判断上传之前文件的格式
const beforeUpload = () => {
  if (fileList.value.length > 1) {
    ElMessage({
      message: '只能上传一个文件，请先删除下方上传的文件',
      type: 'error',
      duration: 2000
    })
    return false
  }
}

const uploadExcel = (options: UploadRequestOptions):any => {
  fileListitem.value = options.file
}
const downloadDoc = () => {
  const strArry = fileListitem.value.name.split('.')
  strArry[0] = strArry[0] + '纠错'
  const str = strArry[0] + '.' + strArry[1]
  console.log(resuletTextarea.value, 'resuletTextarea.valueresuletTextarea.valueresuletTextarea.value')

  // 创建一个Blob实例，内容类型为doc
  const blob = new Blob([`${resuletTextarea.value}`], { type: 'application/msword' })
  // 创建一个临时的URL指向Blob对象
  const url = URL.createObjectURL(blob)
  // 创建一个a标签用于触发下载
  const link = document.createElement('a')
  link.href = url
  // link.download = 'example.doc' // 设置下载文件的名称
  link.download = `${str}` // 设置下载文件的名称
  // 添加a标签到文档并触发点击
  document.body.appendChild(link)
  link.click()
  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="englishErrorCorrection">
    <h1>英文文本纠错</h1>

    <div class="main">
      <el-button type="primary" :before-close="drawerClose" size="large" style="margin-left: 35px" @click="buttonFn(1)">
        文本输入
      </el-button>
      <el-button type="primary" size="large" style="margin-left: 35px" @click="buttonFn(2)">
        上传文件
      </el-button>
      <el-drawer v-model="drawer" direction="btt" title=" 文本输入">
        <template #default>
          <el-input
            v-model="textarea"
            maxlength="300"
            style="width: 100%"
            placeholder="Please input"
            show-word-limit
            type="textarea"
          />
          <el-input
            v-model="resuletTextarea"
            maxlength="300"
            style="width: 100%;margin-top: 20px;"
            disabled
            show-word-limit
            type="textarea"
          />
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick(1)">
              返回
            </el-button>
            <el-button type="primary" @click="confirmClick(1)">
              纠正
            </el-button>
          </div>
        </template>
      </el-drawer>
      <el-drawer v-model="drawer2" :before-close="drawer2Close" direction="btt" title="上传文件">
        <template #default>
          <el-upload
            class="upload-demo"
            drag
            :http-request="uploadExcel"
            :file-list="fileList"
            action="#"
            accept=".doc,.docx"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
          >
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                doc files with a size less than 500kb
              </div>
            </template>
          </el-upload>
          <el-input
            v-if="resuletTextarea"
            v-model="resuletTextarea"
            maxlength="300"
            style="width: 100%;margin-top: 20px;"
            disabled
            show-word-limit
            type="textarea"
          />
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button v-if="resuletTextarea" @click="downloadDoc">
              下载
            </el-button>
            <el-button @click="cancelClick(2)">
              返回
            </el-button>
            <el-button type="primary" @click="confirmClick(2)">
              纠正
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<style lang='scss' scoped>
 :deep() {
  .el-drawer{
    height: 70% !important;
  }
  .el-button{
  width: 300px;
    height: 100px;
    span{
      font-size: 50px;
    }}
  // .el-textarea{
  //   width: 100% !important;

    .el-textarea__inner{
      min-height: 300px !important;
    }
    .el-upload{
      width: 100%;
    }
    .el-upload-dragger{
      width: 100%;
    }
  // }
}
.englishErrorCorrection{
  justify-content: flex-start;
    flex-direction: column;
    align-items: center;
  height: 100vh;
  background-color: #fff;
  display: flex;
  h1{
    font-size: 80px;
  }
.main{
  margin-top: 10%;
}
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
