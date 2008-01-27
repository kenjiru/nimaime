<?php
require_once ("includes/config.inc.php");

$action = null;
if (isset($_GET['action']))
	$action = $_GET['action'];
else
	die ("action not set!");

if ($action == "ls") {
	$files_arr = array();
	
	$dir = null;
	if (isset($_GET['dir']))
		$dir = $_GET['dir'];
	else
		die ('dir variable not specified or not valid');
	
	if (false === ($dir_h = opendir($root_dir. $dir)))
		die ('could not open directory');
	
	while (false !== ($file = readdir ($dir_h))) {
		if (is_file($root_dir. $dir. "/". $file)) {
			$f['name'] = $file;
			$f['img'] = "";
			
			$ext = substr($file, strrpos($file, '.'));
			if ($ext === ".jpg") {
				$f['img'] =  "thumbnail.php?dir=". $dir. "&file=". $file;
			} elseif ($ext === ".flv") {
				$f['img'] = "img/movie.png";
			}
			
			$files_arr[] = $f;
		}
	}
	
	include("templates/cmd-ls.tpl.php");
}
?>