package models

type Oauth struct {
	Nickname   string      `json:"nickname"`
	OauthItems []OauthItem `json:"oauthItems"`
}

type OauthItem struct {
	ClientId   string `json:"clientId" binding:"required"`
	Secret     string `json:"secret" binding:"required"`
	Nickname   string `json:"nickname"`
	UniquePath string `json:"uniquePath" binding:"required"`
	DeletedAt  *int64 `json:"deletedAt,omitempty" binding:"omitempty,number"`
	CreatedAt  int64  `json:"createdAt" binding:"required,number"`
}
