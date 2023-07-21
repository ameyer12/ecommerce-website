import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
import jwt
import datetime

# SQL scripts for creating the database tables
CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), isAdmin BOOLEAN DEFAULT FALSE)"
)
CREATE_PRODUCTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS products (product_id SERIAL PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), description VARCHAR(255), price DEC, quantity INT)"
)
CREATE_ORDERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS orders (order_id SERIAL PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR(255))"
)
CREATE_CARTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS carts (order_item_id SERIAL PRIMARY KEY, order_id INT, user_id INT, product_id INT, quantity INT, subtotal DECIMAL)"
)

# SQL scripts for users table
INSERT_INTO_USERS = (
    "INSERT INTO users (username, email, password, isAdmin) VALUES (%s, %s, %s, %s) RETURNING user_id"
)
GET_ALL_USERS = (
    "SELECT * FROM users"
)
GET_USER_BY_EMAIL  = (
    "SELECT * FROM users WHERE email = %s"
)
DELETE_USER = (
    "DELETE FROM users WHERE email = %s"
)

# SQL scripts for products table
INSERT_INTO_PRODUCTS = (
    "INSERT INTO products (name, image, description, price, quantity) VALUES (%s, %s, %s, %s, %s) RETURNING product_id"
)
GET_ALL_PRODUCTS = (
    "SELECT * FROM products"
)
GET_PRODUCT_BY_ID = (
    "SELECT * FROM products WHERE product_id = %s"
)
DELETE_PRODUCT = (
    "DELETE FROM products WHERE product_id = %s"
)

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins='http://localhost:3000')

# Key for signing the token
app.config['SECRET_KEY'] = 'secretkey'

# API routes for users
@app.post("/api/users/register")
def registerUser():   
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]
    isAdmin = data["isAdmin"]
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
            cursor.execute(INSERT_INTO_USERS, (username, email, password, isAdmin))
            user_id = cursor.fetchone()[0]

    token = jwt.encode({'user': user_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120)}, app.config['SECRET_KEY'])

    return jsonify({"user_id": user_id, "token": token, "message": "User successfully created"}), 201

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

    token = jwt.encode({'user': user[0], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120)}, app.config['SECRET_KEY'])

    return jsonify({"user_id": user[0], "isAdmin": user[4], "token": token, "message": "User successfully logged in."}), 201

@app.delete("/api/users/delete")
def deleteUser():
    data = request.get_json()
    email = data["email"]
    emailQuery = GET_USER_BY_EMAIL

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(emailQuery, (email,))
            user = cursor.fetchone()
    # check if user exists
    if user is None:
        return jsonify({"message": "User does not exist. Please input a valid email."}), 400

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(DELETE_USER, (email,))

    return jsonify({"message": "User successfully deleted."}), 201

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
    image = data["image"]
    description = data["description"]
    price = data["price"]
    quantity = data["quantity"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PRODUCTS_TABLE)
            cursor.execute(INSERT_INTO_PRODUCTS, (name, image, description, price, quantity))
            product_id = cursor.fetchone()[0]

    return jsonify({"product_id": product_id, "message": "Product successfully created"}), 201

@app.delete("/api/products/delete")
def deleteProduct():
    data = request.get_json()
    product_id = data["product_id"]
    productIdQuery = GET_PRODUCT_BY_ID

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(productIdQuery, (product_id,))
            product = cursor.fetchone()

    # check if user exists
    if product is None:
        return jsonify({"message": "Product does not exist. Please input a valid product id."}), 400

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PRODUCTS_TABLE)
            cursor.execute(DELETE_PRODUCT, (product_id,))

    return jsonify({"message": "Product successfully deleted."}), 201

@app.patch("/api/products/update")
def updateProduct():
    data = request.get_json()
    product_id = data["product_id"]
    name = data["name"]
    image = data["image"]
    description = data["description"]
    price = data["price"]
    quantity = data["quantity"]
    updateProductQuery = "UPDATE products SET name = %s, image = %s, description = %s, price = %s, quantity = %s WHERE product_id = %s"

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PRODUCTS_TABLE)
            cursor.execute(updateProductQuery, (name, image, description, price, quantity, product_id))

    return jsonify({"message": "Product successfully updated."}), 200

@app.route("/api/products", methods=['GET'])
def getAllProducts():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PRODUCTS_TABLE)
            cursor.execute(GET_ALL_PRODUCTS)
            products = cursor.fetchall()

    def decimal_to_string(product):
        product_dict = dict(product)
        product_dict['price'] = str(product['price'])
        product_dict['quantity'] = str(product['quantity'])
        return product_dict

    products = [decimal_to_string(product) for product in products]

    return jsonify(products)

@app.post("/api/cart/add")
def addToCart():
    data = request.get_json()
    user_id = data["userId"]
    product_id = data["productId"]
    quantity = data["quantity"]

    # Get the product details
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_PRODUCT_BY_ID, (product_id,))
            product = cursor.fetchone()

    # Check if the product exists
    if product is None:
        return jsonify({"message": "Product does not exist. Please input a valid product id."}), 400

    # Calculate the subtotal
    subtotal = product[4] * quantity

    # Insert the item into the cart
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_CARTS_TABLE)
            cursor.execute(
                "INSERT INTO carts (user_id, product_id, quantity, subtotal) VALUES (%s, %s, %s, %s)",
                (user_id, product_id, quantity, subtotal),
            )

    return jsonify({"message": "Item successfully added to the cart."}), 201

@app.route("/api/cart/<int:user_id>")
def getCart(user_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT c.order_item_id, p.name, p.price, c.quantity, c.subtotal FROM carts c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = %s",
                (user_id,),
            )
            cart_items = cursor.fetchall()

    return jsonify(cart_items)

@app.delete("/api/cart/<int:order_item_id>")
def removeFromCart(order_item_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM carts WHERE order_item_id = %s",
                (order_item_id,),
            )

    return jsonify({"message": "Item successfully removed from the cart."}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)

