<!-- 重定向 -->
<template>
  <div />
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const { params, query } = useRoute()
const { path } = params
console.log(path, 'pathpathpath')

useRouter().replace({ path: '/' + path, query }).catch((err) => {
  console.warn(err)
})
</script>
