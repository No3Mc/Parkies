from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import secrets
import bcrypt
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from flask_mail import Mail, Message
import os

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev', static_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/static')
app.secret_key = secrets.token_hex(16)

# Configure Flask-Mail settings
app.config['MAIL_SERVER'] = 'smtp.aol.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'help.almadad@aol.com'

# Create a Mail instance
mail = Mail(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'

# Rate limiting for failed login attempts
failed_logins = {}


class User(UserMixin):
    def __init__(self, user_dict):
        self.id = str(user_dict['_id'])
        self.username = user_dict['username']
        # Add any other required attributes

    def is_active(self):
        return True


@login_manager.user_loader
def load_user(user_id):
    user_dict = users_collection.find_one({'_id': ObjectId(user_id)})
    if user_dict:
        return User(user_dict)
    return None


def rate_limited(ip_address):
    now = datetime.now()
    if ip_address in failed_logins:
        attempts, last_attempt_time = failed_logins[ip_address]
        if now - last_attempt_time > timedelta(minutes=10):
            # Reset failed login attempts after 10 minutes
            failed_logins[ip_address] = (0, now)
            return False
        elif attempts >= 5:
            # Limit failed login attempts to 5 per 10-minute window
            return True
        else:
            failed_logins[ip_address] = (attempts + 1, last_attempt_time)
            return False
    else:
        failed_logins[ip_address] = (1, now)
        return False


@app.route('/')
def index():
    return render_template('layout/header.html')

@app.route('/rpg')
def rpg():
    return render_template('LogReg/Register.html')

@app.route('/login', methods=['POST'])
def login():
    ip_address = request.remote_addr
    if rate_limited(ip_address):
        flash('Too many failed login attempts. Please try again later.', 'error')
        return redirect(url_for('index'))

    username = request.form['username']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    user = users_collection.find_one({'username': username})

    if user and bcrypt.checkpw(password, user['password']):
        print('Login successful for user:', username)
        login_user(User(user))
        return jsonify({'message': 'Login successful'}), 200
    else:
        print('Login failed for user:', username)
        return jsonify({'message': 'Login failed'}), 401

    return redirect(url_for('index'))


@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    firsn = request.form['firsn']
    lasn = request.form['lasn']
    email = request.form['email']
    phone = request.form['phone']
    postcode = request.form['postcode']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    # hash password using bcrypt
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    # check if user already exists
    if users_collection.find_one({'email': email}):
        flash('User with this email already exists', 'error')
    else:
        # generate a random token for email verification
        token = secrets.token_hex(16)
        # insert user into database with unverified email and token
        user_data = {
            'username': username,
            'firsn': firsn,
            'lasn': lasn,
            'email': email,
            'phone': phone,
            'postcode': postcode,
            'password': hashed_password,  # store hashed password in database
            'verified': False,
            'token': token
        }
        users_collection.insert_one(user_data)

        # remove the original password from the dictionary
        del user_data['password']

        flash('Registration successful! Please check your email to verify your account', 'success')
        # send verification email
        verify_url = url_for('verify', token=token, _external=True)
        msg = Message('Verify your email', sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = f'Please click the following link to verify your email: {verify_url}'
        mail.send(msg)

    return redirect(url_for('index'))


@app.route('/verify/<token>')
def verify(token):
    # check if token is valid
    user = users_collection.find_one({'token': token})
    if not user:
        flash('Invalid token', 'error')
    else:
        # update user to verified email and remove token
        users_collection.update_one({'_id': user['_id']}, {'$set': {'verified': True}, '$unset': {'token': 1}})
        flash('Email verified! You can now log in', 'success')

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
