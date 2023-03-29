package main

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/routes"
)

func setupRouter() *gin.Engine {
	router := gin.Default()

	routes.RegisterRoutes(router)

	return router
}

func main() {
	router := gin.Default()

	routes.RegisterRoutes(router)

	router.Run(":8080")
}
