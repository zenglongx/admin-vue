<template>
  <!-- d2-container 文档 https://doc.d2admin.fairyever.com/zh/sys-components/container.html -->
  <d2-container class="page-user">
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
            @selection-change="handleSelectionChange">
        </d2-crud>
      </div>

    <!--<template slot="footer">自动生成 1 个组件</template>-->
  </d2-container>
</template>

<script>

// 组件
import { GetUserList, AddUser, UpdateUser, DeleteUser } from '@/api/sys/usermanager'
import SearchHeader from './SearchHeader'
import RoleSelect from './RoleSelect'

// 请删除下面代码中你不需要的部分
export default {
  name: 'user',
  components: {
    SearchHeader,
    RoleSelect
  },
  // 数据
  data () {
    return {
      searchKey: '',
      columns: [
        {
          title: '帐号',
          key: 'username'
        },
        {
          title: '姓名',
          key: 'realName'
        },
        {
          title: '角色',
          key: 'role.name'
        },
        {
          title: '手机号',
          key: 'mobile'
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
        username: {
          title: '帐号',
          value: ''
        },
        realName: {
          title: '姓名',
          value: ''
        },
        roleId: {
          title: '角色',
          value: 1,
          component: {
            name: RoleSelect
          }
        },
        mobile: {
          title: '手机号码',
          value: ''
        },
        status: {
          title: '状态',
          value: 1,
          component: {
            name: 'el-select',
            options: this.getTypeList()
          }
        }
      },
      editTemplate: {
        userId: {
          title: '用户标识',
          value: '',
          component: {
            disabled: true
          }
        },
        username: {
          title: '帐号',
          value: ''
        },
        realName: {
          title: '姓名',
          value: ''
        },
        roleId: {
          title: '角色',
          value: '',
          component: {
            name: RoleSelect
          }
        },
        mobile: {
          title: '手机号码',
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
        width: '200',
        align: 'center',
        edit: [{
          icon: 'el-icon-edit',
          text: '编辑',
          size: 'mini',
          show (index, row) {
            return true
          },
          disabled (index, row) {
            return false
          }
        }],
        remove: {
          icon: 'el-icon-delete',
          size: 'mini',
          fixed: 'right',
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
  computed: {
  },
  // 侦听器
  watch: {},
  // 生命周期钩子
  beforeCreate () {
  },
  created () {
    this.getUserList()
  },
  beforeMount () {
  },
  mounted () {
  },
  beforeUpdate () {},
  updated () {},
  activated () {},
  deactivated () {},
  beforeDestroy () {},
  destroyed () {},
  // 事件处理方法
  methods: {
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
      this.getUserList()
    },
    handleRowAdd (row, done) {
      this.formOptions.saveLoading = true
      AddUser(row).then(data => {
        this.formOptions.saveLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getUserList()
        done()
      }).catch(err => {
        console.log('err: ', err)
        this.formOptions.saveLoading = false
      })
    },
    handleRowEdit ({ index, row }, done) {
      this.formOptions.saveLoading = true
      UpdateUser(row).then(data => {
        this.formOptions.saveLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getUserList()
        done(false)
      }).catch(err => {
        console.log('err: ', err)
        this.formOptions.saveLoading = false
      })
    },
    handleRowRemove ({ index, row }, done) {
      DeleteUser(row.userId).then(data => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getUserList()
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
      this.getUserList()
    },
    getUserList () {
      this.loading = true
      GetUserList(this.searchKey, this.pagination.currentPage).then(data => {
        this.data = data.list
        this.pagination.total = data.total
        // this.pagination.currentPage = data.pageNum
        this.loading = false
      }).catch(err => {
        console.log('err: ', err)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './User.scss';
</style>
