//go:build wireinject
// +build wireinject

package wire

import (
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"github.com/shadowfish07/FlexiBook/controllers"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/routes"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/storage"
	"github.com/spf13/afero"
)

var controllerSet = wire.NewSet(
	controllers.NewBookmarkController,
	controllers.NewSyncController,
	controllers.NewSystemController,
	controllers.NewWebsiteController,
	controllers.NewConfigController,
	controllers.NewAuthController,
)

var repositorySet = wire.NewSet(
	repositories.NewBookmarkRepository,
	repositories.NewCategoryRepository,
	repositories.NewOperationRepository,
	repositories.NewTagRepository,
	repositories.NewSyncRepository,
	repositories.NewConfigRepository,
	repositories.NewOauthRepository,
	repositories.NewInvitationRepository,
)

var serviceSet = wire.NewSet(
	services.NewEntity,
	services.NewBookmarkEntity,
	services.NewCategoryEntity,
	services.NewTagEntity,
	services.NewBookmarkService,
	services.NewCategoryService,
	services.NewTagService,
	services.NewWebsiteService,
	services.NewSyncService,
	services.NewConfigService,
	services.NewAuthService,
	services.NewInvitationService,
)

var storageSet = wire.NewSet(
	storage.NewDatabase,
	storage.NewOperation,
	storage.NewOauth,
	NewStorageWithAfero,
)

func InitializeApp(mountDir string, useMemoryFs bool) (*gin.Engine, error) {
	wire.Build(
		routes.RegisterRoutes,
		controllerSet,
		repositorySet,
		serviceSet,
		storageSet,
	)
	return &gin.Engine{}, nil
}

func NewStorageWithAfero(mountDir string, useMemoryFs bool) *storage.Storage {
	var fs afero.Fs
	if useMemoryFs {
		fs = afero.NewMemMapFs()
	} else {
		fs = afero.NewOsFs()
	}
	return storage.NewStorage(mountDir, fs)
}
