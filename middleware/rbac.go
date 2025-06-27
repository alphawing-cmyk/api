package middleware

import (
	"api/constants"
	"net/http"
)

func RBAC(allowedRoles ...constants.ServiceEnum) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			next.ServeHTTP(w, r)
		})
	}
}

func hasAnyRole(role string, allowedRoles []constants.ServiceEnum) bool {
	for _, r := range allowedRoles {
		if role == string(r) {
			return true
		}
	}

	return false
}
