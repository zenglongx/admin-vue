<template>

    <el-form
            :inline="true"
            :model="form"
            ref="form"
            size="mini"
            style="margin-bottom: -18px;">

        <el-form-item prop="searchKey">
            <el-input
                    v-model="form.searchKey"
                    placeholder="帐号或姓名"
                    style="width: 120px;"/>
        </el-form-item>

        <el-form-item>
            <el-button
                    type="primary"
                    @click="handleFormSubmit">
                <d2-icon name="search"/>
                查询
            </el-button>
        </el-form-item>

        <el-form-item>
            <el-button
                    @click="handleFormReset">
                <d2-icon name="refresh"/>
                重置
            </el-button>
        </el-form-item>

        <el-form-item>
            <el-button style="margin-bottom: 5px" @click="addRow">新增</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        searchKey: ''
      }
    }
  },
  props: {
    searchKey: {
      type: String
    }
  },
  methods: {
    // 普通的新增
    addRow () {
      this.$emit('add')
    },
    handleFormSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form.searchKey)
        } else {
          this.$notify.error({
            title: '错误',
            message: '表单校验失败'
          })
          return false
        }
      })
    },
    handleFormReset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>
