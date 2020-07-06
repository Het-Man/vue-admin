<template>
  <div>
    <div class="overflow-h">
      <el-row :gutter="10">
        <el-col :span="6" v-if="init.province">
          <!-- 省 -->
          <el-select 
            v-model="data.provinceValue" 
            @change="handleChoose({type:'city',province_code:data.provinceValue})" 
          >
            <el-option 
              v-for="item in data.provinceData" 
              :key="item.PROVINCE_CODE" 
              :value="item.PROVINCE_CODE" 
              :label="item.PROVINCE_NAME"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" v-if="init.city">
          <!-- 市 -->
          <el-select 
            v-model="data.cityValue"   
             @change="handleChoose({type:'area',city_code:data.cityValue})"
          >
            <el-option 
              v-for="item in data.cityData" 
              :key="item.CITY_ID" 
              :value="item.CITY_CODE" 
              :label="item.CITY_NAME"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" v-if="init.area">
          <!-- 区 -->
          <el-select 
            v-model="data.areaValue"
            @change="handleChoose({type:'street',area_code:data.areaValue})"   
          >
            <el-option 
              v-for="item in data.areaData" 
              :key="item.AREA_ID" 
              :value="item.AREA_CODE" 
              :label="item.AREA_NAME"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" v-if="init.street">
          <!-- 街道 -->
          <el-select 
            v-model="data.streetValue" 
            @change="handleChoose({type:''})"
          >
            <el-option 
              v-for="item in data.streetData" 
              :key="item.STREET_ID" 
              :value="item.STREET_CODE" 
              :label="item.STREET_NAME"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import { GetCityPicker } from "@/api/common"
import { reactive, watch, onBeforeMount } from '@vue/composition-api';
import {cityPicker} from './cityPicker';
export default {
  props:{
    // 数据
    cityPickerData:{
      type: Object,
      default: () => {}
    },
    // 决定使用哪几个下拉选项（省市区街道）
    cityPickerLevel:{
      type: Array,
      default: () => []
    }
  },
  setup(props, {emit}){
    // console.log(props.cityPickerData)
    const {
      // 数据
      data, resultData,
      // 方法
      getprovince,handleChoose 
    } = cityPicker()

    // 初始化省市区街道数据
    const init = reactive({
      province:false,
      // 市
      city:false,
      //区
      area:false,
      // 街道
      street:false
    })

    // 初始化
    const cityInit = () => {
      // console.log(props.cityPickerLevel)
      // 拿到外面传进来的参数
      let initData = props.cityPickerLevel
      // 如果传的是空数组 就默认省市区街道都显示
      // 不然就传了几个就显示几个
      if(initData.length == 0) {
        for(let key in init){
          init[key] = true
        }
      }else {
        initData.forEach(item => {
          init[item] = true
        })
      }

    }
    onBeforeMount( () => {
      // 获取省份
      getprovince()
      cityInit()

    })
    // 监听 省区市街道的值 返回给 《添加add》 弹出框父组件
    watch([
      () => resultData.provinceValue,
      () => resultData.cityValue,
      () => resultData.areaValue,
      () => resultData.streetValue,
    ],([province,city,area,street]) => {
      // console.log(resultData)
      emit("update:cityPickerData",resultData)
    })

    return{
      data,init,
      //方法
      handleChoose,
    }
  }
};
</script>

<style lang="scss">
</style>
<!--
  省市区街道联动组件使用说明
  组件位置：src>components > CityPicker > index
  引用方式：import CityPicker from "@c/CityPicker";
  template: <CityPicker :cityPickerLevel="[]" :cityPickerData.sync='data.cityPickerData'></CityPicker>
  
  参数配置：
  const data = reactive({
    cityPickerData{}
  })

  cityPickerLevel:[]

  参数说明：
  cityPickerData:
    数据类型：Object;
    通过父组件传过来 自己请求好数据 通过sync直接emit("update:cityPickerData","数据")
    反向修改父组件的值

  cityPickerLevel: 
    数据类型：[];
    参数：province city area street
    列：cityPickerLevel=['province','city']  只会显示省和市选项
    可以选择传递数值配置 需要的选项 什么都不传就 省市区街道都显示
    
-->