

var aktifSoruIndexi = 0;
var aktifSoruMetni = "";
var maxSoruSayisi = 0;
const ickullanim = new Set();
const tams = new Set();
const geces = new Set();
const ceyreks = new Set();
const kalas = new Set();
const yarims = new Set();
var BirlesikSetler = new Set();
var boolTams = true;
var boolGeces = false;
let boolCeyreks = false;
let boolKalas = false;
let boolYarims = false;

function kategoriTams() {
    boolTams = document.getElementById('cbBir').checked
    aktifSoruIndexi = 0;
    aktifSoruMetni = "";
    maxSoruSayisi = 0;
    CreateSets();
    return setNo();
}
function kategoriYarims() {
    boolYarims = document.getElementById('cbIki').checked
    aktifSoruIndexi = 0;
    aktifSoruMetni = "";
    maxSoruSayisi = 0;
    CreateSets();
    return setNo();
}
function kategoriCeyreks() {
    boolCeyreks = document.getElementById('cbUc').checked
    aktifSoruIndexi = 0;
    aktifSoruMetni = "";
    maxSoruSayisi = 0;
    CreateSets();
    return setNo();
}
function kategoriGeces() {
    boolGeces = document.getElementById('cbDort').checked
    aktifSoruIndexi = 0;
    aktifSoruMetni = "";
    maxSoruSayisi = 0;
    CreateSets();
    return setNo();
}

function kategoriKalas() {
    boolKalas = document.getElementById('cbBes').checked
    aktifSoruIndexi = 0;
    aktifSoruMetni = "";
    maxSoruSayisi = 0;
    CreateSets();
    return setNo();
}

function baslangictaCalis()
{
CreateSets();
return setNo();
}
      
function OncekiSoru() {
    if (aktifSoruIndexi > 0) {
        aktifSoruIndexi--;
    }

    SonrakiOncekiBasildi = true;
    return setNo();
}

function SonrakiSoru() {
    if (aktifSoruIndexi < maxSoruSayisi-1) {
    aktifSoruIndexi++;
    }
    
    SonrakiOncekiBasildi = true;

    return setNo();
}

function butonlariDegerlendirDisabledYap() {
    if (aktifSoruIndexi == 0) {
        document.getElementById('btnPrev').disabled = true;
        document.getElementById('btnNext').disabled = false;
        return;
    }
    if (aktifSoruIndexi == maxSoruSayisi-1) {
        document.getElementById('btnNext').disabled = true;
        document.getElementById('btnPrev').disabled = false;
        return;
    }
    if (aktifSoruIndexi < maxSoruSayisi-1) {
        document.getElementById('btnNext').disabled = false;
    }

    if (aktifSoruIndexi > 0) {
        document.getElementById('btnPrev').disabled = false;
    }
}

function setNo() {
    butonlariDegerlendirDisabledYap();

    aktifSoruMetni = Array.from(BirlesikSetler)[aktifSoruIndexi]
    SoruyuSaateYukle(aktifSoruMetni);

    document.getElementById('idSoruIndex').style.fontWeight = "bold";
    document.getElementById('idSoruIndex').style.fontSize = "150%";
    document.getElementById('idSoruSayisi').style.fontSize = "150%";
    document.getElementById("idSoruIndex").innerText = (aktifSoruIndexi+1)+". soru";
    document.getElementById("idSoruSayisi").innerText = maxSoruSayisi + " soru var";

    return;
}

function SetleriBirlestir() {
    if (BirlesikSetler.size > 0) {
        BirlesikSetler.clear();
    }

    if (boolTams === true) {
        BirlesikSetler = new Set(tams);
    }

    if (boolGeces === true) {
        if (BirlesikSetler.size = 0) {
            BirlesikSetler = new Set(geces);
        } else {
            BirlesikSetler = new Set([...BirlesikSetler, ...geces]);
        }

    }

    if (boolCeyreks === true) {
        if (BirlesikSetler.size = 0) {
            BirlesikSetler = new Set(ceyreks);
        } else {
            BirlesikSetler = new Set([...BirlesikSetler, ...ceyreks]);
        }
    }
    if (boolKalas === true) {
        if (BirlesikSetler.size = 0) {
            BirlesikSetler = new Set(kalas);
        } else {
            BirlesikSetler = new Set([...BirlesikSetler, ...kalas]);
        }
    }
    if (boolYarims === true) {
        if (BirlesikSetler.size = 0) {
            BirlesikSetler = new Set(yarims);
        } else {
            BirlesikSetler = new Set([...BirlesikSetler, ...yarims]);
        }
    }

}
function CreateSets() {
    CreateSetIcKullanim();
    CreateSetTams();
    CreateSetGeces();
    CreateSetKalas();
    CreateSetCeyreks();
    CreateSetYarims();
    SetleriBirlestir();
    // BirlesikSetiAlfabetikSırala(); // BUNA GEREK YOK
    BirlesikSetiKaristir();
    maxSoruSayisi = BirlesikSetler.size
}
function BirlesikSetiKaristir() {
    // Seti Karıştırıyoruz
    let birlesikDiziArray = Array.from(BirlesikSetler);
    BirlesikSetler.clear
    birlesikDiziArray = diziyiKaristir4(birlesikDiziArray);
    BirlesikSetler =  new Set(birlesikDiziArray);
}
function BirlesikSetiAlfabetikSırala() {
    // SIRALAMA YAPIYORUZ
    const siralanmisDizi = [...BirlesikSetler].sort();
    BirlesikSetler.clear
    BirlesikSetler = new Set(siralanmisDizi);
}
function CreateSetYarims() {
    
    if (yarims.size > 0) {
        yarims.clear();
    }
    
    for (let i = 0; i < ickullanim.size; i++) {
        yarims.add(Array.from(ickullanim)[i]+":30");
    }
}

function CreateSetCeyreks() {
    
    if (ceyreks.size > 0) {
        ceyreks.clear();
    }
    
    for (let i = 0; i < ickullanim.size; i++) {
        ceyreks.add(Array.from(ickullanim)[i]+":15");
        ceyreks.add(Array.from(ickullanim)[i]+":45");
    }
}


function CreateSetKalas() {
    
    if (kalas.size > 0) {
        kalas.clear();
    }
    
    for (let i = 0; i < ickullanim.size; i++) {
        kalas.add(Array.from(ickullanim)[i]+":35");
        kalas.add(Array.from(ickullanim)[i]+":40");
        kalas.add(Array.from(ickullanim)[i]+":50");
        kalas.add(Array.from(ickullanim)[i]+":55");
    }
}
function CreateSetGeces() {
    
    if (geces.size > 0) {
        geces.clear();
    }
    
    for (let i = 0; i < ickullanim.size; i++) {
        geces.add(Array.from(ickullanim)[i]+":05");
        geces.add(Array.from(ickullanim)[i]+":10");
        geces.add(Array.from(ickullanim)[i]+":20");
        geces.add(Array.from(ickullanim)[i]+":25");
    }
}
function CreateSetTams() {
    
    if (tams.size > 0) {
        tams.clear();
    }
    
    for (let i = 0; i < ickullanim.size; i++) {
        tams.add(Array.from(ickullanim)[i]+":00");
    }
}
function CreateSetIcKullanim() {
    if (ickullanim.size > 0) {
        ickullanim.clear();
    }

    ickullanim.add("01");
    ickullanim.add("02");
    ickullanim.add("03");
    ickullanim.add("04");
    ickullanim.add("05");
    ickullanim.add("06");
    ickullanim.add("07");
    ickullanim.add("08");
    ickullanim.add("09");
    ickullanim.add("10");
    ickullanim.add("11");
    ickullanim.add("12");
}
function diziyiKaristir(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  function diziyiKaristir2(array) { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

  const diziyiKaristir3 = array => {
    // alert("İÇ array.length: "+array.length)
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    // alert("İÇ ÇIKIŞ array.length: "+array.length)
    return array;
  }

  function diziyiKaristir4(array){
    // alert("İÇ array.length: "+array.length)
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    // alert("İÇ ÇIKIŞ array.length: "+array.length)
    return array;
  }