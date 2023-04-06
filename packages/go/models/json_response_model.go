package models

type JSONResponse struct {
	Status string      `json:"status"`
	Data   interface{} `json:"data"`
}
