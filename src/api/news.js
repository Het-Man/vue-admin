import service from '@/utils/request'

/**
 * 添加一级分类
 * @param {
 *  categoryName: '分类名称' type:string
 * } data 
 */
export function addOneCategory(data){
  return service.request({
      method: "post",
      url: "/news/addFirstCategory/",
      data
  })
}
/**
 * 添加信息
 * @param {
 *  categoryId: 分类ID（number）*
 *  title: 标题（string）*
 *  imgUrl: 标题（string）*
 *  createDate: 日期（string）*
 *  content: 内容
 * } data 
  */
export function AddInfo(data){
  return service.request({
    method: "post",
    url: "/news/add/",
    data
  })
}
/**
 * 删除信息
 * @param {
 *  id: 信息ID（array）
 * } data 
 */
 
export function removeInfo(data){
  return service.request({
    method: "post",
    url: "/news/deleteInfo/",
    data
  })
}
/**
 * 修改信息
 * @param {
 *  id: 信息ID（string）
 *  categoryId: 分类ID（string）
 *  title: 标题（string）
 *  updateDate: 日期（string）
 *  content: 内容（string）
 *  imgUrl: 缩略图（string）
 * } data 
*/
export function EditInfo(data){
  return service.request({
    method: "post",
    url: "/news/editInfo/",
    data
  })
}
/**
 * 获取列表信息
 * @param {
 *  categoryId: 分类ID（string）
 *  startTiem: 开始时间（string）
 *  endTime: 结束时间（string
 *  title: 标题（string）
 *  id: 信息ID（string）
 *  pageNumber: 页码（number）*
 *  pageSize: 条数（number）*
 * } data 
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

/**
 * 添加子级分类
 * @param {
 *  categoryName：分类名称*
 *  parentId：父级ID*
 * } data 
 */
export function AddChildrenCategory(data){
  return service.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data
  })
}

/**
 * 删除分类
 * @param {
  *  id: 分类ID（array）
  * } data 
  */
export function RemoveCategory(data){
  return service.request({
    method:'post',
    url:"/news/deleteCategory/",
    data
  })
}
/**
 * 编辑分类
 * @param {
 *  id：分类ID*
 *  categoryName：分类名称*
 * } data 
 */
export function EditCategorys(data){
  return service.request({
    method:'post',
    url:"/news/editCategory/",
    data
  })
}