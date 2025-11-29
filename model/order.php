<?php
class Order {
    private $conn;
    private $table_name = "orders";
    private $items_table = "order_items";

    public $id;
    public $order_number;
    public $customer_name;
    public $customer_phone;
    public $customer_address;
    public $customer_note;
    public $payment_method;
    public $total_amount;
    public $status;
    public $created_at;
    public $items = array();

    public function __construct($db) {
        $this->conn = $db;
    }

    // Generate unique order number
    private function generateOrderNumber() {
        $prefix = "GH";
        $timestamp = date('Ymd');
        $random = mt_rand(1000, 9999);
        return $prefix . $timestamp . $random;
    }

    // Create new order
    public function create() {
        try {
            // Begin transaction
            $this->conn->beginTransaction();

            // Generate order number
            $this->order_number = $this->generateOrderNumber();

            // Insert order
            $query = "INSERT INTO " . $this->table_name . " 
                     SET order_number=:order_number, customer_name=:customer_name, 
                         customer_phone=:customer_phone, customer_address=:customer_address, 
                         customer_note=:customer_note, payment_method=:payment_method, 
                         total_amount=:total_amount, status='pending'";
            
            $stmt = $this->conn->prepare($query);
            
            // Sanitize data
            $this->customer_name = htmlspecialchars(strip_tags($this->customer_name));
            $this->customer_phone = htmlspecialchars(strip_tags($this->customer_phone));
            $this->customer_address = htmlspecialchars(strip_tags($this->customer_address));
            $this->customer_note = htmlspecialchars(strip_tags($this->customer_note));
            $this->payment_method = htmlspecialchars(strip_tags($this->payment_method));
            $this->total_amount = htmlspecialchars(strip_tags($this->total_amount));
            
            // Bind values
            $stmt->bindParam(":order_number", $this->order_number);
            $stmt->bindParam(":customer_name", $this->customer_name);
            $stmt->bindParam(":customer_phone", $this->customer_phone);
            $stmt->bindParam(":customer_address", $this->customer_address);
            $stmt->bindParam(":customer_note", $this->customer_note);
            $stmt->bindParam(":payment_method", $this->payment_method);
            $stmt->bindParam(":total_amount", $this->total_amount);
            
            $stmt->execute();
            
            // Get the last inserted order ID
            $order_id = $this->conn->lastInsertId();
            
            // Insert order items
            if (!empty($this->items)) {
                $item_query = "INSERT INTO " . $this->items_table . " 
                              (order_id, product_name, product_price, quantity) 
                              VALUES (:order_id, :product_name, :product_price, :quantity)";
                
                $item_stmt = $this->conn->prepare($item_query);
                
                foreach ($this->items as $item) {
                    $item_stmt->bindParam(":order_id", $order_id);
                    $item_stmt->bindParam(":product_name", $item->product_name);
                    $item_stmt->bindParam(":product_price", $item->product_price);
                    $item_stmt->bindParam(":quantity", $item->quantity);
                    $item_stmt->execute();
                }
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return $order_id;
            
        } catch (Exception $e) {
            // Rollback transaction if error occurs
            $this->conn->rollback();
            throw $e;
        }
    }

    // Read all orders
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read single order with items
    public function readOne() {
        $query = "SELECT o.*, oi.product_name, oi.product_price, oi.quantity 
                  FROM " . $this->table_name . " o 
                  LEFT JOIN " . $this->items_table . " oi ON o.id = oi.order_id 
                  WHERE o.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        return $stmt;
    }

    // Update order status
    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Get orders by status
    public function readByStatus($status) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE status = ? 
                  ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $status);
        $stmt->execute();
        
        return $stmt;
    }

    // Delete order
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Get total orders count
    public function count() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    // Get total revenue
    public function getTotalRevenue() {
        $query = "SELECT SUM(total_amount) as revenue FROM " . $this->table_name . " WHERE status = 'delivered'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['revenue'] ? $row['revenue'] : 0;
    }

    // Get recent orders
    public function getRecentOrders($limit = 5) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  ORDER BY created_at DESC 
                  LIMIT :limit";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }
}
?>