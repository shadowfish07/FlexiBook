package main

import (
	"net/http"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/utils/parse"
)

func setupRouter() *gin.Engine {
	result := gin.Default()

	result.GET("/website/meta", func(ctx *gin.Context) {
		url := ctx.Query("url")

		if url == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "url is required",
			})
			return
		}

		resp, err := http.Get(url)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		doc, err := goquery.NewDocumentFromReader(resp.Body)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		title := doc.Find("head > title").First().Text()
		description := doc.Find("head > meta[name=description]").First().AttrOr("content", "")
		ctx.JSON(http.StatusOK, gin.H{"title": title, "description": description})
	})

	result.GET("/website/icons", func(ctx *gin.Context) {
		url := ctx.Query("url")

		if url == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "url is required",
			})
			return
		}

		resp, err := http.Get(url)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		doc, err := goquery.NewDocumentFromReader(resp.Body)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		body, err := parse.GetIcon(doc, url)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.Data(http.StatusOK, "image/x-icon", body)
	})

	return result
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
