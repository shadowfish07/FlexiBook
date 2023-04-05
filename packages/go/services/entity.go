package services

import (
	"fmt"

	"github.com/shadowfish07/FlexiBook/models"
)

type Entity interface {
	Create(id models.ID, data map[string]interface{}) error
	Update(id models.ID, data map[string]interface{}) error
	Delete(id models.ID) error
}

func NewEntity(entityType string) Entity {
	switch entityType {
	case models.OperationActionEntityBookmark:
		return NewBookmarkEntity()
	case models.OperationActionEntityCategory:
		return NewCategoryEntity()
	case models.OperationActionEntityTag:
		return NewTagEntity()
	default:
		return nil
	}
}

func ProcessAction(entity Entity, entityId models.ID, actionType string, data map[string]interface{}) error {
	switch actionType {
	case models.OperationActionTypeCreate:
		return entity.Create(entityId, data)
	case models.OperationActionTypeUpdate:
		return entity.Update(entityId, data)
	case models.OperationActionTypeDelete:
		return entity.Delete(entityId)
	default:
		return fmt.Errorf("invalid action type: %s", actionType)
	}
}
