<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Order.php';

$database = new Database();
$db = $database->getConnection();
$order = new $order($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $order->customer_name = $data->customer_name;
    $order->customer_phone = $data->customer_phone;
    $order->customer_address = $data->customer_address;
    $order->customer_note = $data->customer_note;
    $order->payment_method = $data->payment_method;
    $order->total_amount = $data->total_amount;
    $order->items = $data->items;
    
    if($order_id = $order->create()) {
        echo json_encode(array(
            "success" => true,
            "order_id" => $order_id,
            "order_number" => $order->order_number,
            "message" => "Order created successfully."
        ));
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to create order."
        ));
    }
}
?>