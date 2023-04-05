package models

type OperationAction struct {
	Type     string                 `json:"type" binding:"required,oneof=update create delete"`
	Entity   string                 `json:"entity" binding:"required,oneof=bookmarks categories tags"`
	EntityId ID                     `json:"entityId" binding:"required"`
	Data     map[string]interface{} `json:"data" binding:"required"`
}

type Operation struct {
	Id           int64             `json:"id" binding:"required,number"`
	UniqueId     string            `json:"uniqueId" binding:"required,uuid"`
	CreateAt     int64             `json:"createAt" binding:"required,number"`
	ClientId     ID                `json:"clientId" binding:"required"`
	ClientSecret ID                `json:"clientSecret" binding:"required"`
	Actions      []OperationAction `json:"actions" binding:"required,dive"`
}

type PartialOperation struct {
	Id           int64             `json:"id" binding:"required,number"`
	UniqueId     *string           `json:"uniqueId" binding:"omitempty,uuid"`
	CreateAt     *int64            `json:"createAt" binding:"omitempty,number"`
	ClientId     ID                `json:"clientId" binding:"required"`
	ClientSecret ID                `json:"clientSecret" binding:"required"`
	Actions      []OperationAction `json:"actions" binding:"required,dive"`
}

type OperationList []Operation

var OperationActionTypeCreate = "create"
var OperationActionTypeUpdate = "update"
var OperationActionTypeDelete = "delete"
var OperationActionEntityBookmark = "bookmarks"
var OperationActionEntityCategory = "categories"
var OperationActionEntityTag = "tags"
