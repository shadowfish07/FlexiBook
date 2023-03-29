package main

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/routes"
)

func main() {
	router := gin.Default()

	routes.RegisterRoutes(router)

	router.Run(":8080")
}
