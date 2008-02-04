<?php
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

$file_name = $file;
$file_src = $root_dir. $dir. "/". $file_name;
$file_ext = strtolower(strrchr($file_name,"."));

if ($file_ext === ".jpg") {
	// create thumbnail for image file
	header('Content-type: image/jpeg');

	list($image_width, $image_height) = getimagesize($file_src);
	// calculate the proportions
	$proportion_X = $image_width / $thumb_width;
	$proportion_Y = $image_height / $thumb_height;
	if ($proportion_X > $proportion_Y ){
		$proportion = $proportion_Y;
	} else {
		$proportion = $proportion_X ;
	}
	
	$target['width'] = $thumb_width * $proportion;
	$target['height'] = $thumb_height * $proportion;
	
	$original['diagonal_center'] = round(sqrt(($image_width*$image_width)+($image_height*$image_height))/2);
	$target['diagonal_center'] = round(sqrt(($target['width']*$target['width']) + ($target['height']*$target['height']))/2);
	
	$crop = round($original['diagonal_center'] - $target['diagonal_center']);
	// compute proportions
	if($proportion_X < $proportion_Y ){
		$target['x'] = 0;
		$target['y'] = round((($image_height/2)*$crop)/$target['diagonal_center']);
	}else{
		$target['x'] =  round((($image_width/2)*$crop)/$target['diagonal_center']);
		$target['y'] = 0;
	}
	// resize the image
	$thumbnail = imagecreatetruecolor ($thumb_width, $thumb_height);
	$source = imagecreatefromjpeg ($file_src);
	imagecopyresampled ($thumbnail,  $source,  0, 0, $target['x'], $target['y'], $thumb_width, $thumb_height, $target['width'], $target['height']);
	// output the image
	imagejpeg ($thumbnail, null, 100);
} elseif ($file_ext === ".txt") {
	// create thumbnail for text file
	header('Content-type: image/jpeg');
	$width = $thumb_width;
	$height = $thumb_height;
	$font = 4;
	
	$lines = file($file_src);
	$fontWidth = imagefontwidth($font);
	$fontHeight = imagefontheight($font);
	$maxCharsPerLine = ($width / $fontWidth) - 2;
	$maxLines = ($height / $fontHeight) - 2;
	$lineHeight = $fontHeight + 1;
	// determine colors
	$image = imagecreatetruecolor($width, $height);
	$black = imagecolorallocate($image, 0, 0, 0);
	$white = imagecolorclosest($image, 255, 255, 255);
	imagefill($image, 0, 0, $white);
	// write the lines
	for($i = 0; $i < $maxLines; $i++) {
	    $line = (strlen($lines[$i]) > $maxCharsPerLine) ? substr($lines[$i], 0, $maxCharsPerLine) : $lines[$i];
//	    $line = ereg_replace("\t", "  ", $line);
	    $line = ereg_replace("[\r \n \t]", " ", $line); 
	    imagestring($image, $font, 3, ($i * $lineHeight), $line, $black);
	}
	// output the image
	imagejpeg($image, null, 100);
}

?>