// import Home from '../views/home/Home'
// import EsSearch from '../views/esSearch/EsSearch'
import SourceConfig from '../views/dataSourceConfig/SourceConfig'
import WordsManagement from '../views/wordsManagement/WordsManage'
// import Words from '../views/words/Words'
import { Modal } from '../views/modal/Modal'
const routes = [
  // {
  //   component: Home,
  //   path: '/',
  //   exact: true,
  //   iconType: 'dashboard',
  //   name: '首页',
  //   hasMenu: true,
  //   hidden: false
  // },
  // {
  //   component: UserLog,
  //   path: '/logs',
  //   iconType: 'reconciliation',
  //   name: '日志管理',
  //   hasMenu: true,
  //   hidden: false,
  //   children: [
  //     {
  //       component: UserLog,
  //       path: '/logs/userLog',
  //       name: '用户日志',
  //       hasMenu: true,
  //       hidden: false
  //     }
  //   ]
  // },
  // {
  //   component: User,
  //   path: '/user',
  //   iconType: 'user',
  //   name: '用户管理',
  //   hasMenu: true,
  //   hidden: false
  // },
  // {
  //   component: Words,
  //   path: '/words',
  //   iconType: 'words',
  //   name: '词表',
  //   hasMenu: true,
  //   hidden: false
  // },
  // {
  //   component: EsSearch,
  //   path: '/esSearch',
  //   iconType: 'esSearch',
  //   name: 'ES搜索',
  //   hasMenu: true,
  //   hidden: false
  // },
  {
    component: SourceConfig,
    path: '/SourceConfig',
    iconType: 'setting',
    name: '配置数据源',
    hasMenu: true,
    hidden: false
  },
  {
    component: WordsManagement,
    path: '/WordsManagement',
    iconType: 'profile',
    name: '词表管理',
    hasMenu: true,
    hidden: false
  }, {
    component: Modal,
    path: '/modal',
    iconType: 'snippets',
    name: '模板管理',
    hasMenu: true,
    hidden: false
  }
]

export default routes
