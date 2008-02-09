<?php
require_once ("includes/config.inc.php");

$ignore_dirs = array ('.', '..', 'upload');
$child_dirs = array();

if (false === ($dir_h = opendir($root_dir)))
	die('could not open directory');

while (false !== ($dir = readdir ($dir_h))) {
	if (array_search($dir, $ignore_dirs) === false &&
		$dir[0] != "." && is_dir ($root_dir. $dir)) {
		array_push ($child_dirs, $dir);
	}
}

require_once ("templates/browser.tpl.php");
?>