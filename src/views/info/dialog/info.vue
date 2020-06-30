<template>
  <div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="580px" @close="close" @open="openDialog">
      <el-form :model="data" ref="addInfoForm">
        <el-form-item label="类别" :label-width="data.formLabelWidth">
          <el-select v-model="data.form.category" placeholder="请选择活动区域">
            <el-option 
              v-for="item in data.categoryOption" :key="item.id"
              :label="item.category_name" 
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="data.formLabelWidth" prop='title'>
          <el-input v-model="data.form.title" placeholder="请输入标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="概况" :label-width="data.formLabelWidth" prop='content'>
          <el-input v-model="data.form.content" placeholder="请输入内容" type='textarea'  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger"  :loading="data.submitLoading"  @click='sumbitStr' >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, refs, watch, watchEffect } from "@vue/composition-api";
import { AddInfo, GetList, EditInfo } from "@/api/news"
import { formatDateTime } from "@/utils/validate"
export default {
  name: "dialofInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type:Array,
      default: () => []
    },
    typeTitle: {
      type:Object,
      default: () => {}
    }
  },
  setup(props, { root, emit, refs }) {
    // =======基础数据类型====================================
    const dialogVisible = ref(false);
    // ========对象类型数据===================================
    const data = reactive({
      formLabelWidth: '70px',
      name: "",
      form: {
        category: '',
        title: '',
        content: ''
      },
      // 分类下拉
      categoryOption: [],
      submitLoading :false
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
      resetForm()
    };
    // 打开对话框
    const openDialog = () => {
      data.categoryOption = props.category
      if(props.typeTitle.title == '编辑'){
        let requestData = {
          id: props.typeTitle.id,
          pageNumber: 1,
          pageSize: 1,
        }
        GetList(requestData).then(res => {
          console.log(res)
          let resdata = res.data.data.data[0]
          data.form  = {
            category: resdata.categoryId,
            title: resdata.title,
            content: resdata.content
          }
        }).catch(err => {})
      }
    }
    // 重置表单
    const resetForm = () => {
      // refs.addInfoForm.resetFields()
      data.form.category = ''
      data.form.title = ''
      data.form.content = ''
    }
    // 提交
    const sumbitStr = () => {
      if(props.typeTitle.title == '新增'){
        interFace(AddInfo)
      }else if(props.typeTitle.title == '编辑'){
        interFace(EditInfo)
      }

    }
    /* 
      新增或者编辑接口
      interFaceName : 接口名
    */
    const interFace = (interfaceName) => {
       // 获取时间
        let dateTime = formatDateTime(new Date())

        let requestData = {
          categoryId: data.form.category ,
          title: data.form.title,
          imgUrl: "",
          createDate: dateTime,
          content: data.form.content,
        }
        // 判断是编辑还是新增 编辑就给请求参数加上id
        if(props.typeTitle.title == '编辑'){
          requestData.id = props.typeTitle.id
        }else {
          delete requestData.id
        }
        if(!data.form.category ){
          root.$message({
            message: '分类不能为空！',
            type: 'error'
          })
          return false
        }else if(!data.form.title){
          root.$message({
            message: '标题不能为空！',
            type: 'error'
          })
          return false
        }
        data.submitLoading = true
        // 接口
        interfaceName(requestData).then( res => {
          console.log(res)
          dialogVisible.value = false
          root.$message({
            message:res.data.message,
            type:'success'
          })
          emit('getListEmit')
          data.submitLoading = false
        }).catch(err => {})

    }
    // 编辑信息
    const editInfo = () => {
      let dateTime = formatDateTime(new Date())
      let request = {
        id: props.typeTitle.id,
        categoryId: data.form.category ,
        title: data.form.title,
        imgUrl: "",
        createDate: dateTime,
        content: data.form.content,
      }
      EditInfo(request).then(res => {
        console.log(res)
        // dialogVisible.value = false
      })
    }
    return {
      dialogVisible,
      close,
      data,
      openDialog,
      sumbitStr,
      // handleClose
    };
  }
};
</script>

<style lang="scss" >
</style>