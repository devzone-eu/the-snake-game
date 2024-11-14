package main

import (
	"log"
	"net/http"
)

func main() {
	fileServer := http.FileServer(http.Dir("./web"))
	http.Handle("/", fileServer)

	log.Print("Start listening on port 3000...")

	error := http.ListenAndServe(":3000", nil)

	if (error != nil) {
		log.Fatal(error)
	}
}
