<?php
// The upload path containing the child upload folders
$root_dir = 'files/';

// The upload folders and the extensions of the files allowed in those folders.
// Specify multiple extensions separated by space, egg: ".jpg .jpeg .png".
// Extensions are case insensitive.
$allowed_dirs = array("Images" => ".jpg .jpeg .png",
	"Movies" => ".flv",
	"Text" => ".txt" 
);

// size for thumbnail images
$thumb_width = 160;
$thumb_height = 160;

/*
 * DO NOT EDIT BELOW
 */

// TODO: this does not work in safe mode, see mkdir manual

// check for the existence of the upload folder
if (false === is_dir($root_dir))
	if (false === mkdir($root_dir))
		die("Can not create the root_dir $root_dir");

// create the child upload folders
foreach (array_keys($allowed_dirs) as $dir) {
	$child_dir = $root_dir. $dir;
	if (false === is_dir($child_dir))
		if (false === mkdir($child_dir))
			die ("Could not create the upload folder $child_dir");
}

?>