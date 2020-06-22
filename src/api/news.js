import service from '@/utils/request'

/* 
  添加一级分类
*/
export function AddInfo(data){
  return service.request({
      method: "post",
      url: "/news/addFirstCategory/",
      data
  })
}

/* 
  获取分类
*/
export function GetCategory(data){
  return service.request({
    method: "post",
    url: "/news/getCategory/",
    data
  })
}

/* 
  删除分类
*/
export function RemoveCategory(data){
  return service.request({
    method:'post',
    url:"/news/deleteCategory/",
    data
  })
}
/* 
  编辑分类
*/
export function EditCategorys(data){
  return service.request({
    method:'post',
    url:"/news/editCategory/",
    data
  })
}