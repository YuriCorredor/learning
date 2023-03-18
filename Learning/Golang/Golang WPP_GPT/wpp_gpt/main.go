package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/url"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Request struct {
	Model     string    `json:"model"`
	Messages  []Message `json:"messages"`
	MaxTokens int       `json:"max_tokens,omitempty"`
}

type Response struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int      `json:"created"`
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Index   int     `json:"index"`
	Message Message `json:"message"`
}

func GenerateText(query string) (string, error) {
	body, err := json.Marshal(Request{
		Model: "gpt-3.5-turbo",
		Messages: []Message{
			{
				Role:    "user",
				Content: query,
			},
		},
		MaxTokens: 100,
	})

	if err != nil {
		return "", err
	}

	request, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(body))

	if err != nil {
		return "", err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "Bearer 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")

	response, err := http.DefaultClient.Do(request)

	if err != nil {
		return "", err
	}

	defer response.Body.Close()

	responseBody, err := io.ReadAll(response.Body)

	if err != nil {
		return "", err
	}

	var responseObject Response
	err = json.Unmarshal(responseBody, &responseObject)

	if err != nil {
		return "", err
	}

	return responseObject.Choices[0].Message.Content, nil
}

func parseBase64RequestData(req string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(req)

	if err != nil {
		return "", err
	}

	return string(decoded), nil
}

func parseTwillioRequest(req string) (string, error) {
	decoded, err := parseBase64RequestData(req)

	if err != nil {
		return "", err
	}

	data, err := url.ParseQuery(decoded)

	if err != nil {
		return "", err
	}

	if data.Has("Body") {
		return data.Get("Body"), nil
	}

	return "", errors.New("twillio request does not contain a Body field")
}

func handleEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	result, err := parseTwillioRequest(request.Body)

	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       err.Error(),
		}, nil
	}

	text, err := GenerateText(result)

	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       err.Error(),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       text,
	}, nil
}

func main() {
	lambda.Start(handleEvent)
}
