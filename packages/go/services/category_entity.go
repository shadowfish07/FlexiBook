package services

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/utils"
)

type CategoryEntity struct {
	categoryService *CategoryService
}

func NewCategoryEntity(categoryService *CategoryService) *CategoryEntity {
	return &CategoryEntity{
		categoryService: categoryService,
	}
}

func getCategoryFromData(id models.ID, data map[string]interface{}, isCreate bool) (*models.Category, error) {
	title, err := utils.GetStringFromMap(data, "title")
	if err != nil {
		return nil, err
	}
	var finalTitle string = ""
	if title == nil {
		if isCreate {
			return nil, errors.New("title is required")
		}
	} else {
		finalTitle = *title
	}

	icon, err := utils.GetStringFromMap(data, "icon")
	if err != nil {
		return nil, err
	}

	parent, err := utils.GetStringFromMap(data, "parentId")
	if err != nil {
		return nil, err
	}

	var finalParentId *models.ID = nil
	if parent != nil {
		parentId := models.ID(*parent)
		finalParentId = &parentId
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

	children, err := utils.GetStringSliceFromMap(data, "children")
	if err != nil {
		return nil, err
	}

	return &models.Category{
		ID:        string(id),
		Title:     finalTitle,
		Icon:      icon,
		ParentID:  finalParentId,
		Children:  utils.StringSliceToIDSlice(children),
		DeletedAt: deletedAt,
		CreatedAt: createAtValue,
	}, nil
}

func (ce *CategoryEntity) Create(id models.ID, data map[string]interface{}) error {
	newCategory, err := getCategoryFromData(id, data, true)
	if err != nil {
		return err
	}

	_, err = ce.categoryService.CreateCategory(*newCategory)

	return err
}

func (ce *CategoryEntity) Update(id models.ID, data map[string]interface{}) error {
	updatedBookmark, err := getCategoryFromData(id, data, false)
	if err != nil {
		return err
	}

	_, err = ce.categoryService.UpdateCategory(id, *updatedBookmark)

	return err
}

func (ce *CategoryEntity) Delete(id models.ID) error {

	return ce.categoryService.DeleteCategory(id)
}
