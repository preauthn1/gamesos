/**
 * Activity Module API Index
 * GameOS 活动模块 API 索引文件
 */

// 导入所有 API
import ActivityCategoryAPI from './activity-category.api'
import ActivityListAPI from './activity-list.api'
import ActivitySignAPI from './activity-sign.api'
import ActivityTurntableAPI from './activity-turntable.api'
import ActivityReceiveAPI from './activity-receive.api'

// 导出所有 API
export { default as ActivityCategoryAPI } from './activity-category.api'
export { default as ActivityListAPI } from './activity-list.api'
export { default as ActivitySignAPI } from './activity-sign.api'
export { default as ActivityTurntableAPI } from './activity-turntable.api'
export { default as ActivityReceiveAPI } from './activity-receive.api'

// 默认导出所有 API
export default {
  ActivityCategoryAPI,
  ActivityListAPI,
  ActivitySignAPI,
  ActivityTurntableAPI,
  ActivityReceiveAPI
}