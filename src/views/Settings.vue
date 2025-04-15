<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <el-button type="primary" link @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回首页
            </el-button>
            <h2>账号设置</h2>
          </div>
        </div>
      </template>
      
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <!-- 头像上传 -->
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :http-request="handleAvatarUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="userForm.userAvatar" :src="getAvatarUrl(userForm.userAvatar)" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入昵称" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, ArrowLeft } from '@element-plus/icons-vue'
import { userService } from '../services/user'

const router = useRouter()
const userFormRef = ref(null)
const loading = ref(false)

// 用户表单数据
const userForm = reactive({
  userAvatar: '',
  userName: '',
  email: '',
  phone: ''
})

// 从路由中获取用户信息
const getUserInfoFromRoute = () => {
  const route = router.currentRoute.value
  if (route.meta.userInfo) {
    Object.assign(userForm, route.meta.userInfo)
  }
}

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 获取头像URL
const getAvatarUrl = (avatar) => {
  if (!avatar) return ''
  // 如果已经是完整的URL，直接返回
  if (avatar.startsWith('http')) {
    return avatar
  }
  // 如果是Base64字符串，添加前缀
  return `data:image/jpeg;base64,${avatar}`
}

// 自定义上传方法
const handleAvatarUpload = async (options) => {
  try {
    const res = await userService.uploadAvatar(options.file)
    if (res && res.data) {
      // userForm.avatar = res.data.avatar
      // 更新用户信息
      // await userService.updateUserInfo({
      //   avatar: res.data.avatar,
      //   nickname: userForm.nickname,
      //   email: userForm.email,
      //   phone: userForm.phone
      // })
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error('头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败，请重试')
  }
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    loading.value = true
    
    const res = await userService.updateUserInfo(userForm)
    if (res && (res.code === 200 || res.code === 0)) {
      ElMessage.success('修改成功')
      // 更新路由中的用户信息
      router.currentRoute.value.meta.userInfo = userForm
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch (error) {
    console.error('修改失败:', error)
    ElMessage.error(error.message || '修改失败，请重试')
  } finally {
    loading.value = false
  }
}

// 返回首页
const goBack = () => {
  router.push('/')
}

onMounted(() => {
  getUserInfoFromRoute()
})
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-card {
  margin-top: 20px;
}

.card-header {
  text-align: center;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.header-content h2 {
  margin: 0;
}

.header-content .el-button {
  position: absolute;
  left: 0;
}
</style> 