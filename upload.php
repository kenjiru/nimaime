<?php
require_once ("includes/config.inc.php");

define("UPLOAD_ERROR", "upload error (file too big)");
define("UPLOAD_MOVE_ERROR", "could not move the file");
define("UPLOAD_WRONG_EXTENSION", "wrong extension");
define("UPLOAD_FILE_EXISTS", "same file exists");

// TODO: check if the user is logged in

$dir = null;
if (isset($_GET['dir']))
	$dir = $_GET['dir'];
else
	die ('dir variable not specified or not valid');

if (!is_dir($root_dir. $dir))
	die('not a valid directory!');

// determine the allowed extensions
$expected_ext = "none";
switch ($dir) {
	case "Movies":
		$expected_ext = ".flv";
		break;
	case "Text":
		$expected_ext = ".txt";
		break;
	case "Images":
		$expected_ext = ".jpg";
		break;
}

$upload_files = null;
if (isset($_FILES["upload_files"]))
	$upload_files = $_FILES["upload_files"];
else
	die('No files specified!');

// mutam fisierele, verificam daca au fost erori
$upload_moved = array();
$upload_errors = array();

for($i=0; $i< count($upload_files["name"]);$i++) {
	// check for upload errors
	$error = $upload_files["error"][$i];
	if ($error != 0) {
		$upload_errors[] = array($file_name, UPLOAD_ERROR); 
		continue;
	}
	// check for the extension
	$file_name = $upload_files["name"][$i]; 
	$file_ext = strtolower(strrchr($file_name,"."));
	if ($file_ext !== $expected_ext) {
		$upload_errors[] = array($file_name, UPLOAD_WRONG_EXTENSION);
		continue;
	}
	// check if the file already exists
	$file_path = $root_dir. $dir. "/". $file_name;
	if (is_file($file_path)) {
		$upload_errors[] = array($file_name, UPLOAD_FILE_EXISTS);
		continue;
	}
	// move the file
	if (move_uploaded_file($upload_files["tmp_name"][$i], $file_path))
		$upload_moved[] = $file_name;
	else 
		$upload_errors[] = array($file_name, UPLOAD_MOVE_ERROR);

}

// compute the upload message
$upload_msg = "";
if(count($upload_errors) == 0) {
	$upload_msg = "Success: all the files uploaded successfully!";
} else {
	if(count($upload_moved) == 0)
		$upload_msg = "Fatal: no files could be upload! <br/>";
	else 
		$upload_msg = "Attention: some files could not be uploaded: <br/>";
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
	switch ($expected_ext) {
		case ".flv":
			$src = "img/movie.png";
			break;
		case ".txt":
			$src = "thumbnail.php?dir=". $dir. "&file=". $file;
			break;
		case ".jpg":
			$src = "thumbnail.php?dir=". $dir. "&file=". $file;
			break;
	}

	$upload_json .= "{'name': '". $file. "', 'src': '". $src. "'},";
}
$upload_json = substr($upload_json, 0, -1);

include("templates/upload.tpl");

?>