package services

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type CategoryService struct {
	categoryRepository *repositories.CategoryRepository
}

func NewCategoryService() *CategoryService {
	return &CategoryService{
		categoryRepository: repositories.NewCategoryRepository(),
	}
}

func (cs *CategoryService) newCategory(category models.Category) (*models.Category, error) {
	uuidV4, _ := uuid.NewRandom()

	if category.ID == "" {
		category.ID = uuidV4.String()
	}
	if category.CreatedAt == 0 {
		category.CreatedAt = utils.GetTimestamp()
	}

	if existingCategory, _ := cs.GetCategory(models.ID(category.ID)); existingCategory != nil {
		return nil, errors.New("ID already exists")
	}

	err := validator.New().Struct(category)
	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (cs *CategoryService) CreateCategory(categoryParams models.Category) (*models.Category, error) {
	category, err := cs.newCategory(categoryParams)

	if err != nil {
		return nil, err
	}

	err = cs.categoryRepository.Save(*category)

	return category, err
}

func (cs *CategoryService) GetCategory(id models.ID) (*models.Category, error) {
	category, err := cs.categoryRepository.Get(id)
	return category, err
}

func (cs *CategoryService) UpdateCategory(id models.ID, categoryParams models.Category) (*models.Category, error) {
	category, err := cs.categoryRepository.Get(id)
	if err != nil {
		return nil, err
	}

	if categoryParams.Title != "" {
		category.Title = categoryParams.Title
	}
	if categoryParams.Icon != nil {
		category.Icon = categoryParams.Icon
	}
	if categoryParams.ParentID != nil {
		category.ParentID = categoryParams.ParentID
	}
	if categoryParams.DeletedAt != nil {
		category.DeletedAt = categoryParams.DeletedAt
	}
	if categoryParams.Children != nil {
		category.Children = categoryParams.Children
	}

	err = cs.categoryRepository.Save(*category)

	return category, err
}

func (cs *CategoryService) DeleteCategory(id models.ID) error {
	category, err := cs.categoryRepository.Get(id)
	if err != nil {
		return err
	}

	timestamp := utils.GetTimestamp()

	category.DeletedAt = &timestamp

	return cs.categoryRepository.Save(*category)
}
