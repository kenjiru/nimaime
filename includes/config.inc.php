<?php
// the upload folder
$root_dir = 'files/';

// Child folders and the extensions of the files allowed in those folders.
// Specify multiple extensions separated by space, egg: ".jpg .jpeg .png".
// Extensions are case insensitive.
$allowed_dirs = array("Images" => ".jpg .jpeg .png",
	"Movies" => ".flv",
	"Text" => ".txt",
	"Test" => "" 
);

// size for thumbnail images
$thumb_width = 160;
$thumb_height = 160;

/*
 * DO NOT EDIT BELOW
 */

// check for the existence of the upload folder
// TODO: try to create the upload folder
if (false === is_dir($root_dir))
	if (false === mkdir($root_dir))
		die("Can not create the root_dir $root_dir");

// TODO: this does not work in safe mode, see mkdir manual
foreach (array_keys($allowed_dirs) as $dir) {
	$child_dir = $root_dir. $dir;
	if (false === is_dir($child_dir))
		if (false === mkdir($child_dir))
			die ("Could not create the upload folder $child_dir");
}

?>