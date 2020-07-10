<template>
  <div>
    <el-select prop="options" v-model="data.selectValue" @change="handleSelect">
      <el-option v-for="item in data.initOption" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed } from "@vue/composition-api";
export default {
  name:'selectComponent',
  props:{
    config:{
      type:Object,
      default: () => {}
    },
    selectData:{
      type:Object,
      default: () => {}
    }
  },
  setup( props, { root, emit } ){
    const data = reactive({
      initOption:[],
      options:[
        {value:'name',label:'姓名'},
        {value:'phone',label:'手机号'},
        {value:'email',label:'邮箱'},
        {value:"id",label:'ID'},
        {value:'title',label:'标题'}
      ],
      selectValue:''
    })

    // 遍历父组件传来的选项 匹配 给下拉框
    const initOption = () => {
      let initData = props.config.init
      let optionArr = []
      // 数据校验
      if(initData.length === 0){
        console.log("config的参数是空的,无法显示下拉菜单")
        return false
      }
      //遍历传来的选项
      initData.forEach(item => {
        // 跟options 匹配
        let arr = data.options.filter( elem => elem.value == item)
        // 加到临时数组中
        if(arr.length > 0){
          optionArr.push(arr[0])
        }
      })
       // 数据校验
      if(optionArr.length === 0){
        console.log("匹配的参数为空！")
        return false
      }
        // 初始化options
        data.initOption = optionArr

        data.selectValue = data.initOption[0].value
      
    }
    const handleSelect = val => {
      // 选中的值遍历options 找到对应的传给父组件
      let fiterData = data.options.filter(item => item.value == val)[0]
      emit("update:selectData",fiterData)
    } 
    onMounted(()=> {
      initOption()
    })
    return {
      data,handleSelect
    }
  }
}
</script>

<style lang="scss">
  
</style>
<!--
  下拉菜单组件使用说明
  组件位置：src>components > Select > index
  引用方式：import SelectVue from "@c/Select";
  template: <SelectVue :config="data.configOption" />
  
  参数配置：
  const data = reactive({
    configOption{
      init: ["name","title"]
    }
  })

  参数说明：
  init:
    数据类型：Array;
    可配置参数："name", "phone", "title", "email", "id", "title"
-->