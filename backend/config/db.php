
<?php

// it connects to our MySQL database
function getDatabaseConnection(): PDO
{
    $host = "localhost";
    $dbname = "dynamic_project";
    $username = "root";
    $password = "";

    // it will connect to the database
    $db = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    // to show an error if something goes wrong with a query
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // to get results as arrays
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    return $db;
}
