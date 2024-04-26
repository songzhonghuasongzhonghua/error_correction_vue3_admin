<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { deleteList, getTxtList } from '@/api/login'
import { ElMessage } from 'element-plus'

const tableData = ref([])

const formInline = reactive({
  id: '',
  listId: '',
  username: ''
})
const background = ref(false)
const total = ref(1)
const page = ref(1)
const pageSize = ref(10)
const small = ref(false)
const disabled = ref(false)
const getList = async(ids?:any, name?:any, listId?:any) => {
  const parmas = {
    page: page.value,
    pageSize: pageSize.value,
    userId: ids ?? formInline.id,
    listId: listId ?? formInline.listId,
    username: name ?? formInline.username

  }
  const res:any = await getTxtList(parmas)
  console.log(res.data.info.records, 'res')
  tableData.value = res.data.info.records
  total.value = res.data.info.total
}
onMounted(() => {
  getList()
})
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  page.value = val
  getList()
}

const onSubmit = () => {
  getList(formInline.id, formInline.username, formInline.listId)
}
const confirmEvent = async(scope:any) => {
  const parmas = {
    id: scope.row.id
  }
  const res:any = await deleteList(parmas)
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
  <div class="textInformationManagement">
    <div class="main">
      <div class="buttons">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户ID:">
            <el-input v-model="formInline.id" placeholder="请输入用户ID" clearable />
          </el-form-item>
          <el-form-item label="用户名称:">
            <el-input v-model="formInline.username" placeholder="请输入用户名称" clearable />
          </el-form-item>
          <el-form-item label="文本ID:">
            <el-input v-model="formInline.listId" placeholder="请输入文本ID" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">
              搜索
            </el-button>
          </el-form-item>
        </el-form>
        <!-- <el-button size="default" @click="addFn">
          新增
        </el-button> -->
      </div>
      <el-table :data="tableData" style="width: 100%" fit>
        <!-- <el-table-column fixed prop="date" label="Date" /> -->
        <el-table-column prop="id" label="文本ID" />
        <el-table-column prop="user.id" label="用户ID" />
        <el-table-column prop="user.username" label="用户名称" />
        <el-table-column prop="content" label="文本内容" />
        <el-table-column prop="result" label="纠错结果" />
        <el-table-column label="文本类型">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.type===0?'文本':'文件' }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="updataTime" label="上传时间" /> -->
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
    </div>
  </div>
</template>

<style lang='scss' scoped>
.main{
  background-color: #fff;
  padding:20px;
  .buttons{
    display: flex;
    // flex-direction: row-reverse;
  }
  .paginations{
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
}

</style>
