
<!DOCTYPE html>
<html lang="tr" dir="ltr">

<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Practical Solutions In Kids Education</title>
	<style>
		/* body { background-color: #d4ff00; font-family: 'Roboto'; } */
		/* .container { margin: 150px auto; max-width: 960px; max-height: 2000px} */
	</style>
  
</head>

<!-- <body onload="ZiyaretciSayaci4()"> -->
<body>


<?php
session_start();
$sesid = session_id();
 

if(!isset($_COOKIE['coki'])){
setcookie("coki", "$sesid", time()+60);
setcookie("tt", time()+60, time()+60);
}
if(isset($_COOKIE['coki'])){
	if(time() > $_COOKIE['tt']){
	echo "sss";
	setcookie("coki", "", time()-60);
	}

	if($sesid == $_COOKIE['coki']){
	      $count = file_get_contents("https://agahakbatur.github.io/ogreticiler/libs/counter.txt");
	      $count = trim($count);
	      $count = $count + 1;
	      $fl = fopen("counter.txt","w+");
	      fwrite($fl,$count);
	      fclose($fl);
	      setcookie("coki", "Ok", time()+60);
	} 
	  

}

 $count = file_get_contents("https://agahakbatur.github.io/ogreticiler/libs/counter.txt");
 ?>
<h1>Website Visitor Counter In PHP</h1>
<br/>
<h2>Visitor Counter : <?php echo $count; ?></h2>

	
  <header>
	<!-- <label style="color:white;display:block;font-family:'Segoe Script';text-align:center;align-items:center;place-items:center"> -->
    <label style="color:white;display:block;font-family:'Brush Script MT', cursive;text-align:center;align-items:center;place-items:center">
        <font size="6">
        <strong>Practical Solutions In Kids Education</strong>
        </font>
    </label>
    <!-- <label style="color:rgb(210, 242, 248);display:block;font-family: 'Segoe Script';text-align:center;align-items:center;place-items:center"> -->
    <label style="color:rgb(210, 242, 248);display:block;font-family:'Brush Script MT', cursive;text-align:center;align-items:center;place-items:center">	    
        <!-- <font size="3" face="Segoe Script"> -->
	<font size="3">
        <strong>Küçüklerin Eğitiminde Pratik Çözümler</strong>
        </font>
    </label>
  </header>
    <!-- FOLDER DEĞİŞİMİ YDr -->
	<!-- <link rel="stylesheet" href="https://agahakbatur.github.io/ogreticiler/libs/mainmenuMobile.css"> -->
	<!-- <link rel="stylesheet" href="/libs/mainmenuMobile.css"> -->
	<link rel="stylesheet" href="https://agahakbatur.github.io/ogreticiler/libs/mainmenuMobile.css">


  

  <div class="nav">
    <nav>
        <a href="javascript:void(0);" class="mobile-menu-trigger">Ana Menu</a>
        <ul class="menu menu-bar">
            <li>
                <a href="javascript:void(0);" class="menu-link menu-bar-link" aria-haspopup="true">
                    Tüm Öğreticiler</a>
                <ul class="mega-menu mega-menu--multiLevel">
                    <!-- alt menü sahibi olan ilk alt menü -->
                    <li hidden>
                        <a href="javascript:void(0);" class="menu-link mega-menu-link" aria-haspopup="true">1.1 Flyout
                            link</a>
                        <ul class="menu menu-list">
                            <li>
                                <a href="/page" class="menu-link menu-list-link">1.1.1 Page link</a>
                            </li>
                            <li>
                                <a href="javascript:void(0);" class="menu-link menu-list-link"
                                    aria-haspopup="true">1.1.2 Flyout link</a>
                                <ul class="menu menu-list">
                                    <li>
                                        <a href="/page" class="menu-link menu-list-link">1.1.2.1 Page link</a>
                                    </li>
                                    <li>
                                        <a href="/page" class="menu-link menu-list-link">1.1.2.2 Page link</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="/page" class="menu-link menu-list-link">1.1.3 Page link</a>
                            </li>
                        </ul>
                    </li>
                    <!-- alt menü sahibi olan ikinci alt menü -->
                    <li hidden>
                        <a href="javascript:void(0);" class="menu-link mega-menu-link" aria-haspopup="true">1.2 Flyout
                            link</a>
                        <ul class="menu menu-list">
                            <li>
                                <a href="/page" class="menu-link menu-list-link">1.2.1 Page link</a>
                            </li>
                            <li>
                                <a href="/page" class="menu-link menu-list-link">1.2.2 Page link</a>
                            </li>
                        </ul>
                    </li>
                    <!-- alt menü sahibi olan üçüncü alt menü -->
                    <li hidden>
                        <a href="javascript:void(0);" class="menu-link mega-menu-link" aria-haspopup="true">1.3 Flyout
                            link</a>
                        <ul class="menu menu-list">
                            <li>
                                <a href="/page" class="menu-link menu-list-link">1.3.1 Page link</a>
                            </li>
                            <li>
                                <a href="/page" class="menu-link menu-list-link">1.3.2 Page link</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <!-- FOLDER DEĞİŞİMİ YDr -->
                        <!-- <a href="https://agahakbatur.github.io/ogreticiler/mat_saat.html" class="menu-link mega-menu-link">Saatleri Okumayı Öğrenelim</a> -->
                        <!-- <a href="/mat_saat.html" class="menu-link mega-menu-link">Saatleri Okumayı Öğrenelim</a> -->
                        <a href="https://agahakbatur.github.io/ogreticiler/mat_saat.html" class="menu-link mega-menu-link">Saatleri Okumayı Öğrenelim</a>
                    </li>
                    <li class="mobile-menu-back-item">
                        <a href="javascript:void(0);" class="menu-link mobile-menu-back-link">Back</a>
                    </li>
                </ul>
            </li>
            
            <!-- sondaki statik link -->
            <li> <!-- FOLDER DEĞİŞİMİ YDr -->
                <!-- <a href="https://agahakbatur.github.io/ogreticiler/about.html" class="menu-link menu-bar-link">Hakkında</a> -->
                <a href="https://agahakbatur.github.io/ogreticiler/about.html" class="menu-link menu-bar-link">Hakkında</a>
            </li>

            <li class="mobile-menu-header"> <!-- FOLDER DEĞİŞİMİ YDr -->
                <!-- <a href="https://agahakbatur.github.io/ogreticiler/index.html" class=""> -->
                <a href="https://agahakbatur.github.io/ogreticiler/index.html" class="">
                    <span>Ana Sayfa</span>
                </a>
            </li>
        </ul>
    </nav>
</div>
<!-- <div style="position: absolute; left: 50%;bottom:15px;text-align:center;align-items:center;place-items:center"> -->

<!-- </div> -->
<div style="position: absolute; left: 50%;bottom: 0;text-align:center;align-items:center;place-items:center">
    <label style="color:rgb(210, 242, 248);display:inline-block;;font-family: 'Arial';text-align:center;align-items:center;place-items:center">
        <font size="2">
        <strong>v0.80-Counter: </strong>
        </font>
        <label id="idZiyaretciSayaci" style="color:rgb(210, 242, 248);display:inline-block;;font-family: 'Arial';text-align:center;align-items:center;place-items:center">
            <font size="2">
            <strong>0</strong>
            </font>
        </label>
    </label>
</div>
<!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>
    $.ajax({
      url: 'https://agahakbatur.github.io/ogreticiler/libs/increase_counter.php',
      type: 'POST',
      success: function(counterVal){
        // alert("The link has been clicked " + counterVal + " times.")
      }
    });
</script> -->
</body>
</html>
