<?php
require_once ("includes/config.inc.php");

if (isset($_POST['dir'], $_POST['file_name'], $_POST['file_name_new'], $_POST['file_ext'])) {
	$dir = $_POST['dir'];
	$file = $_POST['file_name'];
	$file_new = $_POST['file_name_new'];
	$file_ext = $_POST['file_ext'];
} else
	die('POST variables not specified');
// decription is optional	
if(isset($_POST['file_desc']))
	$file_desc = $_POST['file_desc'];

$file = $file. $file_ext;
$file_new = $file_new. $file_ext;
$dir_name = $dir;
$dir = $root_dir. $dir. "/";
$dir_thumbnails = $dir. "thumbnails/";
$xml_file = $dir. "contents.xml";

// move the files
if(is_file($dir. $file)) {
	if(!rename($dir. $file, $dir. $file_new))
		die('could not move file');
} else 
	die('file not found');

if(is_file($dir_thumbnails. $file)) {
	if(!rename($dir_thumbnails. $file, $dir_thumbnails. $file_new))
		die('could not move thumbnail file');
}

// delete the entry from the xml file
$xml_file = $dir. "contents.xml";
$xml = null;
if (file_exists($xml_file))
	$xml = simplexml_load_file($xml_file);
else
	die('could not open xml file!');

for ($i=0; $i < count($xml->file); $i++) {
	if ($xml->file[$i]->name == $file) {
		$xml->file[$i]->name = $file_new;
		$xml->file[$i]->description = $file_desc;
		break;
	}
}
// save the xml file
$xml->asXML($xml_file);

// echo back the data
$result = "({
	'dir': '". $dir_name. "',".
	"'file_name': '". $file. "',".
	"'file_name_new': '". $file_new. "',".
	"'desc': '". $file_desc. "',".
"})";

header('Content-type: text/javascript');
echo($result);
?>