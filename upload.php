<?php
require_once ("includes/config.inc.php");
require_once ("includes/thumbnail.inc.php");

define("UPLOAD_ERROR", "upload error (file too big)");
define("UPLOAD_MOVE_ERROR", "could not move the file");
define("UPLOAD_WRONG_EXTENSION", "wrong extension");
define("UPLOAD_FILE_EXISTS", "same file exists");

if (isset($_GET['dir']))
	$dir = $_GET['dir'];
else
	die('dir variable not specified');

// check if the directory is allowed
if (false === array_key_exists($dir, $allowed_dirs))
	die('the directory is not allowed');
	
$dir_name = $dir;
$dir = $root_dir. $dir. "/";
$dir_thumbnails = $dir. "thumbnails/";

if (false === is_dir($dir))
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

$upload_files = null;
if (isset($_FILES["upload_files"]))
	$upload_files = $_FILES["upload_files"];
else
	die('No files specified!');

// check that the folder has associated extensions
if ($allowed_dirs[$dir_name] === "") 
	die('No extensions specified for this directory');

// move the files
$upload_moved = array();
$upload_errors = array();

for($i=0; $i< count($upload_files["name"]);$i++) {
	// check for upload errors
	$error = $upload_files["error"][$i];
	if ($error != 0) {
		$upload_errors[] = array($file_name, UPLOAD_ERROR); 
		continue;
	}
	// check if the extension is allowed for the folder
	$file_name = $upload_files["name"][$i]; 
	$file_ext = strtolower(strrchr($file_name,"."));
	// create an array with the allowed extensions for the upload folder
	$dir_allowed_exts = preg_split('/ /', $allowed_dirs[$dir_name]);
	if (false === in_array($file_ext, $dir_allowed_exts)) {
		$upload_errors[] = array($file_name, UPLOAD_WRONG_EXTENSION);
		continue;
	}
	// check if the file already exists
	$file_path = $dir. $file_name;
	if (is_file($file_path)) {
		$upload_errors[] = array($file_name, UPLOAD_FILE_EXISTS);
		continue;
	}
	// move the file
	if (move_uploaded_file($upload_files["tmp_name"][$i], $file_path)) {
		$upload_moved[] = $file_name;
	} else {
		$upload_errors[] = array($file_name, UPLOAD_MOVE_ERROR);
		continue;
	}
	// create thumbnail
	create_thumbnail($dir, $file_name);
	// add entries to the xml file
	$file_entry = $xml->addChild('file');
	$file_entry->addChild('name', $file_name);
	$file_entry->addChild('description', '');
}

// compute the upload message
$upload_msg = "";
if(count($upload_errors) == 0) {
	$upload_msg = "Success: all the files uploaded successfully!";
} else {
	if(count($upload_moved) == 0)
		$upload_msg = "Error: no files could be upload! <br/>";
	else 
		$upload_msg = "Error: some files could not be uploaded: <br/>";
	// list the files not uploaded
	foreach($upload_errors as $error) {
		$upload_msg .= "'". $error[0]. "' reason: ". $error[1]. "<br/>";
	}
}
$upload_msg = $upload_msg;

// compute the list of successfully uploaded files
$upload_json = "";
foreach ($upload_moved as $file) {
	// determine the thumbnail image
	$src = "";
	$ext = substr($file, strrpos($file, '.'));
	$ext = strtolower($ext);
	if ($ext === ".jpg" || $ext === ".jpeg" || $ext === ".png" || $ext === ".txt")
		$src = $dir_thumbnails. $file;
	elseif ($ext === ".flv")
		$src = "img/movie.png";

	$upload_json .= "{'name': '". $file. "', 'src': '". $src. "'},";
}
$upload_json = substr($upload_json, 0, -1);

// save the xml file
$xml->asXML($xml_file);

include("templates/upload.tpl.php");
?>