package middleware

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

func AuthenticationMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientID := c.Request.Header.Get("X-Client-ID")
		c.Set("clientId", clientID)

		// 允许跳过认证的接口列表
		ignoreList := []string{"/sync/init", "/invitation/activate/"}

		// 如果请求的路径在忽略列表中，则不进行身份认证
		for _, ignorePath := range ignoreList {
			if strings.HasPrefix(c.Request.URL.Path, ignorePath) {
				c.Next()
				return
			}
		}

		timestamp := c.Request.Header.Get("X-Timestamp")
		signature := c.Request.Header.Get("X-Signature")

		// 校验请求头中的字段是否存在
		if clientID == "" || timestamp == "" || signature == "" {
			c.Abort()
			response.ErrorResponse(c, http.StatusUnauthorized, errors.New("请求头缺少必要的认证信息"))
			return
		}

		clientSecret, isMonitor, err := authService.GetClientSecret(clientID)
		if err != nil {
			c.Abort()
			response.ErrorResponse(c, http.StatusInternalServerError, err)
			return
		}

		// 计算签名
		calculatedSignature := md5Signature(clientID, clientSecret, timestamp)

		// 比较请求头中的签名和计算出的签名
		if signature != calculatedSignature {
			c.Abort()
			response.ErrorResponse(c, http.StatusUnauthorized, errors.New("签名验证失败"))
			return
		}

		// TODO 过滤只有管理员才能访问的接口
		c.Set("isMonitor", isMonitor)

		log.Default().Println("isMonitor: ", isMonitor)

		if strings.HasPrefix(c.Request.URL.Path, "/invitation/activate/") {
			if isMonitor {
				c.Abort()
				response.ErrorResponse(c, http.StatusBadRequest, errors.New("不能激活自己的邀请链接"))
				return
			}
		}

		c.Next()
	}
}

func md5Signature(clientID, clientSecret, timestamp string) string {
	hash := md5.Sum([]byte(clientID + clientSecret + timestamp))
	return hex.EncodeToString(hash[:])
}
