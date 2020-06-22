<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="category-wrap">
          <div class="category" v-for="item in category.item" :key="item.id">
            <h4>
              <svg-icon icon-class="minus"></svg-icon>
              {{item.category_name}}
              <!-- 一级分类 -->
              <div class="button-group">
                <el-button
                  type="danger"
                  size="mini"
                  round
                  @click="editCategory({data:item,type:'category_first_edit'})"
                >编辑</el-button>
                <el-button type="success" size="mini" round>添加子级</el-button>
                <el-button size="mini" round @click="delCategory(item.id)">删除</el-button>
              </div>
            </h4>
            <!-- 子类 -->
            <ul v-if="item.children">
              <li v-for="itemChildren in item.children" :key="itemChildren.id">
                {{itemChildren.category_name}}
                <div class="button-group">
                  <el-button type="danger" size="mini" round>编辑</el-button>
                  <el-button size="mini" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="titleMenu">一级分类编辑</div>
        <el-form ref="form" :model="form" label-width="142px" style="width: 410px">
          <el-form-item label="一级分类名称：" v-if="oneCategoryShow">
            <el-input v-model="form.oneName" :disabled="oneInpDisabled"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称：" v-if="twoCategoryShow">
            <el-input v-model="form.twoName" :disabled="twoInpDisabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              :loading="btnLoading"
              :disabled="submitBtnDisabled"
              @click="onSubmit"
            >确认</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { reactive, ref, onMounted, refs, watch } from "@vue/composition-api";
import { AddInfo, RemoveCategory, EditCategorys } from "@/api/news";
import { global } from "../../utils/global_v3.0";
import { common } from "@/api/common";
export default {
  name: "infoCategory",
  setup(props, { root, refs }) {
    // 删除确认弹窗
    const { confirm } = global();
    // 获取分类
    const { getInfoCategory, categoryItem } = common()
    /* 
      =============数值类型=========================================================
      vue2.0 data
    */
    //一二级input 显示
    const oneCategoryShow = ref(true);
    const twoCategoryShow = ref(true);
    // 禁用一二级输入框
    const oneInpDisabled = ref(true);
    const twoInpDisabled = ref(true);
    // 禁用按钮
    const submitBtnDisabled = ref(true);
    // loading
    const btnLoading = ref(false);
    // 分类id
    const categoryId = ref("");
    // submit提交类型
    const submitBtnType = ref("");
    /* 
      =============引用类型数值=========================================================
    */
    // 表单内容
    const form = reactive({
      oneName: "",
      twoName: ""
    });

    // 分类内容
    const category = reactive({
      item: [],
      current:{}
    });
    /* 
      =============函数=========================================================
      methods vue2.0
    */
    //提交按钮
    const onSubmit = () => {
      // console.log(form.oneName)
      console.log(submitBtnType.value)
      if( submitBtnType.value == 'category_first_add') {
        addFirstCategory()
      }
      if( submitBtnType.value == 'category_first_edit' ){
        eaitFistCategory()
      }
    };
    // 添加一级分类按钮
    const addFirst = params => {
      console.log(params);
      btnCategory(params.type);
      form.oneName = "";
    };
    // 添加一级分类
    const addFirstCategory = () => {
      if (!form.oneName) {
        root.$message({
          message: "分类名称不能为空",
          type: "error"
        });
        return false;
      }
      btnLoading.value = true;
      // 添加分类
      AddInfo({ categoryName: form.oneName })
        .then(res => {
          console.log(res);
          let data = res.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            // 添加完分类后再获取一遍分类列表
            getInfoCategory();
            // 或者直接添加到分类中 但是如果多人提交分类 还是再请求一遍比较好
            // category.item.push(res.data.data)
          }
          btnDisable();
        })
        .catch(error => {
          btnDisable();
        });
    };
    // 清除表单 按钮状态还原
    const btnDisable = () => {
      btnLoading.value = false;
      form.oneName = "";
      form.twoName = "";
    };
    // 删除分类
    const delCategory = id => {
      categoryId.value = id;
      confirm({
        content: "确定要删除吗？删除后无法恢复！",
        tip: "警告",
        successFn: confirmDelete,
        catchFn: () => {
          // 点击取消的话让id清空
          categoryId.value = "";
        }
      });
    };
    const confirmDelete = () => {
      RemoveCategory({ categoryId: categoryId.value }).then(res => {
        console.log(res);
        // getCategory()
        // 找到当前被删除的索引
        let index = category.item.findIndex(
          item => item.id == categoryId.value
        );
        // 然后删除
        category.item.splice(index, 1);
      });
    };
    // 编辑分类
    const editCategory = params => {
      form.oneName = params.data.category_name;
      //把当前数据存到对象中
      category.current = params.data
      btnCategory(params.type)
    };
    // 编辑分类接口
    const eaitFistCategory = () => {
      let requestData = {
        id: category.current.id,
        categoryName: form.oneName
      }
      EditCategorys(requestData).then(res => {
        // 提示成功
        root.$message({
          message: res.data.message,
          type:'success'
        })
        // 把修改好的值赋给原来存储的对象 因为是引用的关系 所以直接修改到原数组
        category.current.category_name = res.data.data.data.categoryName
        // 情况input
        form.oneName = ''
        // 情况存储的对象
        category.current = []
        submitBtnDisabled.value = true;
        oneInpDisabled.value = true;
      })
    }
    // 根据不同的类别展示不同的样式
    const btnCategory = btnType => {
      // 按钮不禁用
      submitBtnDisabled.value = false;
      // 一级input显示不禁用
      oneInpDisabled.value = false;
      // 二级input不显示
      twoCategoryShow.value = false;
      // 一级input显示
      oneCategoryShow.value = true;
      // 存放提交按钮类型
      submitBtnType.value = btnType;
      switch (btnType) {
        case "category_first_add":
          break;
        case "category_first_edit":
          break;
        case 3:
          console.log(3);
          break;

        default:
          break;
      }
    };
    /* 
      ==========生命周期==========================================
      vue2.0 methode
    */
    onMounted(() => {
      // 获取一级分类
      getInfoCategory()
    });

    watch(() => categoryItem.item,(value)=>{
      category.item = value
    })

    return {
      // ref
      oneCategoryShow,
      twoCategoryShow,
      btnLoading,
      oneInpDisabled,
      twoInpDisabled,
      submitBtnDisabled,
      // reactive
      form,
      category,
      // function
      onSubmit,
      addFirst,
      delCategory,
      editCategory
    };
  }
};
</script>
<style lang="scss" scoped>
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.category {
  line-height: 44px;
  position: relative;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 15px;
    top: 14px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    padding-left: 37px;
    margin-left: 23px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 22px;
      left: 0;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
  .button-group {
    z-index: 2;
    button {
      font-size: 12px;
    }
    position: absolute;
    right: 11px;
    top: -1px;
    display: none;
  }
}
.titleMenu {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
  margin-bottom: 26px;
}
.hr-e9e9e9 {
  width: calc(100% + 60px);
  border: none;
  margin: 30px 0 30px -30px;
  border-bottom: 1px solid #e9e9e9;
}
</style>