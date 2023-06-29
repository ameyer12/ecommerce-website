import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt

# SQL scripts for creating the database tables
CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255))"
)
CREATE_PRODUCTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS products (product_id SERIAL PRIMARY KEY, name VARCHAR(255), description VARCHAR(255), price DECIMAL, quantity INT)"
)
CREATE_ORDERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS orders (order_id SERIAL PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR(255))"
)
CREATE_CARTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS carts (order_item_id SERIAL PRIMARY KEY, order_id INT, product_id INT, quantity INT, subtotal DECIMAL)"
)

# SQL scripts for users table
INSERT_INTO_USERS = (
    "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING user_id"
)
GET_ALL_USERS = (
    "SELECT * FROM users"
)
GET_USER_BY_EMAIL  = (
    "SELECT * FROM users WHERE email = %s"
)

# SQL scripts for products table
INSERT_INTO_PRODUCTS = (
    "INSERT INTO products (name, description, price, quantity) VALUES (%s, %s, %s, %s)"
)
GET_ALL_PRODUCTS = (
    "SELECT * FROM products"
)
GET_PRODUCT_BY_ID = (
    "SELECT * FROM users WHERE product_id = %s"
)

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)
bcrypt = Bcrypt(app)

# API routes for users
@app.post("/api/users/register")
def registerUser():   
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]
    existingEmailQuery = GET_USER_BY_EMAIL

    # generate hashed password
    hashedPassword = bcrypt.generate_password_hash(password).decode('utf8')
    password = hashedPassword

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(existingEmailQuery, (email,))
            user = cursor.fetchone()
    # check if user exists
    if user is not None:
        return jsonify({"message": "Registration failed. Email already exists."}), 409

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(INSERT_INTO_USERS, (username, email, password))
            user_id = cursor.fetchone()[0]

    return jsonify({"user_id": user_id, "message": "User successfully created"}), 201

@app.post("/api/users/login")
def loginUser():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    emailQuery = GET_USER_BY_EMAIL

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(emailQuery, (email,))
            user = cursor.fetchone()
    # check if user exists
    if user is None:
        return jsonify({"message": "Login failed. Unauthorized access."}), 401
    # check if password is correct
    if not bcrypt.check_password_hash(user[3], password):
        return jsonify({"message": "Login failed. Unauthorized access."}), 401
    # user session
    session = user[0]

    return jsonify(user)

@app.route("/api/users", methods=["GET"])
def getAllUsers():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(GET_ALL_USERS)
            users = cursor.fetchall()
    return jsonify(users)

# API routes for products
@app.post("/api/products")
def addProduct():
    data = request.get_json()
    name = data["name"]
    description = data["description"]
    price = data["price"]
    quantity = data["quantity"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PRODUCTS_TABLE)
            cursor.execute(INSERT_INTO_PRODUCTS, (name, description, price, quantity))
            user_id = cursor.fetchone()[0]

    return jsonify({"user_id": user_id, "message": "User successfully created"}), 201

@app.route('/get', methods=['GET'])
def getAllProducts():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PRODUCTS_TABLE)
            cursor.execute(GET_ALL_PRODUCTS)
            products = cursor.fetchall()
    return jsonify(products)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
