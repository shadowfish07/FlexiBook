package repositories

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type CategoryRepository struct {
	database *storage.Database
}

func NewCategoryRepository(database *storage.Database) *CategoryRepository {
	return &CategoryRepository{
		database: database,
	}
}

func (cr *CategoryRepository) Get(id models.ID) (*models.Category, error) {
	db, err := cr.database.Get()
	if err != nil {
		return nil, err
	}

	category, ok := db.Categories[string(id)]
	if !ok {
		return nil, errors.New("category not found")
	}

	return &category, nil
}

func (cr *CategoryRepository) Save(model models.Category) error {
	db, err := cr.database.Get()
	if err != nil {
		return err
	}

	db.Categories[model.ID] = model

	return cr.database.Save(db)
}
