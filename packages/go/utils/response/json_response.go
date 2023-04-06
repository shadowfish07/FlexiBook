package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func JSONResponse(c *gin.Context, data any) {
	response := gin.H{
		"status": "success",
		"data":   data,
	}

	c.Set("responseData", response)
	c.JSON(http.StatusOK, response)
}
