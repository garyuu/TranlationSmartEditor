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
                    $fp = fopen($filename, 'r');
                    $result['message'] = fread($fp, filesize($filename));
                    fclose($fp);
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
        $result['message'] = "Wrong password: ".md5($_POST['password'])." HASH: ".$PASSWORD_HASH." ".strcmp(md5($_POST['password']), $PASSWORD_HASH);
    }
}
else {
    $result['message'] = "No password";
}

header('Content-Type: application/json');
echo json_encode($result);
?>
