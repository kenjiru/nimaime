<?php
// the upload folder
$root_dir = 'files/';

// child dirs and the extensions of the files allowed in those folders
// specify multiple extensions separated by space, egg: ".jpg .jpeg .png"
// folder names and extensions are case insensitive
$allowed_dirs = array("Images" => ".jpg .jpeg .png",
	"Movies" => ".flv",
	"Text" => ".txt");

// size for thumbnail images
$thumb_width = 160;
$thumb_height = 160;

/*
 * DO NOT EDIT BELOW
 */

// check for the existence of the upload folder
// TODO: try to create the upload folder
if (false === is_dir($root_dir))
	die("root_dir is not a directory!");
?>