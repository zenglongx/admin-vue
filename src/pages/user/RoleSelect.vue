<template>
  <el-select
      v-model="val"
      @change="$emit('input', val)"
  >
    <el-option
        v-for="option in options"
        :key="option.value"
        v-bind="option"
    >
    </el-option>
  </el-select>
</template>

<script>
import { GetRoleList } from '@/api/sys/rolemanager'

export default {
  name: 'role-select',
  data () {
    return {
      options: [],
      val: ''
    }
  },
  components: {
    GetRoleList
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  created () {
    this.val = this.value
    GetRoleList().then(roleList => {
      this.options = []
      roleList.list.map(role => {
        this.options.push({
          label: role.name,
          value: role.roleId
        })
      })
    })
  }
}
</script>
