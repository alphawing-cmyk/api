import os
import logging
from mailgun import Mailgun, Message

class Emailer:
    def __init__(self):
        self.api_key = os.getenv("MAILGUN_API_KEY")
        self.sender = os.getenv("MAILGUN_SENDER")
        self.domain = os.getenv("MAILGUN_DOMAIN")
        self.company = "Alpha Wing"

        if not all([self.api_key, self.sender, self.domain]):
            raise ValueError("Missing Mailgun configuration in environment variables")

        self.client = Mailgun(domain=self.domain, api_key=self.api_key)

        logging.info(f"Mailgun sender: {self.sender}")
        logging.info(f"Mailgun API Key: {self.api_key}")

    def generate_password_reset(self, to: list[str], reset_link: str):
        try:
            message = Message(
                from_email=f"{self.company} <{self.sender}>",
                to_emails=to,
                subject=f"{self.company} Password Reset",
                text="You have requested to reset your password",
                html=self._generate_html(reset_link)
            )
            response = self.client.send_message(message)
            return response
        except Exception as e:
            logging.exception("Failed to send password reset email")

    def _generate_html(self, reset_link: str) -> str:
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{self.company}</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background-color: #ffffff;
                    color: #333333;
                    padding: 20px;
                }}
                .container {{
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    border-bottom: 1px solid #EEEEEE;
                    padding-bottom: 20px;
                    margin-bottom: 40px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #202020;
                }}
                .card {{
                    border: 1px solid #202020;
                    border-radius: 8px;
                    padding: 24px;
                }}
                h1 {{
                    font-size: 26px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    color: #202020;
                }}
                p {{
                    font-size: 18px;
                    line-height: 1.6;
                    color: #545454;
                    margin-bottom: 24px;
                }}
                .button {{
                    background-color: #202020;
                    color: #ffffff;
                    padding: 16px 32px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                }}
                .button:hover {{
                    background-color: #333333;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <div class="logo">{self.company} Password Reset</div>
                </header>
                <main class="content">
                    <div class="card">
                        <h1>Password Reset</h1>
                        <p>You have requested to reset your password, please click the <b>link</b> below to reset your password.</p>
                        <a class="button" href="{reset_link}">Click here</a>
                    </div>
                </main>
            </div>
        </body>
        </html>
        """

