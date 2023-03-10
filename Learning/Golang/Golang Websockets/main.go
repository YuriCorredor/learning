package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var conns []*websocket.Conn

func main() {
	app := fiber.New()

	// Websocket route
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("websocket", true)
			return c.Next()
		}
		return c.SendStatus(fiber.StatusUpgradeRequired)
	})

	// Websocket handler
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		// Add connection to list
		conns = append(conns, c)

		for {
			// Read message as string
			msgType, msg, err := c.ReadMessage()
			if err != nil {
				println(err)
				break
			}

			// Write message back
			if err := c.WriteMessage(msgType, msg); err != nil {
				println(err)
				break
			}
		}
	}))

	// Start server
	app.Listen(":3000")
}
