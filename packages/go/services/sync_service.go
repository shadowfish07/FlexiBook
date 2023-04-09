package services

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type SyncService struct {
	operationRepository *repositories.OperationRepository
	bookmarkService     *BookmarkService
	entity              *Entity
	syncRepository      *repositories.SyncRepository
	configRepository    *repositories.ConfigRepository
	configService       *ConfigService
}

func NewSyncService(operationRepository *repositories.OperationRepository,
	bookmarkService *BookmarkService,
	entity *Entity,
	syncRepository *repositories.SyncRepository,
	configRepository *repositories.ConfigRepository,
	configService *ConfigService) *SyncService {
	return &SyncService{
		operationRepository: operationRepository,
		bookmarkService:     bookmarkService,
		entity:              entity,
		syncRepository:      syncRepository,
		configRepository:    configRepository,
		configService:       configService,
	}
}

func (ss *SyncService) GetIncrementalUpdate(clientIncrementalId int64) (models.OperationList, error) {
	return ss.operationRepository.GetAfter(clientIncrementalId)
}

// 新的增量更新会被添加到operation list的末尾，并返回新增量更新原ID到最新末尾的所有操作(不包含自己)
// 比如
// 现有的operation list为 [1,2,3,4,5,6,7,8,9,10]
// 新增的operation为 11 （新增的operation是11，会在本次返回)
// 则返回的operation list为 [11]
// 如果新增的operation为 6 （新增的operation是11，会在本次返回)
// 则返回的operation list为 [6,7,8,9,10,11]
// 返回新增的operation的原因是为了让客户端知道最新的递增ID
func (ss *SyncService) AddIncrementalUpdate(operation models.Operation) (models.OperationList, error) {
	afterOperations, err := ss.operationRepository.GetAfter(operation.Id + 1)
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

	if err := ss.processOperation(operation); err != nil {
		return nil, err
	}

	ss.operationRepository.Add(operation)
	return finalOperation, nil
}

func (ss *SyncService) Init(config *models.Config) error {
	clientInfo, err := ss.configRepository.GetClientInfo()
	if err != nil {
		return err
	}
	if clientInfo != nil && clientInfo.ClientId != "" && clientInfo.ClientSecret != "" {
		return errors.New("you have already init. if you want to re-init, please delete all data files")
	}

	err = ss.syncRepository.Init(&models.Database{
		Tags:       make(models.Tags),
		Bookmarks:  make(models.Bookmarks),
		Categories: make(models.Categories),
		Config:     *config,
	})
	if err != nil {
		return err
	}

	return ss.configService.SetEnableSync(true)
}

func (ss *SyncService) processOperation(operation models.Operation) error {
	for _, action := range operation.Actions {
		err := ProcessAction(ss.entity.CreateEntity(action.Entity), action.EntityId, action.Type, action.Data)
		if err != nil {
			return err
		}
	}

	return nil
}
