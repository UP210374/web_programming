<?php

include "./partials/connection.php";


$idTask =  $_GET['idUser'];

try{

    $sql = "SELECT * FROM task  WHERE  id = {$idTask};";

    $state = $conn->query($sql);

    $row = $state->fetch();

    $json = [
        "id" => $row['id'],
        "idUser" => $row['idUser'],
        "title" => $row['title'],
    ];

    
    $jsonString = json_encode($json);
    echo $jsonString;



}catch(PDOException $e){
    echo $e->getMessage();
}