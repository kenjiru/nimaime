<?php
header('Content-type: image/jpeg');

require_once ("includes/config.inc.php");

$dir = null;
if (isset($_GET['dir']))
	$dir = $_GET['dir'];
else
	die ("dir not specified!");

$file = null;
if (isset($_GET['file']))
	$file = $_GET['file'];
else
	die("file not specified!");

$file_name = $root_dir. $dir. "/". $file;

list($width, $height) = getimagesize($file_name);

$new_width = 160;
$new_height = 160;

$proportion_X = $width / $new_width;
$proportion_Y = $height / $new_height;

if ($proportion_X > $proportion_Y ){
	$proportion = $proportion_Y;
} else {
	$proportion = $proportion_X ;
}

$target['width'] = $new_width * $proportion;
$target['height'] = $new_height * $proportion;

$original['diagonal_center'] = round(sqrt(($width*$width)+($height*$height))/2);
$target['diagonal_center'] = round(sqrt(($target['width']*$target['width']) + ($target['height']*$target['height']))/2);

$crop = round($original['diagonal_center'] - $target['diagonal_center']);

if($proportion_X < $proportion_Y ){
	$target['x'] = 0;
	$target['y'] = round((($height/2)*$crop)/$target['diagonal_center']);
}else{
	$target['x'] =  round((($width/2)*$crop)/$target['diagonal_center']);
	$target['y'] = 0;
}

$thumbnail = imagecreatetruecolor ($new_width, $new_height);
$source = imagecreatefromjpeg ($file_name);
imagecopyresampled ($thumbnail,  $source,  0, 0, $target['x'], $target['y'], $new_width, $new_height, $target['width'], $target['height']);

imagejpeg ($thumbnail, null, 100);

?>