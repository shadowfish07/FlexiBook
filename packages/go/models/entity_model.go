package models

type Entity interface {
	Create(id ID, data map[string]interface{}) error
	Update(id ID, data map[string]interface{}) error
	Delete(id ID) error
}
