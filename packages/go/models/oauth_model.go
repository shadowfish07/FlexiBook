package models

type Oauth struct {
	Nickname                 string                   `json:"nickname"`
	OauthItems               []OauthItem              `json:"oauthItems"`
	Invitations              []Invitation             `json:"invitations"`
	InvitationUsageHistories []InvitationUsageHistory `json:"invitationUsageHistories"`
}

type OauthItem struct {
	ClientId    string       `json:"clientId" binding:"required"`
	Secret      string       `json:"secret" binding:"required"`
	Nickname    string       `json:"nickname"`
	DeletedAt   *int64       `json:"deletedAt,omitempty" binding:"omitempty,number"`
	CreatedAt   int64        `json:"createdAt" binding:"required,number"`
	Permissions []Permission `json:"permissions"`
}

type InvitationUsageHistory struct {
	ClientId     string `json:"clientId" binding:"required"`
	InvitationId string `json:"invitationId"`
	CreatedAt    int64  `json:"createdAt" binding:"required,number"`
}

type Invitation struct {
	Id                 string       `json:"id" binding:"required"`
	Password           string       `json:"password"`
	DeletedAt          *int64       `json:"deletedAt,omitempty" binding:"omitempty,number"`
	CreatedAt          int64        `json:"createdAt" binding:"required,number"`
	UsesLimit          int64        `json:"usesLimit" binding:"omitempty,number"`
	UsesUntil          int64        `json:"usesUntil" binding:"omitempty,number"`
	DefaultPermissions []Permission `json:"defaultPermissions"`
}

type Permission struct {
	Entity       string `json:"entity" binding:"required,oneof=categories tags"`
	EntityId     string `json:"entityId" binding:"required"`
	AllowEdit    bool   `json:"allowEdit" binding:"bool"`
	InvitationId string `json:"invitationId" binding:"bool"`
}

type ActivateInvitationRequest struct {
	Password *string `json:"password"`
	Nickname string  `json:"nickname" binding:"required"`
}
