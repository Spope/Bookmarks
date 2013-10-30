<?php
include('config.php');

$connexion = connect_bd(SERVER,USER,PASSWORD,BASE_NAME);
$idUser = 1;
//
function connect_bd($server, $user, $password, $base_name) {
    $connexion = mysql_connect($server,$user,$password)
        or die("Impossible de se connecter : ".mysql_error());

    $selection_bd = mysql_select_db($base_name, $connexion)
        or die("Impossible de se connecter a la base : ".mysql_error());

    return $connexion;
}

$sql = "SELECT * FROM categorie WHERE user = ".$idUser." ORDER BY position";

$result = mysql_query($sql);
$categories = array();
while($row = mysql_fetch_assoc($result)) {
    array_push($categories, $row);
}

$sql = "SELECT * FROM bookmarks WHERE user = ".$idUser;
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
$categoryConversion = array();
foreach($categories as $k=>$v) {
    $sql = "INSERT INTO category (name, parent, user_id) VALUES ('".$v['nom']."', '".$v['idParent']."','".$v['user']."')";
    mysql_query($sql);
    $categoryConversion[$v['id']] = mysql_insert_id();
}

$sql = "SELECT id FROM category WHERE name = '__default' AND user_id = ".$idUser." LIMIT 1";
$result = mysql_query($sql);
$row = mysql_fetch_assoc($result);
$idFav = $row['id'];
foreach($bookmarks as $k=>$v) {
    $idParent = $v['idParent'] == 0 ? 'NULL' : "'".$v['idParent']."'";
    $idCategory = $v['idCategorie'] == 0 ? $idFav : $categoryConversion[$v['idCategorie']];

    $sql = "INSERT INTO bookmark (name, url, position, parent, user_id, category_id, bookmark_type_id) 
        VALUES ('".$v['nom']."', '".$v['url']."','".$v['position']."',".$idParent.", '".$v['user']."', '".$idCategory."', '".($v['type']+1)."')";

    echo $sql."<br /><br />";

    mysql_query($sql);
}
?>
