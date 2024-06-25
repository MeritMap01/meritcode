<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$name = $_POST['name'];
	$email = $_POST['email'];
	$phone = $_POST['phone'];
	$message = $_POST['message'];

	// Sender Email and Name 
	$from = stripslashes($_POST['name']) . "<" . stripslashes($_POST['email']) . ">";

	// Recipient Email Address 
	$to = 'marveltheme@gmail.com';

	// Email Subject 
	$subject = 'New Message from theResume Contact Form';

	// Email Header 
	$headers = "From: $from\r\n" .
		"MIME-Version: 1.0\r\n" .

		// Message Body 
		$body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message";

	// Check that data was sent to the mailer.
	if (empty($name) or empty($message) or empty($phone) or !filter_var($email, FILTER_VALIDATE_EMAIL)) {
		echo 'Please fill all the fields and try again.';
		exit;
	}

	// If there are no errors, send the email
	if (mail($to, $subject, $body, $from)) {
		echo 'Thank You! We will be in touch with you very soon.';
	} else {
		echo 'Sorry there was an error sending your message. Please try again';
	}
}
