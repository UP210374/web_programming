<?php


header("Access-Control-Allow-Origin: *");

try{
    //conexion a la base de datos
    $conn = new  PDO(
        "mysql: host=localhost;dbname=tasklist",
        "root",
        "password",
    );

}catch (PDOException $e){
    echo $e->getMessage();
}