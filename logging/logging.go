package logging

import (
	"log"
	"os"
)

var (
	Red   = "\033[31m"
	Reset = "\033[0m"
)

func init() {
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
	log.SetOutput(os.Stderr)
}

func ColorFatal(v ...interface{}) {
	log.Print(Red, v, Reset)
}
