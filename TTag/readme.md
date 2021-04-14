# 标签选择组件

![示例效果](https://z3.ax1x.com/2021/04/01/cV1BfH.gif)
提供默认标签选择，用户自定义输入生成的标签组件

## Ttag

- 构造方法参数

  - `el` 指定 dom id
  - `value` 默认标签值
  - `data` 默认提供给用户选择的标签
  - `onLoaded` 远程数据请求事件
  - `onClose` 标签关闭事件
  - `onTagClick` 标签点击事件
  - `onAdd` 新增标签事件

- 示例方法
  - `getFormData` 获取标签的表单值
  - `addTag` 新增标签
  - `hideSelTag` 隐藏标签选项栏
