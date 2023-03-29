package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/controllers"
)

func RegisterRoutes(router *gin.Engine) {
	websiteController := controllers.NewWebsiteController()
	router.GET("/website/meta", websiteController.GetMeta)
	router.GET("/website/icons", websiteController.GetIcon)
}
