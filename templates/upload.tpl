<html><head><title>-</title></head><body>
<p>Upload result!</p>
<script type="text/javascript">
var parDoc = window.parent.document;
var upload_results = parDoc.getElementById("upload_results");
upload_results.msg = "<?= $upload_msg ?>";

upload_results.files = [
	<?= $upload_json ?>
];

upload_results.update();
</script>
</body></html>