<?php

include "./partials/connection.php";
//phpinfo();
//conexion a la base de datos

try{
 

    

    $state = $conn->query("SELECT * FROM user;");

    $json = [];
    while ($row = $state->fetch()){
        array_push($json, [
            "id"=> $row['id'],
            "firstname"=> $row['firstname'],
            "lastname"=> $row['lastname'],
            "correo"=> $row['correo']
        ]);
    };

    //var_dump($json);
    //echo $row[0];

    //var_dump($row);
    //echo $result;

    $jsonString = json_encode($json);
    echo $jsonString;


} catch (PDOException $e){
    echo $e->getMessage();
}