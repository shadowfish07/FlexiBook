package main

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/routes"
)

func setupRouter() *gin.Engine {
	router := gin.Default()

	routes.RegisterRoutes(router)

	// result.GET("/website/meta", func(ctx *gin.Context) {
	// 	url := ctx.Query("url")

	// 	if url == "" {
	// 		ctx.JSON(http.StatusBadRequest, gin.H{
	// 			"error": "url is required",
	// 		})
	// 		return
	// 	}

	// 	resp, err := http.Get(url)
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	defer resp.Body.Close()

	// 	doc, err := goquery.NewDocumentFromReader(resp.Body)
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}

	// 	title := doc.Find("head > title").First().Text()
	// 	description := doc.Find("head > meta[name=description]").First().AttrOr("content", "")
	// 	ctx.JSON(http.StatusOK, gin.H{"title": title, "description": description})
	// })

	// result.GET("/website/icons", func(ctx *gin.Context) {
	// 	url := ctx.Query("url")

	// 	if url == "" {
	// 		ctx.JSON(http.StatusBadRequest, gin.H{
	// 			"error": "url is required",
	// 		})
	// 		return
	// 	}

	// 	resp, err := http.Get(url)
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	defer resp.Body.Close()

	// 	doc, err := goquery.NewDocumentFromReader(resp.Body)
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}

	// 	body, err := parse.GetIcon(doc, url)
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}

	// 	ctx.Data(http.StatusOK, "image/x-icon", body)
	// })

	return router
}

func main() {
	router := gin.Default()

	routes.RegisterRoutes(router)

	router.Run(":8080")
}
