package middleware

import (
	"bytes"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequestLoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 记录请求方法和路径
		fmt.Printf("Request Method: %s\n", c.Request.Method)
		fmt.Printf("Request Path: %s\n", c.Request.URL.Path)

		// 记录查询参数
		fmt.Printf("Query Parameters: %v\n", c.Request.URL.Query())

		if c.Request.Body != nil {
			// 记录请求体
			requestBody, err := io.ReadAll(c.Request.Body)
			if err != nil {
				c.AbortWithError(http.StatusInternalServerError, err)
				return
			}
			// 将读取的请求体数据还原回请求体
			c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody))
			fmt.Printf("Request Body: %s\n", string(requestBody))

		}

		// 继续执行后续处理
		c.Next()

		// 记录响应数据
		responseData, ok := c.Get("responseData")
		if ok {
			fmt.Printf("Response Data: %v\n", responseData)
		} else {
			fmt.Println("No response data")
		}
	}
}
