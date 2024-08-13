from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import datetime, jwt
import smtplib
from utils.email_html import html_template

SECRET_KEY = 'Tradin_Buddy'

def encode_auth_token(email):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': email
        }
        
        return jwt.encode(
            payload,
            SECRET_KEY,
            algorithm='HS256'
        )
    except Exception as e:
        return e
      
def decode_auth_token(auth_token):
    """
    Validates the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, SECRET_KEY, algorithms="HS256")
        return '200'
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'

# def verifyEmail(email, firstName):
#     try:
#         print(email, firstName)
#         msg = MIMEMultipart()
#         msg["From"] = "trwakley@gmail.com"
#         msg["To"] = email
#         msg["Subject"] = "Verify your email address"
#         token = encode_auth_token(email=email)
#         # msg.attach(MIMEText(message))
#         html_message = html_template.render(token=token, firstName=firstName)
#         print("html_message-->", html_message)
#         msg.attach(MIMEText(html_message, 'html'))

#         mailserver = smtplib.SMTP("smtp.gmail.com", 587)
#         # identify ourselves to smtp gmail client
#         mailserver.ehlo()
#         # secure our email with tls encryption
#         mailserver.starttls()
#         # re-identify ourselves as an encrypted connection
#         mailserver.ehlo()
#         mailserver.login("trwakley@gmail.com", "dulgmycteiuhupwe")

#         mailserver.sendmail("trwakley@gmail.com", email, msg.as_string())

#         mailserver.quit()
#     except Exception as e:
#         print(str(e))
#         return 400
#     return 200

def verifyEmail(email, firstName):

    try:
        print(email, firstName)
        msg = MIMEMultipart()
        msg["From"] = "trwakley@gmail.com"
        msg["To"] = email
        msg["Subject"] = "Verify your email address"
        
        # Generate the token - ensure this function works correctly
        token = encode_auth_token(email=email)
        
        # Render the HTML template with the token and the first name
        html_message = html_template.render(token=token, firstName=firstName)
        
        # Attach the HTML message to the email
        msg.attach(MIMEText(html_message, 'html'))

        mailserver = smtplib.SMTP("smtp.gmail.com", 587)
        
        # Identify ourselves to smtp gmail client
        mailserver.ehlo()
        # Secure our email with TLS encryption
        mailserver.starttls()
        # Re-identify ourselves as an encrypted connection
        mailserver.ehlo()
        
        # Login to the mail server
        mailserver.login("trwakley@gmail.com", "dulgmycteiuhupwe")
        print("msg-->", msg.as_string())
        # Send the email
        mailserver.sendmail("trwakley@gmail.com", email, msg.as_string())

        # Quit the mail server connection
        mailserver.quit()

    except Exception as e:
        print(str(e))
        return 400
    
    return 200
