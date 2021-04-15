# 标签选择组件

![示例效果](https://z3.ax1x.com/2021/04/01/cV1BfH.gif)
提供默认标签选择，用户自定义输入生成的标签组件

## Ttag

## constructor({el[,pattern = "&,&",value,url,maxSize,items,name,onCloseTag,onAddTag,onClickTag,onLoaded]})

- `el` `<domselect>` 指定 dom id
- `value` `<array>` 默认标签值
- `url` `<string>` 远程标签地址,请求后需要在 onLoaded 事件中加载数据
- `pattern` `<string>` 表单值中标签间的分隔符
- `maxSize` `<number>` 最大标签个数
- `items` `<array>` 默认提供给用户选择的标签
- `name` `<string>` input 隐藏域的 name 值
- `onCloseTag` `<function>` 标签关闭事件
  - `val` `<string>` 被关闭标签的文本值
- `onAddTag` `<function>` 新增标签事件
  - `text` `<string>` 新增的标签值
  - `formVal` `<string>` 新增后的表单值
  - `isExist` `<boolean>` 新增的标签是否已在待选择的标签中纯在
- `onClickTag` `<function>` 标签点击事件
  - `text` `<string>` 被点击标签的文本值
- `onLoaded` `<function>` 远程数据请求完毕事件
  - `responseText` `<string>` 响应的文本值
  - `instance` `<object>` 当前组件对象实例

## getFormData(type=['string' | 'array'])

- `type` `<string>` 返回表单数据的类型
- Returns: `<string>`|`<array>`

获取标签的表单值

## addTag(text[,fireEvent])

- `text` `<string>` 标签文本内容
- `fireEvent` `<boolean>` 是否触发新增标签事件

新增标签

## loadItems(items)

- `items` `<array>`

载入供选择的标签数据

## cleanItems()

清除供选择的标签数据
