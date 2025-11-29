<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

include_once '../config/database.php';
include_once '../models/Order.php';

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$stats = array(
    "total_orders" => $order->count(),
    "total_revenue" => $order->getTotalRevenue(),
    "pending_orders" => $order->readByStatus('pending')->rowCount(),
    "recent_orders" => array()
);

// Get recent orders
$stmt = $order->getRecentOrders(5);
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($stats["recent_orders"], $row);
}

echo json_encode($stats);
?>