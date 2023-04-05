package services

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/utils"
)

type CategoryEntity struct {
	categoryService *CategoryService
}

func NewCategoryEntity() *CategoryEntity {
	return &CategoryEntity{
		categoryService: NewCategoryService(),
	}
}

func getCategoryFromData(id models.ID, data map[string]interface{}) (*models.Category, error) {
	title, err := utils.GetStringFromMap(data, "title")
	if err != nil {
		return nil, err
	}
	if title == nil {
		return nil, errors.New("title is required")
	}

	icon, err := utils.GetStringFromMap(data, "icon")
	if err != nil {
		return nil, err
	}

	parent, err := utils.GetStringFromMap(data, "parentId")
	if err != nil {
		return nil, err
	}

	parentId := models.ID(*parent)

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

	children, err := utils.GetStringSliceFromMap(data, "children")
	if err != nil {
		return nil, err
	}

	return &models.Category{
		ID:        string(id),
		Title:     *title,
		Icon:      icon,
		ParentID:  &parentId,
		Children:  utils.StringSliceToIDSlice(children),
		DeletedAt: deletedAt,
		CreatedAt: createAtValue,
	}, nil
}

func (ce *CategoryEntity) Create(id models.ID, data map[string]interface{}) error {
	newCategory, err := getCategoryFromData(id, data)
	if err != nil {
		return err
	}

	_, err = ce.categoryService.CreateCategory(*newCategory)

	return err
}

func (ce *CategoryEntity) Update(id models.ID, data map[string]interface{}) error {
	updatedBookmark, err := getCategoryFromData(id, data)
	if err != nil {
		return err
	}

	_, err = ce.categoryService.UpdateCategory(id, *updatedBookmark)

	return err
}

func (ce *CategoryEntity) Delete(id models.ID) error {

	return ce.categoryService.DeleteCategory(id)
}
