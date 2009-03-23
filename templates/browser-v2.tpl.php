<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>Browser ng</title>
	<link rel="stylesheet" type="text/css" href="css/browser-v2.css"/>
	<link rel="stylesheet" type="text/css" href="css/slides.css"/>
	<link rel="stylesheet" type="text/css" href="css/upload.css"/>
	
	<script type="text/javascript" src="js/mootools-beta-1.2b2.js"></script>
	<script type="text/javascript" src="js/browser-v2.js"></script>
	<script type="text/javascript" src="js/upload.js"></script>
</head>

<body>
<div id="header">
	<div class="wrapper">
		<a id="logo" href="http://design2use.com">Design2Use.com</a>
		<div id="spacer">&nbsp;</div>
		<ul id="folderList">
			<li><a href="#">Images</a></li>
			<li><a href="#">Movies</a></li>
			<li><a href="#">Text</a></li>
		</ul>
	</div>
</div>

<div id="content">
	<div class="wrapper">
		<ul class="fileList" id="fileList"></ul>
	</div>
</div>

<div id="optionsMenu">
	<div class="wrapper">
		<ul>
			<li id="uploadButton"><a href="#">Upload</a></li>
			<li id="detailsButton"><a href="#">Details</a></li>
		</ul>
	</div>
</div>

<div id="optionsPanel">
	<div class="wrapper">
		<div id="uploadForm">
			<form id="upload_form" method="post" enctype="multipart/form-data" target="upload_iframe" action="result.html">
				<input type="file" name="upload_files[]"/>
			</form>
			<div id="uploadMsg"></div>
			<iframe name="upload_iframe" id="upload_iframe" class="hidden"></iframe>
		</div>
		
		<div id="detailsForm">
			<form id="details_form" method="post">
			<table>
				<tr>
					<td>File name</td>
					<td>
						<input id="fileNameNew"/>
						<input id="fileName" type="hidden"/>
						<input id="fileExt" type="hidden"/>
					</td>
				</tr>
				<tr>
					<td>Description</td>
					<td><textarea id="fileDesc"></textarea></td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td class="tdSave"><input id="detailsSaveButton" type="button" value="Save" onclick="detailsSave()"/></td>
				</tr>
			</table>
			</form>
		</div>
		
		<div id="trashbin" class="trash">&nbsp;</div>
	</div>
</div>

</body>
</html>