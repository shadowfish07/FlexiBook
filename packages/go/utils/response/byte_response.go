package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ByteResponse(c *gin.Context, contentType string, data []byte) {
	c.Data(http.StatusOK, contentType, data)
}
