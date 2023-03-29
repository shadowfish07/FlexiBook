package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

type SystemController struct {
}

const VERSION = "0.0.4"

func NewSystemController() *SystemController {
	return &SystemController{}
}

func (sc *SystemController) GetServiceVersion(ctx *gin.Context) {
	response.JSONResponse(ctx, VERSION)
}
