package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/controllers"
)

func RegisterRoutes(router *gin.Engine) {
	websiteController := controllers.NewWebsiteController()
	router.GET("/website/meta", websiteController.GetMeta)
	router.GET("/website/icons", websiteController.GetIcon)

	systemController := controllers.NewSystemController()
	router.GET("/system/version", systemController.GetServiceVersion)

	bookmarkController := controllers.NewBookmarkController()
	router.POST("/bookmarks", bookmarkController.CreateBookmark)

	syncController := controllers.NewSyncController()
	router.GET("/sync/incremental/:clientIncrementalId", syncController.GetIncrementalUpdate)
	router.POST("/sync/incremental", syncController.PostIncrementalUpdate)
}
