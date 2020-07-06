import { GetCityPicker } from "@/api/common"
import { reactive, toRefs } from '@vue/composition-api';

export function cityPicker (){
  const data = reactive({
    init: {},
    // 省份
    provinceData:[],
    provinceValue:"",
    // 市
    cityData:[],
    cityValue:"",
    //区
    areaData:[],
    areaValue:"",
    // 街道
    streetData:[],
    streetValue:""
  })
  // 返回数据 
  const resultData = reactive({
    // 省份
    provinceValue:"",
    // 市
    cityValue:"",
    //区
    areaValue:"",
    // 街道
    streetValue:""
  })

  /**
   * 获取省份
   */
  const getprovince = () => {
    GetCityPicker({type:"province"}).then(res => {
      // console.log(res)
      data.provinceData = res.data.data.data
    })
  }

  /**
   * 选择省份 城市 区  返回下一级的数据
   * params｛
   *  type：city 、area、 street,
   *  province_code：省份编码* || city_code：城市编码* ||area_code ：区县编码*
   * ｝
   */
  const handleChoose = (params) => {
    // console.log(params)
    // 这是选择街道的时候传了空值 让其把调用resetValue方法 走result，把街道的值也赋给resultData
    if(!params.type){
      resetValue(params.type)
      return false
    }
    // 获取市 区 街道
    GetCityPicker(params).then(res => {
      // console.log(res)
      // data.provinceData = res.data.data.data
      // 根据不同的类型判断是 市 区 还是街道的值
      let type = params.type
      data[`${type}Data`] = res.data.data.data
      resetValue(params.type)
    })
  }
  // 重置数据
  const resetValue = (params) => {
    // params 是传进来的类型 
    //把市区街道的key 放在一起 
    //  遍历它清除对应的值
    let valueJson =  {
      city:['cityValue','areaValue','streetValue'],
      area:['areaValue','streetValue'],
      street:['streetValue']
    }

    let arrObj = valueJson[params]
    if(arrObj) {
      // 清空指定的key值
      arrObj.forEach(item => {
        data[item] = ''
      })
    }
    result()
  
  }
  // 整合返回数据
  const result = () => {
    for(let key in resultData){
      resultData[key] = data[key]
    }
    // console.log(resultData)
  }
  return {
    // ...toRefs(data),  toRefs 是把响应式对象数据 转成基础类型数据
    data,
    resultData,
    getprovince,handleChoose
  }
}