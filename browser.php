<?php
require_once ("includes/config.inc.php");

$ignore_dirs = array ('.', '..', 'upload');
$child_dirs = array();

if (false === ($dir_h = opendir($root_dir)))
	die('could not open directory');

while (false !== ($child_dir = readdir ($dir_h))) {
	if (is_dir ($root_dir. $child_dir) &&
		array_search($child_dir, $ignore_dirs) === false && $child_dir[0] != "." && 
		array_key_exists($child_dir, $allowed_dirs)) {
		array_push ($child_dirs, $child_dir);
	}
}

if (isset($_GET['v']) && $_GET['v'] === "1")
	require_once ("templates/browser.tpl.php");
else
	require_once ("templates/browser-v2.tpl.php");
?>