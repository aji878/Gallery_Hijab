<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Product.php';

$database = new Database();
$db = $database->getConnection();
$product = new $product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Get single product
            $product->id = $_GET['id'];
            $stmt = $product->readOne();
        } else {
            // Get all products
            $stmt = $product->read();
        }
        
        $products_arr = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($products_arr, $row);
        }
        echo json_encode($products_arr);
        break;

    case 'POST':
        // Add new product
        $data = json_decode(file_get_contents("php://input"));
        
        $product->name = $data->name;
        $product->price = $data->price;
        $product->description = $data->description;
        $product->image = $data->image;
        $product->category = $data->category;
        $product->rating = $data->rating;
        
        if($product->create()) {
            echo json_encode(array("message" => "Product created."));
        } else {
            echo json_encode(array("message" => "Unable to create product."));
        }
        break;
}
?>