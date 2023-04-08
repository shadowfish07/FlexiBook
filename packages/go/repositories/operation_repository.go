package repositories

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type OperationRepository struct {
	operationStorage *storage.Operation
}

func NewOperationRepository(operationStorage *storage.Operation) *OperationRepository {
	return &OperationRepository{
		operationStorage: operationStorage,
	}
}

func (or *OperationRepository) GetAll() (models.OperationList, error) {
	return or.operationStorage.Get()
}

func (or *OperationRepository) Add(value models.Operation) error {
	operations, err := or.GetAll()
	if err != nil {
		return err
	}

	operations = append(operations, value)

	return or.operationStorage.Save(operations)
}

func (or *OperationRepository) GetLatestId() (int64, error) {
	operations, err := or.GetAll()
	if err != nil {
		return 0, err
	}

	if len(operations) == 0 {
		return 0, nil
	}

	return operations[len(operations)-1].Id, nil
}

func (or *OperationRepository) GetAfter(id int64) (models.OperationList, error) {
	operations, err := or.GetAll()
	if err != nil {
		return nil, err
	}

	var result models.OperationList
	for _, operation := range operations {
		if operation.Id >= id {
			result = append(result, operation)
		}
	}

	return result, nil
}
