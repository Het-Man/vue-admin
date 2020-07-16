<template>
  <div>
    <el-upload
        class="avatar-uploader"
        :action="config.action"
        :data="data.uploadKey"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="data.image" :src="data.image" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed, watch } from "@vue/composition-api";
import { QiniuToKen } from '@/api/common'
export default {
  name:'UploadImg',
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup( props, { root, emit}){
    // console.log(props.config)
    const data = reactive({
      uploadKey: {
        key:"",
        token:""
      },
      image: ""
    })
    watch( () => props.imgUrl, (val) => {
      data.image = val
      // console.log(data.image)
    })

    //函数方法 ======================
    // 上传成功
    const handleAvatarSuccess = (res, file) => {
      let image = `${root.$store.getters['app/qiniuUrl']}${res.key}`;
      data.image =  image
      emit('update:imgUrl',image)
    }
    // 上传前
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        root.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        root.$message.error('上传头像图片大小不能超过 2MB!');
      }
      // 文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key
      return isJPG && isLt2M;
    }
    // 获取七牛云token
    const getQiniu  = () => {
      // let requestData = {
      //     accessKey: 'jm87KBj8XKo_Iy5osNWvGlvu9htp15ouVKasQ6dV',
      //     secretKey: "7pIVjX2bjETLKItIl3iLqQxN6PXQG3gz-lNGpJ_o",
      //     buckety: 'webvueadmin'
      // }
      let requestData = {
          accesskey: props.config.accesskey,
          secretkey: props.config.secretkey,
          buckety: props.config.buckety
      }
      QiniuToKen(requestData).then(res=> {
        data.uploadKey.token = res.data.data.token
      })
    }

    onMounted(() => {
      getQiniu()
    }) 
    return {
      data,
      handleAvatarSuccess ,beforeAvatarUpload  
    }
  }
}
</script>

<style lang="scss">
  
</style>

