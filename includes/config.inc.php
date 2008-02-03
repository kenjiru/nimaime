<?php
// upload folder
$root_dir = 'files/';
// check for the existence of the upload folder
if (!is_dir($root_dir))
	die("root_dir is not a directory!");

// size for thumbnail images
$thumb_width = 160;
$thumb_height = 160;
?>