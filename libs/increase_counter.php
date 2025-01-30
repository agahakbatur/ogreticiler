<?php
  // $counter_name = 'Counter.txt';
  echo "This is Button1 that is selected";
  echo '<script>alert("Welcome to Geeks for Geeks")</script>';
  $counter_name = 'file:///http://127.0.0.1:5500/libs/counter.txt';

  if (!file_exists($counter_name)) {
    $f = fopen($counter_name, "w");
    fwrite($f,"0");
    fclose($f);
  }

  $f = fopen($counter_name,"r");
  $counterVal = fread($f, filesize($counter_name));
  fclose($f);

  $counterVal++;

  $f = fopen($counter_name, "w");
  fwrite($f, $counterVal);
  fclose($f);

  // echo $counterVal;
?>
