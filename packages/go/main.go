package main

import (
	"errors"
	"io"
	"log"
	"net/http"
	urlUtil "net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
)

func getIcon(doc *goquery.Document, url string) ([]byte, error) {
	strategies := []func(*goquery.Document, string) (*http.Response, error){
		getIconByFavicon,
		getIconByLinkShortCut,
		getIconByLink,
	}

	for index, function := range strategies {
		log.Default().Println("try strategy", index)
		iconResp, err := function(doc, url)
		if err != nil {
			continue
		}

		body, err := io.ReadAll(iconResp.Body)
		if err != nil {
			continue
		}

		return body, nil
	}

	return nil, errors.New("no icon found")
}

func getIconByFavicon(_ *goquery.Document, url string) (*http.Response, error) {
	parsedUrl, err := urlUtil.Parse(url)
	if err != nil {
		return nil, err
	}

	iconPath, err := urlUtil.JoinPath(parsedUrl.Host, "favicon.ico")
	if err != nil {
		return nil, err
	}

	iconUrl := parsedUrl.Scheme + "://" + iconPath

	iconResp, err := http.Get(iconUrl)
	if err != nil {
		return nil, err
	}
	if iconResp.StatusCode != http.StatusOK || !strings.HasPrefix(iconResp.Header.Get("Content-Type"), "image") {
		return nil, errors.New("not a valid icon")
	}
	return iconResp, nil
}

func getIconByLink(doc *goquery.Document, url string) (*http.Response, error) {
	icon := doc.Find("head > link[rel='icon']").AttrOr("href", "")

	parsedUrl, err := urlUtil.Parse(url)
	if err != nil {
		return nil, err
	}

	iconPath, err := urlUtil.JoinPath(parsedUrl.Host, icon)
	if err != nil {
		return nil, err
	}

	iconUrl := parsedUrl.Scheme + "://" + iconPath

	iconResp, err := http.Get(iconUrl)
	if err != nil {
		return nil, err
	}
	if iconResp.StatusCode != http.StatusOK || !strings.HasPrefix(iconResp.Header.Get("Content-Type"), "image") {
		return nil, errors.New("not a valid icon")
	}
	return iconResp, nil
}

func getIconByLinkShortCut(doc *goquery.Document, url string) (*http.Response, error) {
	icon := doc.Find("head > link[rel='shortcut icon']").AttrOr("href", "")

	parsedUrl, err := urlUtil.Parse(url)
	if err != nil {
		return nil, err
	}

	iconPath, err := urlUtil.JoinPath(parsedUrl.Host, icon)
	if err != nil {
		return nil, err
	}

	iconUrl := parsedUrl.Scheme + "://" + iconPath

	iconResp, err := http.Get(iconUrl)
	if err != nil {
		return nil, err
	}
	if iconResp.StatusCode != http.StatusOK || !strings.HasPrefix(iconResp.Header.Get("Content-Type"), "image") {
		return nil, errors.New("not a valid icon")
	}
	return iconResp, nil
}

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

		// body, err := io.ReadAll(resp.Body)
		// if err != nil {
		// 	ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		// 	return
		// }

		// fmt.Printf("%s \n", body)

		// ctx.PureJSON(http.StatusOK, gin.H{"url": url, "meta": string(body)})
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

		body, err := getIcon(doc, url)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.Data(http.StatusOK, "image/x-icon", body)
	})

	return result
}

// func setupRouter() *gin.Engine {
// 	// Disable Console Color
// 	// gin.DisableConsoleColor()
// 	r := gin.Default()

// 	// Ping test
// 	r.GET("/ping", func(c *gin.Context) {
// 		c.String(http.StatusOK, "pong")
// 	})

// 	// Get user value
// 	r.GET("/user/:name", func(c *gin.Context) {
// 		user := c.Params.ByName("name")
// 		value, ok := db[user]
// 		if ok {
// 			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
// 		} else {
// 			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
// 		}
// 	})

// 	// Authorized group (uses gin.BasicAuth() middleware)
// 	// Same than:
// 	// authorized := r.Group("/")
// 	// authorized.Use(gin.BasicAuth(gin.Credentials{
// 	//	  "foo":  "bar",
// 	//	  "manu": "123",
// 	//}))
// 	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
// 		"foo":  "bar", // user:foo password:bar
// 		"manu": "123", // user:manu password:123
// 	}))

// 	/* example curl for /admin with basicauth header
// 	   Zm9vOmJhcg== is base64("foo:bar")

// 		curl -X POST \
// 	  	http://localhost:8080/admin \
// 	  	-H 'authorization: Basic Zm9vOmJhcg==' \
// 	  	-H 'content-type: application/json' \
// 	  	-d '{"value":"bar"}'
// 	*/
// 	authorized.POST("admin", func(c *gin.Context) {
// 		user := c.MustGet(gin.AuthUserKey).(string)

// 		// Parse JSON
// 		var json struct {
// 			Value string `json:"value" binding:"required"`
// 		}

// 		if c.Bind(&json) == nil {
// 			db[user] = json.Value
// 			c.JSON(http.StatusOK, gin.H{"status": "ok"})
// 		}
// 	})

// 	return r
// }

func main() {
	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}
