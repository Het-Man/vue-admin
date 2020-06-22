// 封装出来提示框
import { MessageBox } from "element-ui";
import {ref} from '@vue/composition-api';

export function global(){
  const str = ref('')
  const confirm = (params) => {
    MessageBox.confirm(params.content, params.tip || "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: params.type || "warning",
      center: true,
    })
    .then(() => {
      str.value = params.id || ""
      params.successFn && params.successFn( params.id|| '')
    })
    .catch(() => {
      params.catchFn && params.catchFn( params.id|| '')
    });
    
  }

  return {
    str,
    confirm
  }
}
