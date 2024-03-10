package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Game struct represents the game object
type Game struct {
    Players             []string  `json:"players"`
    Balance             []float64 `json:"balance"`
    History             []GameLog `json:"history"`
    AmountBeersConsumed int       `json:"amountBeersConsumed"`
    BetSize             float64   `json:"betSize"`
}

// GameLog represents a single game entry in the history
type GameLog struct {
    Players             []string  `json:"players"`
    Balance             []float64 `json:"balance"`
    AmountBeersConsumed int       `json:"amountBeersConsumed"`
    BetSize             float64   `json:"betSize"`
}

var savedGame *Game

func main() {
    http.HandleFunc("/save", saveHandler)
    http.HandleFunc("/load", loadHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func saveHandler(w http.ResponseWriter, r *http.Request) {
    // Decode the request body to get the game object
    var game Game
    err := json.NewDecoder(r.Body).Decode(&game)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Save the game object
    savedGame = &game
    w.WriteHeader(http.StatusOK)
    fmt.Fprintf(w, "Game saved successfully")
}

func loadHandler(w http.ResponseWriter, r *http.Request) {
    // Check if a game is saved
    if savedGame == nil {
        http.Error(w, "No game saved", http.StatusNotFound)
        return
    }

    // Encode the saved game object to JSON
    jsonData, err := json.Marshal(savedGame)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Send the JSON data in the response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}
