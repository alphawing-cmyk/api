package services

import (
	"bytes"
	"context"
	"html/template"
	"os"
	"time"

	mailgun "github.com/mailgun/mailgun-go/v4"
)

type MailgunService struct {
	Sender  string
	Company string
	Domain  string
}

func (es *MailgunService) ForgotPasswordEmail(subject string, to string, reset_link string) (string, error) {
	mg := mailgun.NewMailgun(es.Domain, os.Getenv("MAILGUN_API_KEY"))
	htmlBody := `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Alpha Wing</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                                margin: 0;
                                padding: 20px;
                                background-color: #ffffff;
                                color: #333333;
                            }

                            .container {
                                max-width: 1200px;
                                margin: 0 auto;
                                padding: 20px;
                            }

                            .header {
                                border-bottom: 1px solid #EEEEEE;
                                padding-bottom: 20px;
                                margin-bottom: 40px;
                            }

                            .logo {
                                font-size: 24px;
                                font-weight: bold;
                                color: #202020;
                            }

                            .content {
                                display: grid;
                                gap: 30px;
                            }

                            .card {
                                border: 1px solid #202020;
                                border-radius: 8px;
                                padding: 24px;
                                transition: all 0.2s ease;
                            }

                            .card:hover {
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            }

                            h1 {
                                font-size: 26px;
                                font-weight: 700;
                                margin-bottom: 16px;
                                color: #202020;
                            }

                            p {
                                font-size: 18px;
                                line-height: 1.6;
                                color: #545454;
                                margin-bottom: 24px;
                            }

                            .button {
                                background-color: #202020;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 16px 32px;
                                border: none;
                                border-radius: 8px;
                                font-size: 16px;
                                font-weight: 500;
                                cursor: pointer;
                                transition: background-color 0.2s ease;
                            }

                            .button:hover {
                                background-color: #333333;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <header class="header">
                                <div class="logo">Alpha Wing Password Reset</div>
                            </header>

                            <main class="content">
                                <div class="card">
                                    <h1>Password Reset</h1>
                                    <p>You have requested to reset your password, please click the <b>link</b> below to reset your password.</p>
                                    <a class="button" href=".{{reset_link}}">Click here</a>
                                </div>
                            </main>
                        </div>
                    </body>
                    </html>
                `
	tmpl, err := template.New("resetEmailTemplate").Parse(htmlBody)
	data := struct{ reset_link string }{reset_link: reset_link}

	if err != nil {
		return "", err
	}

	var buf bytes.Buffer

	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	message := mg.NewMessage(
		es.Sender,
		subject,
		buf.String(),
		to,
	)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	_, _, err = mg.Send(ctx, message)
	if err != nil {
		return "", err
	}

	return "", nil
}
