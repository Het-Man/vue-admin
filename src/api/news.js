import service from '@/utils/request'

/* 
  添加一级分类
*/
export function addOneCategory(data){
  return service.request({
      method: "post",
      url: "/news/addFirstCategory/",
      data
  })
}
/* 
  添加信息
*/
export function AddInfo(data){
  return service.request({
    method: "post",
    url: "/news/add/",
    data
  })
}
/* 
/* 
  删除信息
*/
export function removeInfo(data){
  return service.request({
    method: "post",
    url: "/news/deleteInfo/",
    data
  })
}
/* 
  修改信息
*/
export function EditInfo(data){
  return service.request({
    method: "post",
    url: "/news/editInfo/",
    data
  })
}
/* 
  获取列表信息
*/
export function GetList (data){
  return service.request({
    method: 'post',
    url: "/news/getList/",
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
/* 
  获取分类(包括子级)
*/
export function GetCategoryAll(data){
  return service.request({
    method: "post",
    url: "/news/getCategoryAll/",
    data
  })
}
/* 
  添加子级分类
*/
export function AddChildrenCategory(data){
  return service.request({
    method: "post",
    url: "/news/addChildrenCategory/",
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