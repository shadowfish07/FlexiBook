package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ByteResponse(c *gin.Context, contentType string, data []byte) {
	c.Set("responseData", "returning byte data")
	c.Data(http.StatusOK, contentType, data)
}
