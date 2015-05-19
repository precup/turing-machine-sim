<?php

$to      = 'maxwang7@stanford.edu, mprecup@stanford.edu, htiek@cs.stanford.edu, kgibb@stanford.edu, jaymoon@stanford.edu';
$subject = 'TM says hi!';
$message = 'Hi everyone! This email is being sent by the PHP server in restricted (I wanted to test that everything works). Keith, I can set up the automatic emails, but I have two questions: 1) What email account should I use? I could just forward everything to a new Gmail account. 2) What kind of information should be included in the automatic emails? Have a great day everyone, I can\'t wait to deploy!\r\n+Max';
$headers = 'From: maxwang7@stanford.edu' . "\r\n" .
'Reply-To: maxwang7@stanford.edu' . "\r\n" .
'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);
