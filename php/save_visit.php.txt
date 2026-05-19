<?php

$db = new SQLite3('database.db');

$db->exec("CREATE TABLE IF NOT EXISTS visits (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    visit_time TEXT

)");

$date = date('Y-m-d H:i:s');

$db->exec("INSERT INTO visits (visit_time)

VALUES ('$date')");

echo "Visit saved successfully.";

?>