<?php foreach ($files_arr as $file) { ?>
<li class="file">
	<div class="thumb normal">
		<img src="<?= $file['img'] ?>" alt="<?= $file['name'] ?>"  title="<?= $file['name'] ?>" desc="<?= $file['desc'] ?>"/>
	</div>
	<div class="name"><?= $file['name'] ?></div>
</li>
<? } ?>