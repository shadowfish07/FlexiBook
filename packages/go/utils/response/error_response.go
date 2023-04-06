package response

import (
	"github.com/gin-gonic/gin"
)

func ErrorResponse(c *gin.Context, httpStatus int, err error) {
	response := gin.H{
		"status":  "error",
		"message": err.Error(),
	}

	c.Set("responseData", response)
	c.JSON(httpStatus, response)
}
