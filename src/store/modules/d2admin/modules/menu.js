// 设置文件
import setting from '@/setting.js'

function convert (menu) {
  return { title: menu.name, icon: menu.icon, path: menu.path, ...menu.children.length > 0 ? { children: menu.children.map(convert) } : {} }
}

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} state vuex state
     * @param {Boolean} collapse is collapse
     */
    asideCollapseSet ({ state, dispatch }, collapse) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = collapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} state vuex state
     */
    asideCollapseToggle ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = !state.asideCollapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} state vuex state
     */
    asideCollapseLoad ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          defaultValue: setting.menu.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     *
     * @param state
     * @param dispatch
     * @param menutree
     * @returns {Promis}
     */
    set ({ state, dispatch }, menutree) {
      return new Promise(async resolve => {
        state.aside = menutree === null ? [] : [convert(menutree)]
        state.header = menutree === null ? [] : [convert(menutree)]
        //
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.menu',
          value: state.aside,
          user: true
        }, { root: true })
        //
        resolve()
      })
    },
    /**
     *
     * @param state
     * @param dispatch
     * @returns {Promise<any>}
     */
    load ({ state, dispatch, commit }) {
      return new Promise(async resolve => {
        // store 赋值
        state.aside = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.menu',
          defaultValue: {},
          user: true
        }, { root: true })

        state.header = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.menu',
          defaultValue: {},
          user: true
        }, { root: true })

        // 初始化菜单搜索功能
        await commit('d2admin/search/init', state.header, { root: true })

        await dispatch('asideCollapseLoad')
        // end
        resolve()
      })
    }
  },
  mutations: {
    /**
     * @description 设置顶栏菜单
     * @param {Object} state vuex state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store 赋值
      state.header = menu
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state vuex state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store 赋值
      state.aside = menu
    }
  }
}
