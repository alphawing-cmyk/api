SECRET_KEY := secret
OPENSSL_PARAMS := -aes-256-cbc -k $(SECRET_KEY) -P -md sha1 -iter 10

all: generate_key

generate_key:
	@echo "Generating encryption key and IV..."
	@openssl enc $(OPENSSL_PARAMS)

clean:
	@echo "Nothing to clean."