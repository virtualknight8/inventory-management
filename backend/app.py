from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure the database connection parameters
db_params = {
    'host': 'localhost',
    'database': 'inventory_management',
    'user': 'postgres',
    'password': 'Androidone1@'
}

@app.route('/inventory', methods=['GET'])
def get_inventory():
    # Establish a connection to the database
    conn = psycopg2.connect(**db_params)

    # Create a cursor object to interact with the database
    cur = conn.cursor()

    # Execute the SQL query to retrieve inventory items with category and supplier information
    cur.execute("""
        SELECT p.id, p.name, p.price, p.quantity, c.name AS category, s.name AS supplier
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN suppliers s ON p.supplier_id = s.id
    """)

    # Fetch all rows of the result
    inventory_items = cur.fetchall()

    # Close the cursor and the connection
    cur.close()
    conn.close()

    # Convert the data to a suitable format (e.g., list of dictionaries)
    inventory_data = []
    for item in inventory_items:
        item_data = {
            'id': item[0],
            'name': item[1],
            'price': float(item[2]),
            'quantity': item[3],
            'category': item[4],
            'supplier': item[5]
        }
        inventory_data.append(item_data)

    # Return the inventory data as JSON response
    return jsonify(inventory_data)
    

# Endpoint for creating a new inventory item
@app.route('/inventory', methods=['POST'])
def example_endpoint():
    # Get the data from the request body
        data = request.get_json()

        # Extract the necessary fields from the data
        name = data.get('name')
        price = data.get('price')
        quantity = data.get('quantity')
        category_id = data.get('category_id')
        supplier_id = data.get('supplier_id')

        # Perform any necessary validation on the input data

        # Establish a connection to the database
        conn = psycopg2.connect(**db_params)

        # Create a cursor object to interact with the database
        cur = conn.cursor()

        try:
            # Execute the SQL query to insert the new inventory item
            cur.execute("""
                INSERT INTO products (name, price, quantity, category_id, supplier_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (name, price, quantity, category_id, supplier_id))

            # Commit the transaction
            conn.commit()

            # Return a success message or the ID of the newly created item
            return jsonify({'message': 'Item created successfully'})

        except Exception as e:
            # Rollback the transaction in case of any errors
            conn.rollback()
            # Return an error message
            return jsonify({'error': str(e)}), 500

        finally:
            # Close the cursor and the connection
            cur.close()
            conn.close()

# Update an inventory item
@app.route('/inventory/<item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    # Get the updated item data from the request body
    updated_data = request.json

    # Establish a connection to the database
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()

    try:
        # Check if the item exists in the database
        cur.execute("SELECT * FROM products WHERE id = %s", (item_id,))
        existing_item = cur.fetchone()

        if existing_item:
            # Perform the update operation in the database
            cur.execute("""
                UPDATE products
                SET name = %s, price = %s, quantity = %s
                WHERE id = %s
            """, (
                updated_data.get('name', existing_item[1]),
                updated_data.get('price', existing_item[2]),
                updated_data.get('quantity', existing_item[3]),
                item_id
            ))

            # Commit the transaction
            conn.commit()

            # Return a response indicating success
            return jsonify({'message': 'Inventory item updated successfully'}), 200
        else:
            # Return a response indicating failure (item not found)
            return jsonify({'error': 'Inventory item not found'}), 404
    except Exception as e:
        # Handle any errors that occur during the update operation
        conn.rollback()
        return jsonify({'error': 'Error updating inventory item', 'message': str(e)}), 500
    finally:
        # Close the cursor and the connection
        cur.close()
        conn.close()


# Endpoint for deleting an inventory item
@app.route('/inventory/<item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()

    # Delete the inventory item from the database based on the item_id
    try:
        # Grab the item from the item_id
        cur.execute("SELECT * FROM products WHERE id=%s", (item_id,))
        existing_item = cur.fetchone

        # Check if the item exists in the database
        if existing_item:
            cur.execute("DELETE FROM products WHERE id=%s", (item_id,))
            conn.commit()

            # Return a response indicating success
            return jsonify({'message': 'Item delted successfully'}), 200


        else:
            # Return a response indicating failure
            return jsonify({'message': 'Inventory item not found'}), 404

    except Exception as e:
        # Handle any errors that may occur during execution
        conn.rollback()
        return jsonify({'error': 'Error deleting inventory item', 'message': str(e)}), 500

    finally:
        # Close the curson and the connection
        cur.close()
        conn.close()    





if __name__ == '__main__':
    app.run(debug=True)
