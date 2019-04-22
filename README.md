# 基础模板文档
  
  ```
  git clone git@192.168.0.149:WHProject/ichangyun-search.git

  cd ichangyun-search

  yarn start
  ```

## 环境配置

  node > v8.0

  yarn


## mock说明

默认使用mockjs模拟接口

在src/index.tsx中注释掉``Mock.bootstrap()``即可访问真实接口

```
// mock请求启动，若有接口，可注释此行。请求代理在package.json中proxy字段
Mock.bootstrap()
```
[mockjs文档](https://github.com/nuysoft/Mock/wiki)

[axios-mock-adapter文档](https://github.com/ctimmerm/axios-mock-adapter)

接口代理配置在``package.json``中的``proxy``字段

## ant-design

UI组件来自 [ant-design](https://ant.design/docs/react/introduce-cn)