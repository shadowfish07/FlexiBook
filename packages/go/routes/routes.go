package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/controllers"
	"github.com/shadowfish07/FlexiBook/middleware"
	"github.com/shadowfish07/FlexiBook/services"
)

func RegisterRoutes(websiteController *controllers.WebsiteController,
	systemController *controllers.SystemController,
	bookmarkController *controllers.BookmarkController,
	syncController *controllers.SyncController,
	configController *controllers.ConfigController,
	authService *services.AuthService,
	authController *controllers.AuthController) *gin.Engine {
	router := gin.Default()
	router.Use(middleware.RequestLoggerMiddleware())
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.AuthenticationMiddleware(authService))

	router.GET("/website/meta", websiteController.GetMeta)
	router.GET("/website/icons", websiteController.GetIcon)

	router.GET("/system/version", systemController.GetServiceVersion)

	router.POST("/bookmarks", bookmarkController.CreateBookmark)

	router.GET("/sync/incremental/:clientIncrementalId", syncController.GetIncrementalUpdate)
	router.POST("/sync/incremental", syncController.PostIncrementalUpdate)
	router.POST("/sync/init", syncController.Init)

	router.POST("/config", configController.Update)

	router.GET("/auth/oauth-data", authController.GetAllOauthData)

	router.POST("/auth/invitation", authController.AddInvitation)
	router.PUT("/auth/invitation", authController.UpdateInvitation)
	router.DELETE("/auth/invitation/:id", authController.DeleteInvitation)

	router.POST("/invitation/activate/:id", authController.ActivateInvitation)

	return router
}
