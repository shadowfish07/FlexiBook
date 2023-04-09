package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/controllers"
	"github.com/shadowfish07/FlexiBook/middleware"
)

func RegisterRoutes(websiteController *controllers.WebsiteController, systemController *controllers.SystemController, bookmarkController *controllers.BookmarkController, syncController *controllers.SyncController, configController *controllers.ConfigController) *gin.Engine {
	router := gin.Default()
	router.Use(middleware.RequestLoggerMiddleware())
	router.Use(middleware.CORSMiddleware())

	router.GET("/website/meta", websiteController.GetMeta)
	router.GET("/website/icons", websiteController.GetIcon)

	router.GET("/system/version", systemController.GetServiceVersion)

	router.POST("/bookmarks", bookmarkController.CreateBookmark)

	router.GET("/sync/incremental/:clientIncrementalId", syncController.GetIncrementalUpdate)
	router.POST("/sync/incremental", syncController.PostIncrementalUpdate)
	router.POST("/sync/init", syncController.Init)

	router.POST("/config", configController.Update)

	return router
}
