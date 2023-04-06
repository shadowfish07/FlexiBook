package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/wire"
	"github.com/stretchr/testify/assert"
)

func sendRequest(engine *gin.Engine, method, url string, jsonStr string) *httptest.ResponseRecorder {
	// 将字符串转换为io.Reader
	body := bytes.NewReader([]byte(jsonStr))
	req, _ := http.NewRequest(method, url, body)

	// 创建一个响应记录器
	w := httptest.NewRecorder()

	engine.ServeHTTP(w, req)

	return w
}

func sendRequestAndParseResponse(t *testing.T, engine *gin.Engine, method, url, jsonStr string) (*httptest.ResponseRecorder, models.JSONResponse) {
	w := sendRequest(engine, method, url, jsonStr)

	var response models.JSONResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Logf("Failed to unmarshal JSON response: %v", err)
	}

	return w, response
}

func TestGetIncrementalUpdate(t *testing.T) {
	engine, err := wire.InitializeApp("data", true)

	if err != nil {
		t.Fatalf("Failed to initialize app with memory fs: %v", err)
	}

	gin.SetMode(gin.TestMode) // 设置Gin为测试模式，这将禁用控制台日志输出

	req, _ := http.NewRequest("GET", "/sync/incremental/1", nil)

	// 创建一个响应记录器
	w := httptest.NewRecorder()

	engine.ServeHTTP(w, req)

	// 检查响应以确保它符合预期
	assert.Equal(t, http.StatusOK, w.Code, "Status code should be OK")

	expectedResponse := models.JSONResponse{
		Status: "success",
	}

	var response models.JSONResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal JSON response: %v", err)
	}

	assert.Equal(t, expectedResponse, response, "Data should be null")

}

func TestPostIncrementalUpdate(t *testing.T) {
	os.RemoveAll("/home/shadowfish/git/FlexiBook/packages/go/controllers/test_data")
	engine, err := wire.InitializeApp("test_data", false)

	if err != nil {
		t.Fatalf("Failed to initialize app with memory fs: %v", err)
	}

	gin.SetMode(gin.TestMode) // 设置Gin为测试模式，这将禁用控制台日志输出

	var jsonStr = [...]string{`{
		"id": 1,
		"uniqueId": "cSZZXlTZoKMfmto58jPG2",
		"clientId": "mcOuzRW2ayunS0nJzYaAp",
		"createdAt": 1680697987067,
		"actions": [
		  {
			"type": "create",
			"entity": "bookmarks",
			"entityId": "SJFaIWjX0ntZhJViYP_qA",
			"data": {
			  "title":"google",
			  "url":"http://google.com",
			  "icon": "BT8jHQIA-qn3dAC2VNLvV"
			}
		  }
		]
	  }`, `{
		"id": 1,
		"uniqueId": "cSZZXlTZoKMfmto58jPG3",
		"clientId": "mcOuzRW2ayunS0nJzYaAp",
		"createdAt": 1680697987067,
		"actions": [
		  {
			"type": "create",
			"entity": "categories",
			"entityId": "SJFaIWjX0ntZhJViYP_qA",
			"data": {
			  "title":"google",
			  "icon":"http://google.com"
			}
		  }
		]
	  }`, `{
		"id": 1,
		"uniqueId": "cSZZXlTZoKMfmto58jPG4",
		"clientId": "mcOuzRW2ayunS0nJzYaAp",
		"createdAt": 1680697987067,
		"actions": [
		  {
			"type": "create",
			"entity": "tags",
			"entityId": "SJFaIWjX0ntZhJViYP_qA",
			"data": {
			  "title":"google",
			  "color":"red"
			}
		  }
		]
	  }`}

	for _, str := range jsonStr {
		testCases := []struct {
			jsonStr            string
			expectedStatusCode int
			expectedStatus     string
		}{
			{str, http.StatusOK, "success"},
			{str, http.StatusInternalServerError, "error"},
		}

		for _, tc := range testCases {
			w, response := sendRequestAndParseResponse(t, engine, "POST", "/sync/incremental", tc.jsonStr)

			assert.Equal(t, tc.expectedStatusCode, w.Code, "Status code should match expected")
			if !assert.Equal(t, tc.expectedStatus, response.Status, "Status should match expected") {
				assert.FailNow(t, "expectedStatus not right")
			}
		}
	}

}
