<?php foreach ($files_arr as $file) { ?>
<li class="file">
	<div class="thumb normal"><img src="<?= $file['img'] ?>"/></div>
	<div class="name"><?= $file['name'] ?></div>
</li>
<? } ?>