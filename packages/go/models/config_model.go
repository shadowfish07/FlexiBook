package models

type Config struct {
	DefaultCategory struct {
		Title string `json:"title" binding:"required"`
		Icon  string `json:"icon" binding:"required"`
	} `json:"defaultCategory"`
	Favorite struct {
		Title string `json:"title" binding:"required"`
		Icon  string `json:"icon" binding:"required"`
	} `json:"favorite"`
	ClientId     string  `json:"clientId" binding:"required"`
	ClientSecret string  `json:"clientSecret" binding:"required"`
	EnableSync   bool    `json:"enableSync" binding:"boolean"`
	BackendURL   *string `json:"backendURL,omitempty" binding:"omitempty,url"`
}

type ClientInfo struct {
	ClientId     string `json:"clientId"`
	ClientSecret string `json:"clientSecret"`
}
