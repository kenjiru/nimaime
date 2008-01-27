<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>Browser</title>
	<link rel="stylesheet" type="text/css" href="css/browser.css"/>
	<link rel="stylesheet" type="text/css" href="css/slides.css"/>
	
	<script type="text/javascript" src="js/mootools-beta-1.2b2.js"></script>
	<script type="text/javascript" src="js/browser2.js"></script>
</head>

<!-- TODO:
- css: cand apas dublu click pe un elem. din "optionsMenu" nu-l selecteze. 
- javascript: calcularea dim. pt. "folderList" -->

<body>

<div id="leftPanel">
	<div id="titleBar">Folder list</div>
	<ul id="folderList">
		<? foreach ($child_dirs as $dir) { ?>
			<li class="folder" id="<?= $dir ?>"><?= $dir ?></li>
		<? } ?>
		<li class="trash" id="trashFolder">Trash</li>
	</ul>
</div>

<div id="rightContainer">

	<div id="rightPanel">
		<div id="titleBar">File List </div>
		<ul id="fileList" class="fileList">
			<!-- lista de fisiere vine aici -->
		</ul>
	</div>

	<div id="optionsPanel">
		<div id="optionsMenu">
			<ul>
				<li id="uploadButton">Upload</li>
			</ul>
		</div>
		<div id="uploadForm">Upload form</div>
	</div>

 </div>
</body>
</html>