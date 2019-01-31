<template>
  <!-- d2-container 文档 https://doc.d2admin.fairyever.com/zh/sys-components/container.html -->
  <d2-container class="page-permission">
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
  </d2-container>
</template>

<script>
// 组件
import SearchHeader from './SearchHeader'
import { GetPermissionList, AddPermission, UpdatePermission, DeletePermission } from '@/api/sys/permissionmanager'
// 请删除下面代码中你不需要的部分
export default {
  name: 'permission',
  components: {
    SearchHeader
  },
  // 数据
  data () {
    return {
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
          title: '类型',
          key: 'type',
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
        type: {
          title: '类型',
          value: 1,
          component: {
            name: 'el-select',
            options: this.getTypeList()
          }
        }
      },
      editTemplate: {
        permissionId: {
          title: '权限标识',
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
        type: {
          title: '类型',
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
        align: 'center',
        edit: {
          text: '编辑',
          size: 'mini',
          icon: 'el-icon-edit',
          show (index, row) {
            return true
          },
          disabled (index, row) {
            return false
          }
        },
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
        // permissionId: [ { required: true, message: '请输入地址', trigger: 'blur' } ]
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
    getTypeList () {
      return [
        {
          label: '菜单',
          value: 1
        }, {
          label: '控制器',
          value: 2
        }, {
          label: '操作',
          value: 3
        }
      ]
    },
    formatType (row, column, cellValue, index) {
      let typeMap = {
        1: '菜单',
        2: '控制器',
        3: '操作'
      }
      return typeMap[cellValue]
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
      this.getPermissionList()
    },
    handleRowAdd (row, done) {
      this.formOptions.saveLoading = true
      AddPermission(row).then(data => {
        this.formOptions.saveLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getPermissionList()
        done()
      }).catch(err => {
        console.log('err: ', err)
        this.formOptions.saveLoading = false
      })
    },
    handleRowEdit ({ index, row }, done) {
      this.formOptions.saveLoading = true
      UpdatePermission(row).then(data => {
        this.formOptions.saveLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getPermissionList()
        done(false)
      }).catch(err => {
        console.log('err: ', err)
        this.formOptions.saveLoading = false
      })
    },
    handleRowRemove ({ index, row }, done) {
      DeletePermission(row.permissionId).then(data => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getPermissionList()
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
      this.getPermissionList()
    },
    getPermissionList () {
      this.loading = true
      GetPermissionList(this.searchKey, this.pagination.currentPage).then(data => {
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
@import './Permission.scss';
</style>
