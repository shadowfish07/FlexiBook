package models

type Config struct {
	DefaultCategory struct {
		Title string `json:"title"`
		Icon  string `json:"icon"`
	} `json:"defaultCategory"`
	Favorite struct {
		Title string `json:"title"`
		Icon  string `json:"icon"`
	} `json:"favorite"`
	ClientId     string  `json:"clientId"`
	ClientSecret string  `json:"clientSecret"`
	BackendURL   *string `json:"backendURL,omitempty"`
}
