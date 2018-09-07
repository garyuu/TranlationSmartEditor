<?php
define('FILE_PATH', 'files');

require('password.php'); // Define PASSWORD_HASH

function checkPasswordHash($pwdHash) {
    return $pwdHash === PASSWORD_HASH;
}

$result = array(
    'status' => false,
    'message' => "",
);
if (isset($_POST['password'])) {
    if (checkPasswordHash(md5($_POST['password']))) {
        try {
            if (isset($_POST['title'])) {
                $filename = FILE_PATH.'/'.$_POST['title'].'.json';
                if (isset($_POST['content'])) {
                    $fp = fopen($filename, 'w');
                    fwrite($fp, $_POST['content']);
                    fclose($fp);
                }
                else {
                    if (file_exist($filename)) {
                        $fp = fopen($filename, 'r');
                        $result['message'] = fread($fp, filesize($filename));
                        fclose($fp);
                    }
                    else {
                        throw new Exception("No file named this title");
                    }
                }
                $result['status'] = true;
            }
            else {
                throw new Exception("No title");
            }
        }
        catch(Exception $e) {
            $result['message'] = $e->getMessage();
        }
    }
    else {
        $result['message'] = "Wrong password";
    }
}
else {
    $result['message'] = "No password";
}

header('Content-Type: application/json');
echo json_encode($result);
?>
