<?php
require_once ("includes/config.inc.php");
require_once ("includes/thumbnail.inc.php");

if (isset($_GET['dir']))
	$dir = $_GET['dir'];
else
	die('dir variable not specified');
	
// check if the directory is allowed
if (false === array_key_exists($dir, $allowed_dirs))
	die('Error: The directory is not allowed.');
	
// check that the folder has associated extensions
if ($allowed_dirs[$dir] === "") 
	die('Error: No extensions specified for this directory. <br/>'.
		'Please check the configuration file!');

$dir = $root_dir. $dir. "/";
$dir_thumbnails = $dir. "thumbnails/";
	
if (false === ($dir_h = opendir($dir)))
	die('could not open directory');

if (false === is_dir($dir_thumbnails))
	if(false === mkdir($dir_thumbnails))
		die('could not create thumbnails directory');

// try to open the xml file
$xml_file = $dir. "contents.xml";
$xml = null;
if (file_exists($xml_file))
	$xml = simplexml_load_file($xml_file);
else
	$xml = simplexml_load_string("<folder></folder>");
	
// remove absolite entries from the xml file
$xml_file_names = array();
for ($i=0; $i < count($xml->file); $i++) {
	$file = $xml->file[$i]->name;
	if (is_file($dir. $file))
		$xml_file_names[] = $file;
	else
		unset($xml->file[$i]);
}

// add new files to the xml file, create thumbnails
while (false !== ($file = readdir ($dir_h))) {
	if (is_file($dir. $file) && $file !== "contents.xml") {
		// check for thumbnail, create one if missing
		if(false === file_exists($dir_thumbnails. $file))
			create_thumbnail($dir, $file);
		// check if we need to add a new entry to the xml file
		if(!in_array($file, $xml_file_names)) {
			$file_entry = $xml->addChild('file');
			$file_entry->addChild('name', $file);
			$file_entry->addChild('description', '');
		}
	}
}

// generate the final array of files
$files_arr = array();
foreach($xml->file as $file) {
	$new_file['name'] = $file->name;
	$new_file['desc'] = $file->description;
	// determine the thumbnail image
	$ext = substr($file->name, strrpos($file->name, '.'));
	$ext = strtolower($ext);
	// TODO: create a list of supported thumbnail extensions
	if ($ext === ".jpg" || $ext === ".jpeg" || $ext === ".png" || $ext === ".txt")
		$new_file['img'] = $dir_thumbnails. $file->name;
	elseif ($ext === ".flv")
		$new_file['img'] = "img/movie.png";
	$files_arr[] = $new_file;
}

// save the xml file
$xml->asXML($xml_file);

include("templates/list.tpl.php");
?>