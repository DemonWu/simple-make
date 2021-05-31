# simple-make
- [安装](#安装) - 如何安装
- [例子](#使用实例) - 使用实例
## 目的
由于开发的时候创建页面或者组件时候会有对应模板，每次创建都需要创建多个文件并且内容都相似，所以做了一个简单的模板复制功能，通过自己本地定义模板，通过命令进行创建，减少操作，其实就是懒。
## 安装
```shell script
npm install -g @wuhao_demon/simple-make
```
或者
```shell script
yarn global add @wuhao_demon/simple-make
```
## 使用实例
### 查看帮助
```shell script
simple-make --help
```
```
Commands:
  simple-make template [action]  模板处理

Options:
      --help                 Show help                                 [boolean]
      --version              Show version number                       [boolean]
  -v, --verbose              是否开启log                               [boolean]
      --templateName, --tn   模板名称                                   [string]
  -d, --dir                  是否是文件夹形式                          [boolean]
  -n, --name                 创建名称                                   [string]
      --description, --desc  描述                                       [string]

```
### action例子
#### 帮助
```shell script
simple-make template --help
```
```
simple-make template [action]

模板处理

Positionals:
  action  模板相关操作
          [string] [choices: "list", "get", "check", "copy", "create", "author"]
                                                               [default: "list"]

Options:
      --help                 Show help                                 [boolean]
      --version              Show version number                       [boolean]
  -v, --verbose              是否开启log                               [boolean]
      --templateName, --tn   模板名称                                   [string]
  -d, --dir                  是否是文件夹形式                          [boolean]
  -n, --name                 创建名称                                   [string]
      --description, --desc  描述                                       [string]

```
#### 列表
查找本地模板
```shell script
simple-make template list
```
```
react
```
#### 获取模板信息
```shell script
simple-make template get --tn=react
```
```
index.js
index.scss
```
#### 检查模板内容
可以通过模板名称进行模板操作，增删改查
```shell script
simple-make template check --tn=react
```
修改模板内容注意
- **@name** 为复制模板的时候的名称 -n
- **@author** 为复制模板的时候的作者 通过author进行修改
- **@date** 为时间2021-05-31 17:11:04 格式
- **@description** 为描述，通过--desc传值
#### 复制模板
```shell script
simple-make template copy --tn=react -n=Test -d --desc=哈哈哈
```
#### 创建模板
```shell script
simple-make template create
```
#### 修改作者
```shell script
simple-make template author
```
