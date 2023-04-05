package services

import (
	"net/http"

	"github.com/PuerkitoBio/goquery"
	"github.com/shadowfish07/FlexiBook/utils/parse"
)

type WebsiteService struct {
}

func NewWebsiteService() *WebsiteService {
	return &WebsiteService{}
}

type Meta struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func (ws *WebsiteService) GetMeta(url string) (*Meta, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	title := doc.Find("head > title").First().Text()
	description := doc.Find("head > meta[name=description]").First().AttrOr("content", "")

	return &Meta{
		Title:       title,
		Description: description,
	}, nil
}

func (ws *WebsiteService) GetIcon(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	body, err := parse.GetIcon(doc, url)
	if err != nil {
		return nil, err
	}

	return body, nil
}
