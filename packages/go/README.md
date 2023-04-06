# FlexiBook backend server

## 项目结构

```
go/
├── cmd/
│   └── main.go
├── config/
│   └── config.go
├── controllers/
│   ├── user_controller.go
│   └── post_controller.go
├── middleware/
│   └── auth_middleware.go
├── models/
│   ├── user.go
│   └── post.go
├── routes/
│   └── routes.go
├── services/
│   ├── user_service.go
│   └── post_service.go
├── utils/
│   ├── response.go
│   └── errors.go
└── go.mod
```

- cmd/main.go：程序入口点，包含主函数。
- config/：存储项目的配置文件，如数据库连接、环境变量等。
- controllers/：存放 API 控制器文件，处理 HTTP 请求和生成响应。
- middleware/：存放中间件，用于处理公共逻辑，如身份验证、CORS 设置等。
- models/：存放数据模型和数据库操作相关文件。
- routes/：定义所有的路由和路由处理函数。
- services/：存放业务逻辑，处理控制器和模型之间的交互。
- utils/：存放一些通用的工具函数和自定义错误处理。

## 依赖注入

项目使用`wire`完成依赖注入，新增依赖来源时需要在`packages/go/cmd/server/wire.go`中添加，并执行

```shell
wire
```

生成依赖注入代码。

## 单元测试

```shell
go test
```

## 部署

推荐部署到函数计算。

推荐部署到中国香港等地区，以优化网页 meta 解析能力

请修改 `packages/go/cmd/server/s.yaml` 中的配置

### 阿里云部署

```
s deploy
```
