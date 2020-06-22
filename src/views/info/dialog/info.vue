<template>
  <div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="580px" @close="close">
      <el-form :model="form">
        <el-form-item label="类别" :label-width="form.formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="form.formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="概况" :label-width="form.formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入内容" type='textarea'  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch,watchEffect } from "@vue/composition-api";
export default {
  name: "dialofInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    // =======基础数据类型====================================
    const dialogVisible = ref(false);
    // ========对象类型数据===================================
    const form = reactive({
      formLabelWidth: '70px',
      name: "",
      region: "",
      date1: "",
      date2: "",
      delivery: false,
      type: [],
      resource: "",
      desc: ""
    });
    // 监听传参如果父组件传值就赋值给弹出框的状态
    watchEffect(() => dialogVisible.value = props.flag);

    //=======================函数方法声明======================
    // 关闭弹出框的回调
    const close = () => {
      // 把自己弹出关闭
      dialogVisible.value = false;
      // 传给父组件
      // 使用修饰器方式提交 父组件只需加上.sync 这样父组件就用在监听属性了 直接可以修改
      emit("update:flag", false);
    };
    return {
      dialogVisible,
      close,
      form
      // handleClose
    };
  }
};
</script>

<style lang="scss" >
</style>