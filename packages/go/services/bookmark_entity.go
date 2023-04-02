package services

import (
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

func (be *BookmarkEntity) Create(id models.ID, data map[string]interface{}) error {
	title, err := utils.GetStringFromMap(data, "title")
	if err != nil {
		return err
	}

	url, err := utils.GetStringFromMap(data, "url")
	if err != nil {
		return err
	}

	category, err := utils.GetStringFromMap(data, "category")
	if err != nil {
		return err
	}

	tags, err := utils.GetStringSliceFromMap(data, "tags")
	if err != nil {
		return err
	}

	icon, err := utils.GetStringFromMap(data, "icon")
	if err != nil {
		return err
	}

	deletedAt, err := utils.GetInt64FromMap(data, "deletedAt")
	if err != nil {
		return err
	}

	createdAt, err := utils.GetInt64FromMap(data, "createdAt")
	if err != nil {
		return err
	}

	isFavorite, err := utils.GetBoolFromMap(data, "isFavorite")
	if err != nil {
		return err
	}
	be.bookmarkService.CreateBookmark(models.Bookmark{
		ID:         string(id),
		Title:      title,
		URL:        url,
		Category:   models.ID(category),
		Tags:       utils.StringSliceToIDSlice(tags),
		Icon:       &icon,
		DeletedAt:  &deletedAt,
		CreatedAt:  createdAt,
		IsFavorite: &isFavorite,
	})

	return nil
}

func (be *BookmarkEntity) Update(id models.ID, data map[string]interface{}) error {
	return nil
}

func (be *BookmarkEntity) Delete(id models.ID, data map[string]interface{}) error {
	return nil
}
