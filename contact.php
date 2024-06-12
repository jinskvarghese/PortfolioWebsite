<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // CSV file path
    $filePath = 'submissions.csv';

    // Open CSV file for writing
    $file = fopen($filePath, 'a');

    // Check if file opened successfully
    if ($file) {
        // Write data to CSV file
        fputcsv($file, [$name, $email, $message]);

        // Close the file
        fclose($file);

        // Redirect to thank you page or display success message
        echo "Thank you for your submission!";
    } else {
        // Display error message if file could not be opened
        echo "Error: Unable to save your submission. Please try again later.";
    }
}
?>
