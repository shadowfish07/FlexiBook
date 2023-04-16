package utils

import (
	"time"

	"github.com/shadowfish07/FlexiBook/models"
)

func GetTimestamp() int64 {
	return time.Now().UnixMilli()
}

func PermissionsToMap(permissions []models.Permission) map[string]models.Permission {
	result := make(map[string]models.Permission)
	for _, permission := range permissions {
		result[permission.EntityId] = permission
	}
	return result
}
