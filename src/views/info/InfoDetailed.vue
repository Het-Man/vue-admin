<template>
  <el-form ref="form" :model="form" label-width="80px">

    <el-form-item label="信息分类">
      <el-select v-model="form.categoryId" >
        <el-option v-for="item in data.category" :key="item.id" :value="item.id" :label="item.category_name"   ></el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label='新闻标题' >
      <el-input v-model="form.title" ></el-input>
    </el-form-item>

    <el-form-item label='缩略图' > 
      <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>

    <el-form-item label='发布日期' >
      <el-date-picker type="date" :disabled="true" placeholder="选择日期" v-model="form.createDate" style="width: 15%;"></el-date-picker>
    </el-form-item>
    <el-form-item label='详细内容' >
      <quillEditor v-model="form.content" :options="data.editorOption" ></quillEditor>
    </el-form-item>
    <el-form-item  >
      <el-button type="primary" @click="submit" :loading="data.submitLoading" >保存</el-button>
    </el-form-item>

    
  </el-form>
</template>

<script>
import { reactive, ref, onMounted, computed } from "@vue/composition-api";
import { GetList, EditInfo } from '@/api/news'
import { timestampToTime } from '@/utils/validate'
import UploadImg from "@/components/UploadImg"
import { stripscript } from "@/utils/validate"
// 富文本编辑器
import { quillEditor } from "vue-quill-editor"; 
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  name: 'InfoDetailed',
  components: {
    quillEditor,
    UploadImg
  },
  setup(props, {root}){
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml"
    })
    const data = reactive({
      id: root.$route.params.id || root.$store.getters['InfoDetailed/infoId'],
      category:[],
      editorOption:{},
      submitLoading: false,
      imageUrl:'',
      // 七牛云token
      uploadKey: {
        token:'',
        key:''
      }
    })
    // 表单数据
    const form = reactive({
      categoryId:'',
      title:'',
      imgUrl:'',
    })

    /* 
      函数===================
    */
    // 获取分类
    const getCategory = () => {
      root.$store.dispatch('app/getInfoCategory').then(res => {
        // console.log(res)
        data.category = res
      })
    }
    // 获取分类信息
    const getInfo = () => {
      let resData = {
        id: data.id,
        pageNumber: 1,
        pageSize:1
      }
      GetList(resData).then( res => {
        let resInfo = res.data.data.data[0]
        Object.assign(form, resInfo)
        // let infoDate = JtimestampToTime(form.createDate)
        // console.log(timestampToTime(form.createDate))
        form.createDate = timestampToTime(form.createDate)
        console.log(form)

      })
    }
    // 编辑提交分类信息
    const submit = () => {
      // 过滤特殊字符
      form.title = stripscript(form.title)
      let resData = {
        id: data.id,
        ...form
      }
      if(!form.title != ''){
        root.$message({
          message: "标题不能为空",
          type:'error'
        })
      }
      console.log(resData)
      console.log(form)
      return false
      // 移除多余的用户名
      delete resData.categoryName
      // 按钮等待状态
      data.submitLoading = true
      EditInfo(resData).then(res => {
        root.$message({
          message: res.data.message,
          type: 'success'
        })
        data.submitLoading = false
      }).catch(err => {
        data.submitLoading = false
      })

    }
    
    // 
    /* 
      onMouted
      vue2.0 mounted
    */
    onMounted(()=> {
      getCategory()
      getInfo()
    })
    return{
      // reactive
      data, form, uploadImgConfig,
      //function 
      submit, 
    }
  }
}
</script>

<style lang="scss" >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>