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
	
$file_path = $root_dir. $dir. "/". $file;
	
if (false === opendir($root_dir. $dir))
	die('could not open directory');

if (false === fopen($file_path, 'w'))
	die('could not open file');
	
unlink($file_path);
$result = "({'message': 'ok'})";
	
header('Content-type: text/javascript');
echo($result);
?>