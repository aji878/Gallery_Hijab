<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Order.php';

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Get single order
            $order->id = $_GET['id'];
            $stmt = $order->readOne();
            
            $orders_arr = array();
            $orders_arr["order"] = array();
            $orders_arr["items"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (empty($orders_arr["order"])) {
                    $orders_arr["order"] = array(
                        "id" => $row['id'],
                        "order_number" => $row['order_number'],
                        "customer_name" => $row['customer_name'],
                        "customer_phone" => $row['customer_phone'],
                        "customer_address" => $row['customer_address'],
                        "customer_note" => $row['customer_note'],
                        "payment_method" => $row['payment_method'],
                        "total_amount" => $row['total_amount'],
                        "status" => $row['status'],
                        "created_at" => $row['created_at']
                    );
                }
                
                if ($row['product_name']) {
                    array_push($orders_arr["items"], array(
                        "product_name" => $row['product_name'],
                        "product_price" => $row['product_price'],
                        "quantity" => $row['quantity']
                    ));
                }
            }
            
            echo json_encode($orders_arr);
            
        } else if(isset($_GET['status'])) {
            // Get orders by status
            $stmt = $order->readByStatus($_GET['status']);
            $orders_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($orders_arr, $row);
            }
            
            echo json_encode($orders_arr);
            
        } else {
            // Get all orders
            $stmt = $order->read();
            $orders_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($orders_arr, $row);
            }
            
            echo json_encode($orders_arr);
        }
        break;

    case 'POST':
        // Create new order
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->customer_name) &&
            !empty($data->customer_phone) &&
            !empty($data->customer_address) &&
            !empty($data->payment_method) &&
            !empty($data->total_amount) &&
            !empty($data->items)
        ) {
            $order->customer_name = $data->customer_name;
            $order->customer_phone = $data->customer_phone;
            $order->customer_address = $data->customer_address;
            $order->customer_note = $data->customer_note;
            $order->payment_method = $data->payment_method;
            $order->total_amount = $data->total_amount;
            $order->items = $data->items;
            
            try {
                $order_id = $order->create();
                
                http_response_code(201);
                echo json_encode(array(
                    "success" => true,
                    "order_id" => $order_id,
                    "order_number" => $order->order_number,
                    "message" => "Order created successfully."
                ));
                
            } catch (Exception $e) {
                http_response_code(503);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Unable to create order. " . $e->getMessage()
                ));
            }
        } else {
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => "Unable to create order. Data is incomplete."
            ));
        }
        break;

    case 'PUT':
        // Update order status
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id) && !empty($data->status)) {
            $order->id = $data->id;
            $order->status = $data->status;
            
            if($order->updateStatus()) {
                echo json_encode(array(
                    "success" => true,
                    "message" => "Order status updated."
                ));
            } else {
                echo json_encode(array(
                    "success" => false,
                    "message" => "Unable to update order status."
                ));
            }
        } else {
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => "Unable to update order. Data is incomplete."
            ));
        }
        break;

    case 'DELETE':
        // Delete order
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            $order->id = $data->id;
            
            if($order->delete()) {
                echo json_encode(array(
                    "success" => true,
                    "message" => "Order deleted."
                ));
            } else {
                echo json_encode(array(
                    "success" => false,
                    "message" => "Unable to delete order."
                ));
            }
        } else {
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => "Unable to delete order. ID is required."
            ));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>