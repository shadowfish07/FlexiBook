package services

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/utils"
)

type BookmarkEntity struct {
	bookmarkService *BookmarkService
}

func NewBookmarkEntity() *BookmarkEntity {
	return &BookmarkEntity{
		bookmarkService: NewBookmarkService(),
	}
}

func getBookmarkFromData(id models.ID, data map[string]interface{}) (*models.Bookmark, error) {
	title, err := utils.GetStringFromMap(data, "title")
	if err != nil {
		return nil, err
	}
	if title == nil {
		return nil, errors.New("title is required")
	}

	url, err := utils.GetStringFromMap(data, "url")
	if err != nil {
		return nil, err
	}
	if url == nil {
		return nil, errors.New("url is required")
	}

	category, err := utils.GetStringFromMap(data, "category")
	if err != nil {
		return nil, err
	}

	idCategory := models.ID(*category)

	tags, err := utils.GetStringSliceFromMap(data, "tags")
	if err != nil {
		return nil, err
	}

	icon, err := utils.GetStringFromMap(data, "icon")
	if err != nil {
		return nil, err
	}

	deletedAt, err := utils.GetInt64FromMap(data, "deletedAt")
	if err != nil {
		return nil, err
	}

	createdAt, err := utils.GetInt64FromMap(data, "createdAt")
	if err != nil {
		return nil, err
	}
	var createAtValue int64
	if createdAt == nil {
		createAtValue = 0
	} else {
		createAtValue = *createdAt
	}

	isFavorite, err := utils.GetBoolFromMap(data, "isFavorite")
	if err != nil {
		return nil, err
	}

	return &models.Bookmark{
		ID:         string(id),
		Title:      *title,
		URL:        *url,
		Category:   &idCategory,
		Tags:       utils.StringSliceToIDSlice(tags),
		Icon:       icon,
		DeletedAt:  deletedAt,
		CreatedAt:  createAtValue,
		IsFavorite: isFavorite,
	}, nil
}

func (be *BookmarkEntity) Create(id models.ID, data map[string]interface{}) error {
	newBookmark, err := getBookmarkFromData(id, data)
	if err != nil {
		return err
	}

	_, err = be.bookmarkService.CreateBookmark(*newBookmark)

	return err
}

func (be *BookmarkEntity) Update(id models.ID, data map[string]interface{}) error {
	updatedBookmark, err := getBookmarkFromData(id, data)
	if err != nil {
		return err
	}

	_, err = be.bookmarkService.UpdateBookmark(id, *updatedBookmark)

	return err
}

func (be *BookmarkEntity) Delete(id models.ID) error {

	return be.bookmarkService.DeleteBookmark(id)
}
