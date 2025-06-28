package routes

import (
	"api/constants"
	db "api/db/sqlc"
	"api/logging"
	"api/middleware"
	"api/utils"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

func kvRoutes(r *mux.Router, s *ServiceHandler) {
	subrouter := r.PathPrefix("/kv").Subrouter()

	subrouter.Handle("/all",
		middleware.RBAC(constants.ServiceEnum("ADMIN"), constants.ServiceEnum("SERVICE"))(http.HandlerFunc(s.getPaginatedKvItems))).
		Methods("GET")
	subrouter.Handle("/encrypt",
		middleware.RBAC(constants.ServiceEnum("ADMIN"))(http.HandlerFunc(s.kvEncrypt))).
		Methods("POST")
	subrouter.Handle("/generate/secret",
		middleware.RBAC(constants.ServiceEnum("ADMIN"))(http.HandlerFunc(generateAesSecretHandler))).
		Methods("GET")
	subrouter.Handle("/update",
		middleware.RBAC(constants.ServiceEnum("ADMIN"))(http.HandlerFunc(s.kvUpdate))).
		Methods("PUT")
	subrouter.Handle("/delete",
		middleware.RBAC(constants.ServiceEnum("ADMIN"))(http.HandlerFunc(s.kvDelete))).
		Methods("DELETE")
	subrouter.Handle("/{service}",
		middleware.RBAC(constants.ServiceEnum("ADMIN"))(http.HandlerFunc(s.getKvItemsByUser))).
		Methods("GET")
}

func generateAesSecretHandler(w http.ResponseWriter, r *http.Request) {
	var data = make(map[string]string)
	_, hexKey, err := utils.AesGenerateKey()
	if err != nil {
		http.Error(w, "Could not generate key", http.StatusBadRequest)
		return
	}
	data["key"] = hexKey
	jsonBody, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error converting data", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBody)
}

type EncryptBody struct {
	Key    string `json:"key"`
	Value  string `json:"value"`
	UserID int64  `json:"user_id"`
}

func (s *ServiceHandler) kvEncrypt(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var encryptBody EncryptBody
	var data = make(map[string]string)

	err := json.NewDecoder(r.Body).Decode(&encryptBody)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not decode json data", http.StatusBadRequest)
		return
	}

	encrypted, err := utils.AesEncrypt(os.Getenv("AES_SECRET"), encryptBody.Value)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not encrypt value", http.StatusBadRequest)
		return
	}

	decrypted, err := utils.AesDecrypt(os.Getenv("AES_SECRET"), encrypted)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not decrypt value", http.StatusBadRequest)
		return
	}

	dbParams := db.InsertKvParams{
		Key:    encryptBody.Key,
		Value:  encrypted,
		UserID: encryptBody.UserID,
	}
	err = s.db.queries.InsertKv(ctx, dbParams)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not store kv pair into database", http.StatusBadRequest)
		return
	}

	// Find User
	user, err := s.db.queries.GetUserById(ctx, int32(encryptBody.UserID))

	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not find user for record", http.StatusBadRequest)
		return
	}

	fmt.Println(user.Role)
	if user.Role == "service" {
		message := map[string]interface{}{
			"user_id": encryptBody.UserID,
			"action":  "add",
			"message": "Added a new key, service request updated credentials",
		}

		jsonMessage, err := json.Marshal(message)

		if err != nil {
			logging.ColorFatal(err)
			http.Error(w, "Error converting data", http.StatusInternalServerError)
			return
		}

		err = s.rdp.client.Publish(ctx, fmt.Sprintf("channel_%s", user.Username), jsonMessage).Err()
		if err != nil {
			logging.ColorFatal(err)
			http.Error(w, "Failed to publish message to Redis", http.StatusInternalServerError)
			return
		}
	}

	data["key"] = encryptBody.Key
	data["value"] = encryptBody.Value
	data["encrypted"] = encrypted
	data["decrypted"] = decrypted

	jsonBody, err := json.Marshal(data)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Error converting data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBody)
}

type DeleteItem struct {
	ID int64 `json:"id" validate:"required" name:"id"`
}

func (s *ServiceHandler) kvDelete(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var deleteItem DeleteItem

	err := json.NewDecoder(r.Body).Decode(&deleteItem)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not decode json data", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		return field.Tag.Get("name")
	})

	validationErrors := utils.ValidationErrors(validate, deleteItem)
	if validationErrors != nil {
		logging.ColorFatal(validationErrors)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(validationErrors)
		return
	}

	_, err = s.db.queries.GetKvById(ctx, deleteItem.ID)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not retrieve kv record", http.StatusBadRequest)
		return
	}

	err = s.db.queries.DeleteKvById(ctx, deleteItem.ID)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not delete record", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Successfully deleted record"))
}

type UpdateItem struct {
	ID     int64  `json:"id" validate:"required" name:"id"`
	Key    string `json:"key" validate:"required" name:"key"`
	Value  string `json:"value" validate:"required" name:"value"`
	UserID int64  `json:"user_id" validate:"required" name:"user_id"`
}

func (s *ServiceHandler) kvUpdate(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var updateItem UpdateItem

	err := json.NewDecoder(r.Body).Decode(&updateItem)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not decode json data", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		return field.Tag.Get("name")
	})

	validationErrors := utils.ValidationErrors(validate, updateItem)
	if validationErrors != nil {
		logging.ColorFatal(validationErrors)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(validationErrors)
		return
	}

	encrypted, err := utils.AesEncrypt(os.Getenv("AES_SECRET"), updateItem.Value)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not update data, encrypting the kv pair isn't working", http.StatusBadRequest)
		return
	}

	updateKvParams := db.UpdateKvParams{
		ID:     updateItem.ID,
		Key:    updateItem.Key,
		Value:  encrypted,
		UserID: updateItem.UserID,
	}

	err = s.db.queries.UpdateKv(ctx, updateKvParams)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could not update record", http.StatusBadRequest)
		return
	}

	jsonBody, err := json.Marshal(updateItem)
	if err != nil {
		http.Error(w, "Error converting data", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonBody)
}

type getItems struct {
	Page int32 `json:"id" validate:"required" name:"page"`
	Size int32 `json:"key" validate:"required" name:"size"`
}

func (s *ServiceHandler) getPaginatedKvItems(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var getItems getItems
	page := r.URL.Query().Get("page")
	size := r.URL.Query().Get("size")

	if pageNum, err := strconv.ParseInt(page, 10, 32); err != nil {
		getItems.Page = 1
	} else {
		getItems.Page = int32(pageNum)
	}

	if sizeNum, err := strconv.ParseInt(size, 10, 32); err != nil {
		getItems.Size = 10
	} else {
		getItems.Size = int32(sizeNum)
	}

	validate := validator.New()
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		return field.Tag.Get("name")
	})

	validationErrors := utils.ValidationErrors(validate, getItems)
	if validationErrors != nil {
		logging.ColorFatal(validationErrors)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(validationErrors)
		return
	}

	paginationParams := db.GetPaginatedKvParams{
		Limit:  getItems.Size,
		Offset: getItems.Size * (getItems.Page - 1),
	}

	kvItems, err := s.db.queries.GetPaginatedKv(ctx, paginationParams)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could fetch records", http.StatusBadRequest)
		return
	}

	numRecords, err := s.db.queries.CountKv(ctx)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Could fetch records", http.StatusBadRequest)
		return
	}

	var data = map[string]any{
		"items": kvItems,
		"page":  getItems.Page,
		"size":  getItems.Size,
		"total": numRecords,
		"pages": (numRecords / int64(getItems.Size)) + 1,
	}

	jsonBody, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error converting data", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonBody)
}

func (s *ServiceHandler) getKvItemsByUser(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	params := mux.Vars(r)
	service := params["service"]

	serviceAccount, err := s.db.queries.GetUserByUsername(ctx, service)
	if err != nil {
		http.Error(w, "Service account could not found", http.StatusNotFound)
		return
	}

	kvItems, err := s.db.queries.GetKvByUser(ctx, int64(serviceAccount.ID))
	if err != nil {
		http.Error(w, fmt.Sprintf("Secrets could not be fetched for SERVICE: %s", service), http.StatusNotFound)
		return
	}

	for i := range kvItems {
		value, err := utils.AesDecrypt(os.Getenv("AES_SECRET"), kvItems[i].Value)
		if err != nil {
			fmt.Println(err)
			continue
		}
		kvItems[i].Value = value
	}

	jsonBody, err := json.Marshal(kvItems)
	if err != nil {
		http.Error(w, "Error converting data", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonBody)
}
