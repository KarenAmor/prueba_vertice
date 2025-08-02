package config

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
)

type SupabaseClient struct {
	URL    string
	APIKey string
	Client *http.Client
}

var Supabase *SupabaseClient

func InitSupabase() {
	Supabase = &SupabaseClient{
		URL:    os.Getenv("SUPABASE_URL"),
		APIKey: os.Getenv("SUPABASE_ANON_KEY"),
		Client: &http.Client{},
	}
}

func (s *SupabaseClient) makeRequest(method, endpoint string, body interface{}, headers map[string]string) (*http.Response, error) {
	var reqBody io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewBuffer(jsonBody)
	}

	req, err := http.NewRequest(method, s.URL+"/rest/v1/"+endpoint, reqBody)
	if err != nil {
		return nil, err
	}

	// Headers por defecto
	req.Header.Set("apikey", s.APIKey)
	req.Header.Set("Authorization", "Bearer "+s.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	// Headers adicionales
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	return s.Client.Do(req)
}

func (s *SupabaseClient) Select(table string, query string) (*http.Response, error) {
	endpoint := table
	if query != "" {
		endpoint += "?" + query
	}
	return s.makeRequest("GET", endpoint, nil, nil)
}

func (s *SupabaseClient) Insert(table string, data interface{}) (*http.Response, error) {
	return s.makeRequest("POST", table, data, nil)
}

func (s *SupabaseClient) Update(table string, data interface{}, query string) (*http.Response, error) {
	endpoint := table
	if query != "" {
		endpoint += "?" + query
	}
	return s.makeRequest("PATCH", endpoint, data, nil)
}

func (s *SupabaseClient) Delete(table string, query string) (*http.Response, error) {
	endpoint := table
	if query != "" {
		endpoint += "?" + query
	}
	return s.makeRequest("DELETE", endpoint, nil, nil)
}

func (s *SupabaseClient) Auth(endpoint string, data interface{}) (*http.Response, error) {
	var reqBody io.Reader
	if data != nil {
		jsonBody, err := json.Marshal(data)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewBuffer(jsonBody)
		log.Printf("Supabase Auth Request Body: %s", string(jsonBody))
	}

	req, err := http.NewRequest("POST", s.URL+"/auth/v1/"+endpoint, reqBody)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", s.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Info", "supabase-go")

	return s.Client.Do(req)
}
