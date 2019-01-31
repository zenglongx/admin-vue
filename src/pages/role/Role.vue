<template>
  <!-- d2-container 文档 https://doc.d2admin.fairyever.com/zh/sys-components/container.html -->
  <d2-container class="page-role">
    <div class="d2-crud">

      <search-header :searchKey="searchKey"  @submit="search" @add="add"/>

      <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="data"
          selection-row
          :rowHandle="rowHandle"
          :form-rules="formRules"
          :form-options="formOptions"
          :pagination="pagination"
          :loading="loading"
          :add-template="addTemplate"
          :edit-template="editTemplate"
          @pagination-current-change="paginationCurrentChange"
          @row-add="handleRowAdd"
          @row-edit="handleRowEdit"
          @row-remove="handleRowRemove"
          @dialog-cancel="handleDialogCancel"
          @selection-change="handleSelectionChange"
          @assign-user="showAssignUser"
          @assign-permission="showAssignPermission"
      >
      </d2-crud>
    </div>

    <!--<template slot="footer">自动生成 1 个组件</template>-->

    <!-- 管理用户 -->
    <el-dialog :title="textMap.assignUser" :visible.sync="assignUserVisible" width="600px">
      <template slot="footer">
        <el-button size="small" @click="handleAssignUser">保存</el-button>
      </template>
      <el-transfer v-model="assignedUsers" :data="users">
      </el-transfer>
    </el-dialog>
    <!-- 管理权限 -->
    <el-dialog :title="textMap.assignPermission" :visible.sync="assignPermissionVisible" width="600px">
      <template slot="footer">
        <el-button size="small" @click="handleAssignPermission">保存</el-button>
      </template>
      <el-transfer v-model="assignedPermissions" :data="permissions">
      </el-transfer>
    </el-dialog>
  </d2-container>

</template>

<script>
// 组件
import SearchHeader from './SearchHeader'
import { GetRoleList, AddRole, UpdateRole, DeleteRole } from '@/api/sys/rolemanager'
import { GetAllUser, GetUserByRoleId, SaveUserRole } from '@/api/sys/usermanager'
import { GetAllPermission, GetPermissionsByRoleId, SavePermissionRole } from '@/api/sys/permissionmanager'
// 请删除下面代码中你不需要的部分
export default {
  name: 'role',
  components: {
    SearchHeader
  },
  // 数据
  data () {
    return {
      textMap: {
        assignUser: null,
        assignPermission: null
      },
      assignRoleId: null,
      users: [],
      assignedUsers: [],
      assignUserVisible: false,
      permissions: [],
      assignedPermissions: [],
      assignPermissionVisible: false,
      searchKey: '',
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: 'status',
          formatter: this.formatType
        }
      ],
      addTemplate: {
        name: {
          title: '名称',
          value: ''
        },
        code: {
          title: '编码',
          value: ''
        },
        status: {
          title: '状态',
          value: 1,
          component: {
            name: 'el-select',
            options: this.getTypeList()
          }
        },
        remark: {
          title: '描述',
          value: ''
        }
      },
      editTemplate: {
        roleId: {
          title: '角色标识',
          value: '',
          component: {
            disabled: true
          }
        },
        name: {
          title: '名称',
          value: ''
        },
        code: {
          title: '编码',
          value: ''
        },
        remark: {
          title: '描述',
          value: ''
        },
        status: {
          title: '状态',
          value: '',
          component: {
            name: 'el-select',
            options: this.getTypeList()
          }
        }
      },
      data: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rowHandle: {
        columnHeader: '操作',
        width: '400',
        align: 'center',
        edit: {
          size: 'mini',
          icon: 'el-icon-edit',
          show (index, row) {
            return true
          },
          disabled (index, row) {
            return false
          }
        },
        custom: [
          {
            text: '分配用户',
            size: 'mini',
            emit: 'assign-user',
            show (index, row) {
              return true
            },
            disabled (index, row) {
              return false
            }
          },
          {
            text: '分配权限',
            size: 'mini',
            emit: 'assign-permission',
            show (index, row) {
              return true
            },
            disabled (index, row) {
              return false
            }
          }
        ],
        remove: {
          icon: 'el-icon-delete',
          size: 'mini',
          confirm: true,
          show (index, row) {
            return true
          },
          disabled (index, row) {
            return false
          }
        }
      },
      formRules: {
        // username: [ { required: true, message: '请输入姓名', trigger: 'change' } ],
        // realName: [ { required: true, message: '请输入地址', trigger: 'blur' } ],
        // roleId: [ { required: true, message: '请输入地址', trigger: 'blur' } ]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false,
        gutter: 20
      }
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子
  beforeCreate () {},
  created () {
    this.getRoleList()
    this.getUserList()
    this.getPermissionList()
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
    showAssignUser ($index) {
      // clear data
      this.assignedUsers = []
      // get new data
      GetUserByRoleId($index.row.roleId).then(data => {
        this.assignRoleId = $index.row.roleId
        this.textMap.assignUser = `角色${$index.row.name}分配用户`
        this.assignedUsers = data.map(user => {
          return user.userId
        })
        this.assignUserVisible = true
      }).catch(err => {
        console.log(`GetUserByRoleId err : ${err}`)
      })
      // show
    },
    handleAssignUser () {
      // save role user
      SaveUserRole({
        roleId: this.assignRoleId,
        userIds: this.assignedUsers
      }).then(data => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.assignUserVisible = false
      }).catch(err => {
        console.log(err)
        this.assignUserVisible = false
      })
    },
    showAssignPermission ($index) {
      // clear data
      this.assignedPermissions = []
      // get new data
      GetPermissionsByRoleId($index.row.roleId).then(data => {
        this.assignRoleId = $index.row.roleId
        this.textMap.assignPermission = `角色${$index.row.name}分配权限`
        this.assignedPermissions = data.map(permission => {
          return permission.permissionId
        })
        this.assignPermissionVisible = true
      }).catch(err => {
        console.log(`GetUserByRoleId err : ${err}`)
      })
      // show
    },
    handleAssignPermission () {
      // save role user
      SavePermissionRole({
        roleId: this.assignRoleId,
        permissionIds: this.assignedPermissions
      }).then(data => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.assignPermissionVisible = false
      }).catch(err => {
        console.log(err)
        this.assignPermissionVisible = false
      })
    },
    getTypeList () {
      return [
        {
          label: '激活',
          value: 1
        }, {
          label: '不激活',
          value: 2
        }
      ]
    },
    formatType (row, column, cellValue, index) {
      return (cellValue === 1) ? '有效' : '无效'
    },
    add () {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    },
    search (searchKey) {
      console.log(searchKey)
      this.searchKey = searchKey
      this.pagination.currentPage = 1
      this.getRoleList()
    },
    handleRowAdd (row, done) {
      this.formOptions.saveLoading = true
      AddRole(row).then(data => {
        this.formOptions.saveLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getRoleList()
        done()
      }).catch(err => {
        console.log('err: ', err)
        this.formOptions.saveLoading = false
      })
    },
    handleRowEdit ({ index, row }, done) {
      this.formOptions.saveLoading = true
      UpdateRole(row).then(data => {
        this.formOptions.saveLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getRoleList()
        done(false)
      }).catch(err => {
        console.log('err: ', err)
        this.formOptions.saveLoading = false
      })
    },
    handleRowRemove ({ index, row }, done) {
      DeleteRole(row.roleId).then(data => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getRoleList()
        done()
      }).catch(err => {
        console.log('err: ', err)
      })
    },
    handleDialogCancel (done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
    },
    handleSelectionChange (selection) {
      console.log(selection)
    },
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getRoleList()
    },
    getRoleList () {
      this.loading = true
      GetRoleList(this.searchKey, this.pagination.currentPage).then(data => {
        this.data = data.list
        this.pagination.total = data.total
        // this.pagination.currentPage = data.pageNum
        this.loading = false
      }).catch(err => {
        console.log('err: ', err)
        this.loading = false
      })
    },
    getUserList () {
      GetAllUser().then(data => {
        this.users = data.map(user => {
          return {
            key: user.userId,
            label: user.username
          }
        })
      }).catch(err => {
        console.log('err: ', err)
      })
    },
    getPermissionList () {
      GetAllPermission().then(data => {
        this.permissions = data.map(permission => {
          return {
            key: permission.permissionId,
            label: permission.name
          }
        })
      }).catch(err => {
        console.log('err: ', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Role.scss';
</style>
