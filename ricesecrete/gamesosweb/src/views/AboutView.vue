<template>
  <div class="about">
    <h1>关于页面</h1>
    <p>这是一个使用 Vue 3 + JavaScript、Vue Router 和 Pinia 构建的项目。</p>
    <ul>
      <li>Vue 3 - 渐进式 JavaScript 框架</li>
      <li>Vue Router - 官方路由管理器</li>
      <li>Pinia - 官方状态管理库</li>
      <li>Vite - 下一代前端构建工具</li>
    </ul>
  </div>
</template>

<style scoped>
.about {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #42b883;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

ul {
  text-align: left;
  display: inline-block;
  background-color: #f4f4f4;
  padding: 1.5rem 2rem;
  border-radius: 8px;
}

li {
  margin: 0.75rem 0;
  font-size: 1rem;
}
</style>
