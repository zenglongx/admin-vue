<template>
  <d2-container class="page-menu">
    <div class="m-button-group">
      <el-button-group>
        <el-button type="primary" size="small" round @click="handlerAdd">添加子节点</el-button>
        <el-button type="primary" size="small" @click="handlerEdit">修改</el-button>
        <el-button type="danger" size="small" round @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="8"><div class="grid-content bg-purple-dark"></div>
        <el-tree
            class="filter-tree"
            node-key="id"
            highlight-current
            :data="treeData"
            :default-expanded-keys="aExpandedKeys"
            :filter-node-method="filterNode"
            :props="defaultProps"
            @node-click="getNodeData"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
      <el-col :span="16"><div class="grid-content bg-purple-dark"></div>
        <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
          <el-form-item label="父级节点" prop="parentId">
            <el-input v-model="form.parentId" :disabled="true" placeholder="请输入父级节点"></el-input>
          </el-form-item>
          <el-form-item label="节点ID" prop="menuId">
            <el-input v-model="form.menuId" :disabled="true" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.name" :disabled="!formEdit"  placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="form.permissionId" :disabled="!formEdit" placeholder="请输入权限标识"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <!-- <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input> -->
            <d2-icon-select v-model="form.icon" placeholder="请选择图标"></d2-icon-select>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" :disabled="!formEdit" placeholder="请输入资源路径"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="form.sort" :disabled="!formEdit" placeholder="请输入排序"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-input v-model="form.status" :disabled="!formEdit" placeholder="请输入状态"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div style="margin:-5px; text-align:center" v-if="formStatus == 'create'">
      <el-button size="small" @click="onCancel" icon="el-icon-close">取消</el-button>
      <el-button size="small" type="primary" @click="create" icon="el-icon-check">保 存</el-button>
    </div>
    <div style="margin:-5px; text-align:center" v-if="formStatus == 'update'">
      <el-button size="small" @click="onCancel" icon="el-icon-close">取消</el-button>
      <el-button size="small" type="primary" @click="update" icon="el-icon-check">更 新</el-button>
    </div>
  </d2-container>
</template>

<script>

import { GetMenuTree, GetMenuById, AddMenu, DeleteMenu, UpdateMenu } from '@/api/sys/menumanager'

// 组件
// 请删除下面代码中你不需要的部分
export default {
  name: 'menu',
  components: {
  },
  // 数据
  data () {
    return {
      list: null,
      formEdit: false,
      formStatus: '',
      treeData: [],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        permissionId: undefined,
        name: undefined,
        menuId: undefined,
        parentId: undefined,
        url: undefined,
        icon: undefined,
        sort: undefined,
        status: undefined
      },
      currentId: 0,
      menuManager_btn_add: true,
      menuManager_btn_edit: true,
      menuManager_btn_del: true
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '启用',
        2: '禁用'
      }
      return statusMap[status]
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子
  beforeCreate () {},
  created () {
    this.getList()
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  activated () {},
  deactivated () {},
  beforeDestroy () {},
  destroyed () {},
  // 事件处理方法
  methods: {
    getList () {
      GetMenuTree().then(data => {
        this.treeData = [data]
      })
    },
    filterNode (value, data) {
      // console.log(value);
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeExpand (data) {
      let aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse (data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys () {
      let oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion (aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },
    getNodeData (data) {
      this.currentId = data.id
      this.onCancel()
      GetMenuById(data.id).then(data => {
        this.form = data
      })
      if (data.id === 0) {
        return
      }
      this.showElement = true
    },
    handlerEdit () {
      if (this.form.menuId) {
        this.formEdit = true
        this.formStatus = 'update'
      }
    },
    handlerAdd () {
      this.resetForm()
      this.formEdit = true
      this.formStatus = 'create'
    },
    handleDelete () {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteMenu(this.currentId).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update () {
      UpdateMenu(this.form).then(() => {
        this.getList()
        this.onCancel()
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    create () {
      AddMenu(this.form).then(() => {
        this.getList()
        this.onCancel()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    onCancel () {
      this.formEdit = false
      this.formStatus = ''
    },
    resetForm () {
      this.form = {
        permissionId: undefined,
        name: undefined,
        menuId: undefined,
        parentId: this.currentId,
        url: undefined,
        icon: undefined,
        sort: undefined,
        status: undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Menu.scss';
</style>
