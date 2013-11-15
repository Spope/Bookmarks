<?php
//http://devserver2.com/thomas/bookmarks/server/db/databaseConversion/conversion.php
include('config.php');

$connexion = connect_bd(SERVER,USER,PASSWORD,BASE_NAME);
//
function connect_bd($server, $user, $password, $base_name) {
    $connexion = mysql_connect($server,$user,$password)
        or die("Impossible de se connecter : ".mysql_error());

    $selection_bd = mysql_select_db($base_name, $connexion)
        or die("Impossible de se connecter a la base : ".mysql_error());

    return $connexion;
}


//BEGIN
$sql = "SELECT * FROM user";
$resultUser = mysql_query($sql);


while($row = mysql_fetch_assoc($resultUser)) {

    $user = $row;

    $connexion = connect_bd(SERVER,USER,PASSWORD,BASE_NAME);

    $sql = "SELECT * FROM categorie WHERE user = ".$user['id']." ORDER BY position";

    $result = mysql_query($sql);
    $categories = array();
    while($row = mysql_fetch_assoc($result)) {
        array_push($categories, $row);
    }

    $sql = "SELECT * FROM bookmarks WHERE user = ".$user['id'];
    $result = mysql_query($sql);
    $bookmarks = array();
    while($row = mysql_fetch_assoc($result)) {
        array_push($bookmarks, $row);
    }

    mysql_close($connexion);

    //////////////////
    //////IMPORT
    //////////////////

    $connexion2 = connect_bd(SERVER_N,USER_N,PASSWORD_N,BASE_NAME_N);
    //user
    if($user['id'] == 1) {
        $idUser = 1;
    }else{
        $sql = "INSERT INTO user (username, roles, created) VALUES ('".$user['login']."', 1, '".(date("Y-m-d H:i:s"))."')";
        mysql_query($sql);
        $idUser = mysql_insert_id();
    }

    //category
    $categoryConversion = array();
    foreach($categories as $k=>$v) {
        $name = utf8_decode(html_entity_decode($v['nom']));
        $sql = "INSERT INTO category (name, parent, user_id) VALUES ('".$name."', '".$v['idParent']."','".$idUser."')";
        mysql_query($sql);
        $categoryConversion[$v['id']] = mysql_insert_id();
    }

    //bookmark
    $bookmarkConversion = array();
    $sql = "SELECT id FROM category WHERE name = '__default' AND user_id = ".$idUser." LIMIT 1";
    $result = mysql_query($sql);
    $row = mysql_fetch_assoc($result);
    $idFav = $row['id'];

    convertB($bookmarks, $idUser);

}

function convertB($bookmarks, $idUser) {

    GLOBAL $bookmarkConversion;
    GLOBAL $categoryConversion;
    GLOBAL $idFav;

    foreach($bookmarks as $k=>$v) {
        if($v['idParent'] == 0 || isset($bookmarkConversion[$v['idParent']])) {

            $idParent = $v['idParent'] == 0 ? 'NULL' : "'".$bookmarkConversion[$v['idParent']]."'";
            $idCategory = $v['idCategorie'] == 0 ? $idFav : $categoryConversion[$v['idCategorie']];
            $name = utf8_decode(html_entity_decode($v['nom']));

            $sql = "INSERT INTO bookmark (name, url, position, parent, user_id, category_id, bookmark_type_id) 
                VALUES ('".$name."', '".$v['url']."','".$v['position']."',".$idParent.", '".$idUser."', '".$idCategory."', '".($v['type']+1)."')";

            mysql_query($sql);

            $bookmarkConversion[$v['id']] = mysql_insert_id();

            unset($bookmarks[$k]);
        }
    }

    if(count($bookmarks) > 0) {

            convertB($bookmarks, $idUser);
        }
}

?>
