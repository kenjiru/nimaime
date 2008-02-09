<?php
// TODO: output JSON code for error messages
require_once ("includes/config.inc.php");

$dir = null;
if (isset($_GET['dir']))
	$dir = $_GET['dir'];
else
	die('dir variable not specified');

$file = null;
if (isset($_GET['file']))
	$file = $_GET['file'];
else
	die('file variable not specified');

$dir = $root_dir. $dir. "/";
$dir_thumbnails = $dir. "thumbnails/";
	
if (false === is_dir($dir))
	die('could not open directory');

if (fopen($dir. $file, 'w'))
	unlink($dir. $file);
else
	die('could not open file');

if (is_file($dir_thumbnails. $file))
	unlink($dir_thumbnails. $file);

// remove the entry from the xml file
$xml_file = $dir. "contents.xml";
if (file_exists($xml_file)) {
	$xml = simplexml_load_file($xml_file);
	
	for ($i=0; $i < count($xml->file); $i++) {
		$file_name = $xml->file[$i]->name;
		if($file == $file_name)
			unset($xml->file[$i]);
	}
	// save the xml file
	$xml->asXML($xml_file);
}

$result = "({'message': 'ok'})";
	
header('Content-type: text/javascript');
echo($result);
?>