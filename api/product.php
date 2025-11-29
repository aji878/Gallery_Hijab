<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Product.php';

$database = new Database();
$db = $database->getConnection();
$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Get single product
            $product->id = $_GET['id'];
            $stmt = $product->readOne();
            $products_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($products_arr, $row);
            }
            echo json_encode($products_arr[0] ?? array());
        } else {
            // Get all products
            $stmt = $product->read();
            $products_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($products_arr, $row);
            }
            echo json_encode($products_arr);
        }
        break;

    case 'POST':
        // Handle file upload
        if(isset($_FILES['productImage'])) {
            $uploadDir = '../image/products/';
            if(!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileName = time() . '_' . basename($_FILES['productImage']['name']);
            $targetFilePath = $uploadDir . $fileName;
            
            // Check if image file is a actual image
            $check = getimagesize($_FILES['productImage']['tmp_name']);
            if($check !== false) {
                if(move_uploaded_file($_FILES['productImage']['tmp_name'], $targetFilePath)) {
                    // File uploaded successfully, now add product to database
                    $product->name = $_POST['productName'];
                    $product->price = $_POST['productPrice'];
                    $product->description = $_POST['productDescription'] ?? '';
                    $product->image = 'image/products/' . $fileName;
                    $product->category = $_POST['productCategory'];
                    $product->rating = $_POST['productRating'] ?? 4.5;
                    $product->review_count = 0;
                    
                    if($product->create()) {
                        echo json_encode(array("message" => "Product created successfully."));
                    } else {
                        echo json_encode(array("message" => "Unable to create product."));
                    }
                } else {
                    echo json_encode(array("message" => "Sorry, there was an error uploading your file."));
                }
            } else {
                echo json_encode(array("message" => "File is not an image."));
            }
        } else {
            // JSON input (for other clients)
            $data = json_decode(file_get_contents("php://input"));
            
            if(!empty($data->name) && !empty($data->price)) {
                $product->name = $data->name;
                $product->price = $data->price;
                $product->description = $data->description ?? '';
                $product->image = $data->image ?? 'image/default-product.jpg';
                $product->category = $data->category ?? 'Uncategorized';
                $product->rating = $data->rating ?? 4.5;
                $product->review_count = $data->review_count ?? 0;
                
                if($product->create()) {
                    echo json_encode(array("message" => "Product created."));
                } else {
                    echo json_encode(array("message" => "Unable to create product."));
                }
            } else {
                echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>