package parse

import (
	"errors"
	"io"
	"log"
	"net/http"
	urlUtil "net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func GetIcon(doc *goquery.Document, url string) ([]byte, error) {
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
