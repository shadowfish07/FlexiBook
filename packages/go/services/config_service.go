package services

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
)

type ConfigService struct {
	configRepository *repositories.ConfigRepository
}

func NewConfigService(configRepository *repositories.ConfigRepository) *ConfigService {
	return &ConfigService{
		configRepository: configRepository,
	}
}

func (sc *ConfigService) Update(config *models.Config) error {
	return sc.configRepository.Save(config)
}

func (sc *ConfigService) SetEnableSync(enable bool) error {
	config, err := sc.configRepository.Get()
	if err != nil {
		return err
	}

	config.EnableSync = enable

	return sc.configRepository.Save(config)
}
