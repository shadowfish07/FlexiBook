package services

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type SyncService struct {
	operationRepository *repositories.OperationRepository
	bookmarkService     *BookmarkService
	entity              *Entity
}

func NewSyncService(operationRepository *repositories.OperationRepository,
	bookmarkService *BookmarkService, entity *Entity) *SyncService {
	return &SyncService{
		operationRepository: operationRepository,
		bookmarkService:     bookmarkService,
		entity:              entity,
	}
}

func (ss *SyncService) GetIncrementalUpdate(clientIncrementalId int64) (models.OperationList, error) {
	return ss.operationRepository.GetAfter(clientIncrementalId)
}

// 新的增量更新会被添加到operation list的末尾，并返回新增量更新原ID到最新末尾的所有操作(不包含自己)
// 比如
// 现有的operation list为 [1,2,3,4,5,6,7,8,9,10]
// 新增的operation为 11 （新增的operation是11，但不会在本次返回)
// 则返回的operation list为 []
// 如果新增的operation为 6 （新增的operation是11，但不会在本次返回)
// 则返回的operation list为 [6,7,8,9,10]
func (ss *SyncService) AddIncrementalUpdate(operation models.Operation) (models.OperationList, error) {
	afterOperations, err := ss.operationRepository.GetAfter(operation.Id)
	if err != nil {
		return nil, err
	}

	latestId, err := ss.operationRepository.GetLatestId()
	if err != nil {
		return nil, err
	}
	operation.Id = latestId + 1
	operation.CreateAt = utils.GetTimestamp()

	finalOperation := append(afterOperations, operation)

	if err := ss.sync(finalOperation); err != nil {
		return nil, err
	}

	ss.operationRepository.Add(operation)
	return afterOperations, nil
}

func (ss *SyncService) sync(operations models.OperationList) error {
	processOperation := func(operation models.Operation) error {
		for _, action := range operation.Actions {
			err := ProcessAction(ss.entity.CreateEntity(action.Entity), action.EntityId, action.Type, action.Data)
			if err != nil {
				return err
			}
		}

		return nil
	}

	for _, operation := range operations {
		err := processOperation(operation)
		if err != nil {
			return err
		}
	}

	return nil
}
