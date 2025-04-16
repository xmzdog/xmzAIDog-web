<template>
  <div class="chat-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">XMZ AI</div>
        <el-button type="primary" link @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
      </div>
      <div class="sidebar-content">
        <div class="new-chat">
          <el-button type="primary" @click="startNewChat">
            <el-icon><Plus /></el-icon>
            新对话
          </el-button>
        </div>
        <div class="chat-history">
          <div v-for="(chat, index) in chatHistory" 
               :key="index" 
               class="chat-item"
               :class="{ active: currentChatIndex === index }"
               @click="switchChat(index)">
            <el-icon><ChatDotRound /></el-icon>
            <span class="chat-title">{{ chat.title || '新对话' }}</span>
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <el-dropdown>
          <div class="user-info">
            <el-avatar :size="32" :src="getUserAvatar()" />
            <span class="username">{{ userInfo.nickname || '用户' }}</span>
          </div>
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
    </div>

    <!-- 主聊天区域 -->
    <div class="main-chat">
      <div class="chat-header">
        <h2>{{ currentChat.title || '新对话' }}</h2>
      </div>
      
      <div class="chat-messages" ref="messagesRef">
        <div v-for="(message, index) in currentChat.messages" 
             :key="index" 
             :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
          <div class="message-avatar">
            <el-avatar :size="32" v-if="message.role === 'user'" :src="getUserAvatar()" />
            <el-avatar v-else :size="32" src="/dog.jpg" />
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-actions">
              <el-button type="primary" link @click="copyMessage(message.content)">
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-container">
        <div class="chat-input-wrapper">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入消息，按 Ctrl + Enter 发送..."
            @keyup.enter.ctrl="sendMessage"
            resize="none"
          />
          <div class="input-actions">
            <el-button type="primary" @click="sendMessage" :loading="loading" round>
              发送
            </el-button>
          </div>
        </div>
        <div class="input-footer">
          <span class="model-info">XMZ AI · 智能对话助手</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, 
  Plus, 
  ChatDotRound, 
  User, 
  SwitchButton,
  CopyDocument
} from '@element-plus/icons-vue'
import { userService } from '../services/user'

const router = useRouter()
const messagesRef = ref(null)
const inputMessage = ref('')
const loading = ref(false)
const currentChatIndex = ref(0)

// 用户信息
const userInfo = reactive({
  nickname: '',
  avatar: ''
})

// 聊天历史
const chatHistory = reactive([
  {
    title: '新对话',
    messages: []
  }
])

// 当前聊天
const currentChat = computed(() => chatHistory[currentChatIndex.value])

// 获取用户头像
const getUserAvatar = () => {
  const route = router.currentRoute.value
  if (route.meta.userInfo && route.meta.userInfo.userAvatar) {
    return `data:image/jpeg;base64,${route.meta.userInfo.userAvatar}`
  }
  return ''
}

// 格式化消息（支持Markdown）
const formatMessage = (content) => {
  // TODO: 实现Markdown解析
  return content
}

// 复制消息
const copyMessage = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息')
    return
  }

  const userMessage = {
    role: 'user',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString()
  }
  currentChat.value.messages.push(userMessage)
  inputMessage.value = ''
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()

  try {
    loading.value = true
    // TODO: 调用AI对话接口
    // const res = await chatService.sendMessage(userMessage.content)
    
    // 模拟AI回复
    setTimeout(() => {
      const aiMessage = {
        role: 'ai',
        content: '这是AI的回复内容，实际开发中需要调用后端接口获取。',
        time: new Date().toLocaleTimeString()
      }
      currentChat.value.messages.push(aiMessage)
      scrollToBottom()
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败，请重试')
    loading.value = false
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 开始新对话
const startNewChat = () => {
  chatHistory.push({
    title: '新对话',
    messages: []
  })
  currentChatIndex.value = chatHistory.length - 1
}

// 切换对话
const switchChat = (index) => {
  currentChatIndex.value = index
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 导航到设置页面
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

onMounted(() => {
  // 添加欢迎消息
  currentChat.value.messages.push({
    role: 'ai',
    content: '你好！我是XMZ AI助手，有什么我可以帮你的吗？',
    time: new Date().toLocaleTimeString()
  })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background-color: var(--el-bg-color);
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background-color: var(--el-bg-color-overlay);
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.new-chat {
  margin-bottom: 20px;
}

.new-chat .el-button {
  width: 100%;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
}

.chat-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.chat-item.active {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}

.chat-item .el-icon {
  margin-right: 8px;
}

.chat-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}

.user-info:hover {
  background-color: var(--el-color-primary-light-9);
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

/* 主聊天区域样式 */
.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
  text-align: center;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  background-color: var(--el-bg-color-overlay);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: calc(100% - 100px);
}

.user-message .message-content {
  background-color: var(--el-color-primary-light-9);
}

.message-text {
  margin-bottom: 8px;
  word-break: break-word;
  line-height: 1.6;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.chat-input-container {
  padding: 20px;
  border-top: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color-overlay);
}

.chat-input-wrapper {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.input-actions {
  position: absolute;
  right: 12px;
  bottom: 12px;
}

.input-footer {
  text-align: center;
  margin-top: 12px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .message {
    max-width: 100%;
  }
  
  .message-content {
    max-width: calc(100% - 80px);
  }
}

@media screen and (max-width: 480px) {
  .sidebar {
    display: none;
  }
  
  .chat-container {
    flex-direction: column;
  }
  
  .message {
    gap: 8px;
  }
  
  .message-avatar {
    display: none;
  }
  
  .message-content {
    max-width: 100%;
  }
}

.ai-avatar {
  display: none;
}
</style> 