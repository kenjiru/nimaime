<?php
require_once ("includes/config.inc.php");

$dir = null;
if (isset($_GET['dir']))
	$dir = $_GET['dir'];
else
	die ('dir variable not specified');

if (false === ($dir_h = opendir($root_dir. $dir)))
	die ('could not open directory');

// we are listing the files in a directory
$files_arr = array();
	
while (false !== ($file = readdir ($dir_h))) {
	if (is_file($root_dir. $dir. "/". $file)) {
		$f['name'] = $file;
		$f['img'] = "";
		
		$ext = substr($file, strrpos($file, '.'));
		if ($ext === ".jpg" || $ext === ".txt") {
			$f['img'] =  "thumbnail.php?dir=". $dir. "&file=". $file;
		} elseif ($ext === ".flv") {
			$f['img'] = "img/movie.png";
		}
		
		$files_arr[] = $f;
	}
}

include("templates/list.tpl");
?>