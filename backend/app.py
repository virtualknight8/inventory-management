from flask import Flask, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
 
db_params = {
    'host': 'localhost',
    'database': 'inventory_management',
    'user': 'postgres',
    'password': 'Androidone1@'
}

@app.route('/inventory', methods=['GET'])
def get_categories():
    # Establish a connection to the database
    conn = psycopg2.connect(**db_params)

    # Create a cursor object to interact with the database
    cur = conn.cursor()

    # Execute the SQL query to retrieve data from the 'categories' table
    cur.execute("SELECT * FROM categories")

    # Fetch all rows of the result
    category_rows = cur.fetchall()

    # Close the cursor and the connection
    cur.close()
    conn.close()

    # Convert the data to a suitable format (e.g., list of dictionaries)
    categories = []
    for row in category_rows:
        category = {
            'id': row[0],
            'name': row[1]
        }
        categories.append(category)

    # Return the categories as JSON response
    return jsonify(categories)

if __name__ == '__main__':
    app.run(debug=True)
