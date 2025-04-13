<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">XMZ AI</div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="userInfo.avatar" :icon="UserFilled" />
            <span class="username">{{ userInfo.nickname || '用户' }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="navigateTo('/settings')">
                <el-icon><User /></el-icon>
                账号设置
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main class="main-content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <h1>欢迎使用 XMZ AI</h1>
        <p>探索人工智能的无限可能</p>
      </div>

      <!-- 功能卡片区域 -->
      <div class="feature-cards">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="feature-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>智能对话</span>
                </div>
              </template>
              <div class="card-content">
                <p>与AI进行自然语言对话，获取智能回答</p>
                <el-button type="primary" @click="navigateTo('/chat')">开始对话</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="feature-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><Picture /></el-icon>
                  <span>图像生成</span>
                </div>
              </template>
              <div class="card-content">
                <p>通过文字描述生成精美的AI图像</p>
                <el-button type="primary" @click="navigateTo('/image')">开始创作</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="feature-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><Document /></el-icon>
                  <span>文档处理</span>
                </div>
              </template>
              <div class="card-content">
                <p>智能分析和处理各类文档</p>
                <el-button type="primary" @click="navigateTo('/doc')">开始处理</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 使用统计 -->
      <div class="usage-stats">
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataLine /></el-icon>
              <span>使用统计</span>
            </div>
          </template>
          <div class="stats-content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.chatCount }}</div>
                  <div class="stat-label">对话次数</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.imageCount }}</div>
                  <div class="stat-label">生成图片</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.docCount }}</div>
                  <div class="stat-label">处理文档</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  UserFilled, 
  ChatDotRound, 
  Picture, 
  Document, 
  DataLine,
  User,
  SwitchButton
} from '@element-plus/icons-vue'
import { userService } from '../services/user'

const router = useRouter()
const userInfo = ref({
  nickname: '',
  avatar: ''
})

const stats = ref({
  chatCount: 0,
  imageCount: 0,
  docCount: 0
})

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await userService.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退出失败:', error)
      ElMessage.error('退出失败')
    }
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await userService.getUserInfo()
    if (res && res.data) {
      userInfo.value = res.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取用户统计数据
const fetchUserStats = async () => {
  try {
    // TODO: 调用后端API获取统计数据
    // const res = await userService.getStats()
    // stats.value = res.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchUserStats()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.welcome-section h1 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 16px;
  color: #606266;
}

.feature-cards {
  margin-bottom: 40px;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s;
  margin-bottom: 20px;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.card-content {
  text-align: center;
}

.card-content p {
  margin-bottom: 20px;
  color: #606266;
}

.usage-stats {
  margin-bottom: 40px;
}

.stats-card {
  background-color: #fff;
}

.stats-content {
  padding: 20px 0;
}

.stat-item {
  text-align: center;
  margin-bottom: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .header {
    padding: 0 10px;
  }

  .logo {
    font-size: 20px;
  }

  .username {
    display: none;
  }

  .main-content {
    padding: 10px;
  }

  .welcome-section h1 {
    font-size: 24px;
  }

  .welcome-section p {
    font-size: 14px;
  }

  .feature-card {
    margin-bottom: 15px;
  }

  .card-content p {
    font-size: 14px;
    margin-bottom: 15px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 480px) {
  .header {
    height: 50px;
  }

  .logo {
    font-size: 18px;
  }

  .welcome-section h1 {
    font-size: 20px;
  }

  .welcome-section p {
    font-size: 12px;
  }

  .feature-card {
    margin-bottom: 10px;
  }

  .card-content p {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style> 