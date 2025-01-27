/*
 * Directly Draggable Analog Clock Timepicker
 *
 * Design by ZulNs @Yogyakarta, February 2016
 *
 * Revised on 25 February 2019:
 *    - Drops timepicker.css
 *    - Adds/changes clock theme
 *    - Changes some public methods
 */
'use strict';
var metniGoster = false;
var aktifSaatiGoster = false;
var DogruCevabiGostermeIzni = false;
var SonrakiOncekiBasildi = false; // DogruCevabiGostermeIzni ayarı ile birlikte Sonraki ya da önceki butonlarına basıldığında kolları göstermemesi için
var sayac = 0;
var ydrH_Soru = 0;
var ydrM_Soru = 0;
var ydr24SaatModu = false;
function Timepicker(isClk,is24H,isLight,hour,minute,LockHands){
	isClk=!!isClk;
	is24H=!!is24H;
	isLight=!!isLight;
	LockHands=!!LockHands;
	// var LockHands = true; //ydr
	hour=hour==undefined?Timepicker.getHours():~~hour%24;
	minute=minute==undefined?Timepicker.getMinutes():~~minute%60;
	let self=this,
		tpick=document.createElement('div'),
		clkFace=document.createElement('canvas'),
		hourHand=document.createElement('canvas'),
		minuteHand=document.createElement('canvas'),
		secondHand=document.createElement('canvas'),
		timeStr=document.createElement('div'),
		jsSorununGoruntulenenSaatMetni=document.createElement('div'), //ydr00
		soruMetni=document.createElement('div'),
		aktifSaat=document.createElement('div'),
		kontrolText=document.createElement('label'),
		pickBtn=document.createElement('button'),
		isHidden=true,
		isPM=hour>=12,
		isHourHand,
		isReverseRotate,
		isDragging=false,
		isFiredByMouse=false,
		touchId,
		lastHourDeg,
		lastMinuteDeg,
		centerX,
		centerY,
		cssTransform=Timepicker.getSupportedTransformProp(),
		timerId,
		second=Timepicker.getSeconds(),
		djcloOpen=true,
		djcReadMode=false,
		english=false,
		soruOkunusMetniolsun=false,
		jsSorudakiStringSaatMetni="",
		jsSorudakiDijitalSaatMetni="",
	onMouseDown=function(e){
		if(!isDragging){
			e=e||window.event;
			e.preventDefault();
			e.stopPropagation();
			isFiredByMouse=true;
			isHourHand=e.target==hourHand;
			onPtrStart(e.pageX,e.pageY)
		}
	},
	onMouseMove=function(e){
		if(isDragging&&isFiredByMouse){
			e=e||window.event;
			e.preventDefault();
			onPtrMove(e.pageX,e.pageY)
		}
	},
	onMouseUp=function(e){
		if(isDragging&&isFiredByMouse){
			e=e||window.event;
			e.preventDefault();
			isDragging=false
		}
	},
	onTouchStart=function(e){
		e=e||window.event;
		if(isDragging&&!isFiredByMouse&&e.touches.length==1)isDragging=false;
		if(!isDragging){
			let touch=e.changedTouches[0];
			e.preventDefault();
			//e.stopPropagation();
			isFiredByMouse=false;
			touchId=touch.identifier;
			isHourHand=touch.target==hourHand;
			onPtrStart(touch.pageX,touch.pageY)
		}
	},
	onTouchMove=function(e){
		if(isDragging&&!isFiredByMouse){
			e=e||window.event;
			let touches=e.changedTouches,touch;
			for(let i=0;i<touches.length;i++){
				touch=touches[i];
				if(touch.identifier==touchId){
					e.preventDefault();
					onPtrMove(touch.pageX,touch.pageY);
					break
				}
			}
		}
	},
	onTouchEnd=function(e){
		if(isDragging&&!isFiredByMouse){
			e=e||window.event;
			let touches=e.changedTouches,touch;
			for(let i=0;i<touches.length;i++){
				touch=touches[i];
				if(touch.identifier==touchId){
					e.preventDefault();
					isDragging=false;
					return
				}
			}
		}
	},
	onPtrStart=function(x,y){
		isDragging=true;
		centerX=tpick.offsetLeft+hourHand.offsetLeft+10;
		centerY=tpick.offsetTop+hourHand.offsetTop+70;
		let last=isHourHand?lastHourDeg:lastMinuteDeg,
			deg=-Math.atan2(centerX-x,centerY-y)*180/Math.PI,
			dif=Math.abs(deg-last);
		isReverseRotate=(160<dif&&dif<200)
	},
	onPtrMove=function(x,y){
		let deg,last,target;
		let buradakiDuzeltme = false;
		if(x!=centerX||y!=centerY){
			deg=-Math.atan2(centerX-x,centerY-y)*180/Math.PI;
			if(isReverseRotate)deg=deg-180;
			if(deg<0)deg+=360;
			target=isHourHand?hourHand:minuteHand;
			rotateElm(target,deg);

			if(isHourHand){
				if((0<=deg&&deg<90&&270<lastHourDeg&&lastHourDeg<360)||(0<=lastHourDeg&&lastHourDeg<90&&270<deg&&deg<360))isPM=!isPM;
				lastHourDeg=deg;
					lastMinuteDeg=deg%30*12;
				if(LockHands){
					minute=6*lastHourDeg/180;
					hour=~~minute;
					minute=Math.floor((minute-hour)*60);
					rotateElm(minuteHand,lastMinuteDeg)  //ydr döndür
				}else{
					hour=~~(6*lastHourDeg/180);
				}
			}else{
				// DAKİKA KOLU TUTULU, minute hand tutulu
						// YAMA AMAÇLI ****SİLME**********************************
						if (isNaN(lastHourDeg)){
							lastHourDeg=304;
						}
						// YAMA AMAÇLI ****SİLME**********************************
					if((270<lastMinuteDeg&&lastMinuteDeg<360&&0<=deg&&deg<90)||(270<deg&&deg<360&&0<=lastMinuteDeg&&lastMinuteDeg<90)){
							lastHourDeg=lastHourDeg+(deg-lastMinuteDeg-Timepicker.sign(deg-lastMinuteDeg)*360)/12;
							if(lastHourDeg<0)lastHourDeg+=360;
							lastHourDeg%=360;
							if(345<lastHourDeg||lastHourDeg<15)isPM=!isPM
					}else{
							lastHourDeg=lastHourDeg+(deg-lastMinuteDeg)/12;
							if(lastHourDeg<0)lastHourDeg+=360;
							lastHourDeg%=360;
					}
				lastMinuteDeg=deg;
				minute=(6*lastHourDeg)/180;
				if(LockHands){
					hour=~~minute;
					minute=Math.floor((minute-(~~minute))*60);
					rotateElm(hourHand,lastHourDeg)  //ydr döndür
				}else{
					minute=Math.floor((minute-(~~minute))*60);
				}
			}
				if (is24H === true && LockHands===true) {
					if(isPM)hour+=12;
				}

			updPickedTm()
		}
	},
	kontrolEtFonksiyon=function(){
		let ydrH = 10
		let ydrM = 7
			let strSaat_metni = "";

			if (jsSorudakiDijitalSaatMetni.includes(" ")) {
				strSaat_metni =jsSorudakiDijitalSaatMetni.split(" ")[0]
			} else {
				strSaat_metni = jsSorudakiDijitalSaatMetni
			}
			ydrH = parseInt(strSaat_metni.split(":")[0]);
			ydrM = parseInt(strSaat_metni.split(":")[1]);
		let sonuc = false;
		let icHour = hour;
		if (ydr24SaatModu) {
			if (icHour < 12) {	
				icHour=icHour+12
			}
		}
		if (ydrH === icHour) {
			if (ydrM === minute) {
				sonuc = true;
			}
		}
		if (sonuc === true) {
			kontrolText.textContent = "Doğru";
			kontrolText.style.color = "green";
		} else {
			kontrolText.textContent = "Yanlış";
			kontrolText.style.color = "red";
		}

		if(typeof self.onPicked=='function')self.onPicked()
	},
updPickedTm=function(){
		if (aktifSaatiGoster) {
			aktifSaat.innerText = getTmStr();
		} else {
			aktifSaat.innerText = "";
		}
		if(!DogruCevabiGostermeIzni){
			if (djcloOpen) {
				if (metniGoster){
					if(djcReadMode){
						timeStr.innerText=okunusaCevir_mother(hour, minute)
					}else{
						timeStr.innerText=getTmStr()
					}
				}
			}
		}
	},
	updClkTm=function(){
		second=Timepicker.getSeconds();
		if(isClk)timerId=setTimeout(updClkTm,1e3-Timepicker.getMillis());
		if(second==0){
			minute=Timepicker.getMinutes();
			hour=Timepicker.getHours();
			updPickedTm()
		}
		updClkPtrs()
	},
	updClkPtrs=function(){
		sayac = sayac + 1;
		let sec=second*6;
		lastMinuteDeg=(minute+sec/360)*6;
		lastHourDeg=(hour%12+lastMinuteDeg/360)*30;
		rotateElm(hourHand,lastHourDeg);
		rotateElm(minuteHand,lastMinuteDeg);
		rotateElm(secondHand,sec);
	},
	saatiOnOnYap=function(){
		aktifSaat.innerText = "10:07"
		let snn=30*6;
		var dak=7;
		var saatt=10;
		dak=(dak+snn/360)*6;
		saatt=(saatt%12+dak/360)*30;
		rotateElm(hourHand,saatt);
		rotateElm(minuteHand,dak);
		rotateElm(secondHand,snn);
	},
	getTmStr=function(){
		let ydricsa = hour;
		if (ydr24SaatModu){
			if (ydricsa < 12) {
				ydricsa = ydricsa+12
			}
		}
		let s=('0'+(ydr24SaatModu?ydricsa:ydricsa%12==0?12:ydricsa%12)).slice(-2)+':'+('0'+minute).slice(-2);
		return s
	},
	getTmStr_Verilen=function(ydrH_Sorudaki,ydrM_Sorudaki){
		let s=('0'+(ydr24SaatModu?ydrH_Sorudaki:ydrH_Sorudaki%12==0?12:ydrH_Sorudaki%12)).slice(-2)+':'+('0'+ydrM_Sorudaki).slice(-2);
		return s
	},
	okunusaCevir_mother=function(ydr_sa, ydr_dk){
		if (ydr24SaatModu){
			if (ydr_sa < 12) {
				ydr_sa = ydr_sa+12
			}
		}
		if (english){
			return okunusaCevirEng(ydr_sa,ydr_dk)
		}else{
			return okunusaCevirTr(ydr_sa,ydr_dk)
	}
	},
	okunusaCevirTr=function(h, m){ 
        let numsM = [ "Sıfır", "Bir", "Iki", "Üç", "Dört", 
			"Beş", "Altı", "Yedi", "Sekiz", "Dokuz", 
			"On", "On Bir", "On Iki", "On Üç", 
			"On Dört", "On Beş", "On Altı", "On Yedi", 
			"On Sekiz", "On Dokuz", "Yirmi", "Yirmi Bir", 
			"Yirmi Iki", "Yirmi Üç", "Yirmi Dört", 
			"Yirmi Beş", "Yirmi Altı", "Yirmi Yedi", 
			"Yirmi Sekiz", "Yirmi Dokuz"]; 
        let numsH = [ "On Iki", "Bir", "Iki", "Üç", "Dört", 
			"Beş", "Altı", "Yedi", "Sekiz", "Dokuz", 
			"On", "On Bir", "On Iki", "On Üç", 
			"On Dört", "On Beş", "On Altı", "On Yedi", 
			"On Sekiz", "On Dokuz", "Yirmi", "Yirmi Bir", 
			"Yirmi Iki", "Yirmi Üç", "Gece Yarısı", 
			"Yirmi Beş", "Yirmi Altı", "Yirmi Yedi", 
			"Yirmi Sekiz", "Yirmi Dokuz"]; 		
        
						if (m == 0) 

							return(numsH[h]); 
						
						else if (m == 1) 
							return(numsH[h] + "'"+ getGeceEki(h) + " bir geçiyor"); 
						
						else if (m == 59) 
							return(numsH[(h % 12) + 1] + "'"+ getKalaEki(h) + " bir var"); 
						
						else if (m == 15) 
							return(numsH[(h % 12)] + "'" +getGeceEki(h) + " çeyrek geçiyor"); 
						
						else if (m == 30) 
							if (h===0){
								return("yarım"); 
							}else{
								return(numsH[h] + " buçuk"); 
							}
						else if (m == 45) 
							return(numsH[(h % 12) + 1] +  "'"+ getKalaEki(h) + " çeyrek var"); 
						
						else if (m <= 30) 
							return(numsH[(h % 12)]  +  "'"+ getGeceEki(h) + " " + numsM[m] + " geçiyor" ); 
						
						else if (m > 30) 
						return( numsH[(h % 12) + 1] +  "'"+ getKalaEki(h) + " " + numsM[60 - m] + " var"); 
    },
	okunusaCevirEng=function(h, m){ 
        let nums = [ "zero", "one", "two", "three", "four", 
                            "five", "six", "seven", "eight", "nine", 
                            "ten", "eleven", "twelve", "thirteen", 
                            "fourteen", "fifteen", "sixteen", "seventeen", 
                            "eighteen", "nineteen", "twenty", "twenty one", 
                            "twenty two", "twenty three", "twenty four", 
                            "twenty five", "twenty six", "twenty seven", 
                            "twenty eight", "twenty nine", 
                        ]; 
        
						if (m == 0) 
							return(nums[h] + " o' clock "); 
						else if (m == 1) 
							return("one minute past " + nums[h]); 
						else if (m == 59) 
							return("one minute to " + nums[(h % 12) + 1]); 
						else if (m == 15) 
							return("quarter past " + nums[h]); 
						else if (m == 30) 
							return("half past " + nums[h]); 
						else if (m == 45) 
							return("quarter to " + nums[(h % 12) + 1]); 
						else if (m <= 30) 
							return( nums[m] + " minutes past " + nums[h]); 
						else if (m > 30) 
						return( nums[60 - m] + " minutes to " + nums[(h % 12) + 1]); 
    },
	rotateElm=function(elm,deg){elm.style[cssTransform]='rotate('+deg+'deg)'},
	scrollToFix=function(){
		let dw=document.body.offsetWidth,
			vw=window.innerWidth,
			vh=window.innerHeight,
			rect=tpick.getBoundingClientRect(),
			hsSpc=dw>vw?20:0,
			scrollX=rect.left<0?rect.left:0,
			scrollY=rect.bottom-rect.top>vh?rect.top:rect.bottom>vh-hsSpc?rect.bottom-vh+hsSpc:0;
		
		window.scrollBy(0, vh);
	},
	addEvts=function(){
		Timepicker.addEvent(hourHand,'mousedown',onMouseDown);
		Timepicker.addEvent(minuteHand,'mousedown',onMouseDown);
		Timepicker.addEvent(document,'mousemove',onMouseMove);
		Timepicker.addEvent(document,'mouseup',onMouseUp);
		if('touchstart' in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0){
			Timepicker.addEvent(hourHand,'touchstart',onTouchStart);
			Timepicker.addEvent(hourHand,'touchmove',onTouchMove);
			Timepicker.addEvent(hourHand,'touchcancel',onTouchEnd);
			Timepicker.addEvent(hourHand,'touchend',onTouchEnd);
			Timepicker.addEvent(minuteHand,'touchstart',onTouchStart);
			Timepicker.addEvent(minuteHand,'touchmove',onTouchMove);
			Timepicker.addEvent(minuteHand,'touchcancel',onTouchEnd);
			Timepicker.addEvent(minuteHand,'touchend',onTouchEnd)
		}
	},
	remEvts=function(){
		Timepicker.removeEvent(hourHand,'mousedown',onMouseDown);
		Timepicker.removeEvent(minuteHand,'mousedown',onMouseDown);
		Timepicker.removeEvent(document,'mousemove',onMouseMove);
		Timepicker.removeEvent(document,'mouseup',onMouseUp);
		if('touchstart' in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0){
			Timepicker.removeEvent(hourHand,'touchstart',onTouchStart);
			Timepicker.removeEvent(hourHand,'touchmove',onTouchMove);
			Timepicker.removeEvent(hourHand,'touchcancel',onTouchEnd);
			Timepicker.removeEvent(hourHand,'touchend',onTouchEnd);
			Timepicker.removeEvent(minuteHand,'touchstart',onTouchStart);
			Timepicker.removeEvent(minuteHand,'touchmove',onTouchMove);
			Timepicker.removeEvent(minuteHand,'touchcancel',onTouchEnd);
			Timepicker.removeEvent(minuteHand,'touchend',onTouchEnd)
		}
	},
	create=function(){
		// Initialize
		clkFace.setAttribute('width',280);
		clkFace.setAttribute('height',280);
		hourHand.setAttribute('width',20);
		hourHand.setAttribute('height',90);
		minuteHand.setAttribute('width',12);
		minuteHand.setAttribute('height',110);
		secondHand.setAttribute('width',8);
		secondHand.setAttribute('height',120);
		tpick.style.cssText='position:relative;left:0px;top:0px;width:280px;background:white';
		clkFace.style.cssText='position:absolute;left:0px;top:60px';
		hourHand.style.cssText='position:absolute;left:130px;top:130px;transform-origin:50% 70px';
		minuteHand.style.cssText='position:absolute;left:134px;top:110px;transform-origin:50% 90px';
		secondHand.style.cssText='position:absolute;left:136px;top:110px;transform-origin:50% 90px';
		jsSorununGoruntulenenSaatMetni.style.cssText='position:absolute;left:2px;top:2px;width:278px;height:20px;text-align:left;font:16px Verdana;cursor:default;text-align: center;font-weight: bold;color:rgb(255, 255, 255);background:black';
		soruMetni.style.cssText='position:absolute;left:2px;top:22px;width:278px;height:40px;text-align:left;font:13px Verdana;cursor:default';
		aktifSaat.style.cssText='position:absolute;left:5px;top:80px;width:40px;height:30px;text-align:left;font:13px Verdana;cursor:default;background:white;color:gray';

		timeStr.style.cssText='position:relative;display:grid;left:2px;top:330px;width:280px;height:60px;text-align:center;align-items:center;font:20px Verdana;font-weight: bold;cursor:default';
		
		pickBtn.style.cssText='position:absolute;left:2px;top:390px;width:120px;height:35px;font:18px Verdana;cursor:pointer';
		kontrolText.style.cssText='position:absolute;display:grid;left:150px;top:390px;width:120px;height:35px;text-align:right;align-items:center;font:28px Verdana;cursor:default;background:white';
		pickBtn.innerHTML='Kontrol Et';
		tpick.style.display='none';
		tpick.appendChild(clkFace);
		tpick.appendChild(hourHand);
		tpick.appendChild(minuteHand);
		tpick.appendChild(secondHand);
		tpick.appendChild(timeStr);
		tpick.appendChild(jsSorununGoruntulenenSaatMetni);
		tpick.appendChild(soruMetni);
		tpick.appendChild(aktifSaat);
		tpick.appendChild(kontrolText);
		tpick.appendChild(pickBtn);
		tpick.style.height=isClk?'280px':'430px';

		soruMetni.textContent = "Saati, yukarıda verilen saate göre ayarlayın.";

		var inputElements = document.getElementsByClassName('kolDurumunuGoster');
		djcloOpen = inputElements[0].checked

		var inputElements = document.getElementsByClassName('djcRM');
		djcReadMode = inputElements[0].checked

		var inputElements = document.getElementsByClassName('dilEng');
		english = inputElements[0].checked
		soruOkunusMetniolsun = document.getElementById('radio-one').checked
		
		var inputElements = document.getElementsByClassName('clDogruCevabiGostermeIzni');
		DogruCevabiGostermeIzni = inputElements[0].checked
		metniGoster = document.getElementById('idCevapMetniGoster').checked
		aktifSaatiGoster = document.getElementById('idAktifSaatiGoster').checked
		
		if(isClk){
			
			timeStr.style.display=pickBtn.style.display='none';
			if(DogruCevabiGostermeIzni){
				updClkTm();
			}
		}
		else{
			addEvts();
			Timepicker.setCursor(hourHand,true);
			Timepicker.setCursor(minuteHand,true);
			secondHand.style.display='none'
		}
		Timepicker.addEvent(pickBtn,'click',kontrolEtFonksiyon);
		setClkTheme()
	},
	setClkTheme=function(){
		const cnvOteleme = (280 - 240) / 2
		const cx = 240 / 2
		const cy = 240 / 2
		const ydrRad = cx/2
		const yuzdeOn = cx / 12
		var inputElements = document.getElementsByClassName('h24');
		let checkedValue = false
		checkedValue = inputElements[0].checked
		is24H = checkedValue
		let ctx=clkFace.getContext('2d');
		ctx.strokeStyle=isLight?'#000':'#fff';
		ctx.beginPath();
		ctx.arc(cx + cnvOteleme ,cy + cnvOteleme ,cx-1,0,2*Math.PI);
		ctx.stroke();
		let radGrd=ctx.createRadialGradient(cx + cnvOteleme,cy + cnvOteleme,1,cx + cnvOteleme, cy + cnvOteleme,cx);
		radGrd.addColorStop(0,isLight?'#e7e7e7':'#000');
		radGrd.addColorStop(1,isLight?'#fff':'#171717');
		ctx.fillStyle=radGrd;
		ctx.beginPath();
		ctx.arc(cx + cnvOteleme,cy + cnvOteleme,cx-2,0,2*Math.PI); // saat dış sınır dairesi
		ctx.fill();
		ctx.translate(cx + cnvOteleme,cy + cnvOteleme);
		ctx.fillStyle=isLight?'#000':'#fff';
		for(let i=0;i<12;i++){
			ctx.beginPath();
			ctx.arc(0,((cy-yuzdeOn)*-1),(yuzdeOn*0.2),0,2*Math.PI); // dış sınır saat noktaları. Ana noktalar
			ctx.fill();
			ctx.rotate(Math.PI/30);
			for(let j=0;j<4;j++){
				ctx.beginPath();
				ctx.arc(0,((cy-yuzdeOn)*-1),(yuzdeOn*0.1),0,2*Math.PI);
				ctx.fill();
				ctx.rotate(Math.PI/30);
			}
		}
		// ctx.font='18px Verdana';
		ctx.textAlign='center';
		ctx.textBaseline='middle';
		for(let i=1;i <= 12;i++){
			ctx.font='18px Verdana';
			ctx.fillText(i,((cx-26)*Math.sin(i*Math.PI/6)),(-1*(cx-26)*Math.cos(i*Math.PI/6)));
			if (checkedValue) {
				ctx.font='12px Verdana';
				ctx.fillText(i+12,((cx+9)*Math.sin(i*Math.PI/6)),(-1*(cx+9)*Math.cos(i*Math.PI/6)));
			}
			// ydr ikinci saatler 24 saat saatleri
		}
		ctx.translate(-1*(cx + cnvOteleme),-1*(cy + cnvOteleme));
		//Unexpected keyword or identifier
		// Create hour hand --ydr  saat kolu
		ctx=hourHand.getContext('2d');
		ctx.fillStyle=isLight?'#000':'#FFFFFF';
		ctx.beginPath();
		ctx.moveTo(yuzdeOn, 0); //ydr
		ctx.lineTo(yuzdeOn*1.2, 0);
		ctx.lineTo(yuzdeOn*1.6, (cx-(yuzdeOn*3)));
		ctx.lineTo(yuzdeOn*0.4, (cx-(yuzdeOn*3)));
		ctx.lineTo(yuzdeOn*0.8, 0);
		
		ctx.fill();
		// Create minute hand
		ctx=minuteHand.getContext('2d');
		ctx.fillStyle=isLight?'#7f7f7f':'#D20000';
		ctx.beginPath();

		ctx.moveTo(yuzdeOn*0.6, 0); //ydr
		ctx.lineTo(yuzdeOn*0.8, 0);
		ctx.lineTo(yuzdeOn*1.4, (cx - yuzdeOn));
		ctx.lineTo((yuzdeOn*0.2)*-1, (cx- yuzdeOn));
		ctx.lineTo(yuzdeOn*0.4, 0);

		ctx.fill();
		ctx.fillStyle='#000';
		ctx.beginPath();
		ctx.arc(yuzdeOn*0.6,(cx-(yuzdeOn*3)),yuzdeOn*0.2,0,2*Math.PI);
		ctx.fill();
		// Create second hand
		ctx=secondHand.getContext('2d');
		ctx.fillStyle='#f44336';
		ctx.beginPath();
		ctx.moveTo(yuzdeOn*0.4,0);
		ctx.lineTo(0,cx);
		ctx.lineTo(yuzdeOn*0.8,cx);
		ctx.lineTo(yuzdeOn*0.4,0);
		ctx.fill();
		ctx.fillStyle='#000';
		ctx.beginPath();
		ctx.fill()
	};
	this.attachTo=function(el){if(el.appendChild&&!tpick.parentNode){el.appendChild(tpick);return true}return false};
	this.destroy=function(){
		tpick.remove();
		self=null
	};
	this.getElement=function(){return tpick};
	this.getHours=function(){return hour};
	this.getMinutes=function(){return minute};
	this.getTime=function(){return hour*36e5+minute*6e4};
	this.getTimeString=function(){return getTmStr()};

	this.hide=function(){
		if(!isHidden){
			isHidden=!isHidden;
			tpick.style.display='none';
		}
	};
	this.is24Hour=function(){return is24H};
	this.isClockMode=function(){return isClk};
	this.isHidden=function(){return isHidden};
	this.isLightTheme=function(){return isLight};
	this.onPicked;
	this.set24Hour=function(h){
		if(typeof h=='boolean'&&h!=is24H){
			is24H=h;
			updPickedTm()
		}
	};
	this.setClockMode=function(m){
		if(typeof m=='boolean'&&m!=isClk){
			isClk=m;
			Timepicker.setCursor(hourHand,!isClk);
			Timepicker.setCursor(minuteHand,!isClk);
			secondHand.style.display=isClk?'':'none';
			timeStr.style.display=pickBtn.style.display=isClk?'none':'';
			tpick.style.height=isClk?'280px':'460px';
			if(isClk){
				remEvts();
					hour=Timepicker.getHours();
					minute=Timepicker.getMinutes();
					updClkTm();
					updPickedTm()
			}else{
				second=0;
				window.clearInterval(timerId);
				addEvts()
			}
		}
	};
	function getKalaEki(gecerliSaat) {
		gecerliSaat = gecerliSaat + 1
		if (is24H) {
			if (gecerliSaat>23) {gecerliSaat = 0}
		}else{
			if (gecerliSaat>11) {gecerliSaat = gecerliSaat - 12}
		}
		if (gecerliSaat === 0) { return "ye"}
		if (gecerliSaat === 1) {return "e"}
		if (gecerliSaat === 2) { return "ye"}
		if (gecerliSaat === 3) { return "e"}
		if (gecerliSaat === 4) { return "e"}
		if (gecerliSaat === 5) { return "e"}
		if (gecerliSaat === 6) { return "ya"}
		if (gecerliSaat === 7) { return "ye"}
		if (gecerliSaat === 8) { return "e"}
		if (gecerliSaat === 9) { return "a"}
		if (gecerliSaat === 10) { return "a"}
		if (gecerliSaat === 11) { return "e"}
		
		if (gecerliSaat === 12) { return "ye"}
		if (gecerliSaat === 13) { return "e"}
		if (gecerliSaat === 14) { return "ye"}
		if (gecerliSaat === 15) { return "e"}
		if (gecerliSaat === 16) { return "e"}
		if (gecerliSaat === 17) { return "e"}
		if (gecerliSaat === 18) { return "ya"}
		if (gecerliSaat === 19) { return "ye"}
		if (gecerliSaat === 20) { return "e"}
		if (gecerliSaat === 21) { return "a"}
		if (gecerliSaat === 22) { return "a"}
		if (gecerliSaat === 23) { return "e"}
		if (gecerliSaat === 24) { return "ye"}

		if (gecerliSaat === 25) { return "e"}
		if (gecerliSaat === 26) { return "ya"}
		if (gecerliSaat === 27) { return "ye"}
		if (gecerliSaat === 28) { return "e"}
		if (gecerliSaat === 29) { return "a"}

	};
	function getGeceEki(gecerliSaat) {
		if (gecerliSaat === 0) { return "yi"}
		if (gecerliSaat === 1) { return "i"}
		if (gecerliSaat === 2) { return "yi"}
		if (gecerliSaat === 3) { return "ü"}
		if (gecerliSaat === 4) { return "ü"}
		if (gecerliSaat === 5) { return "i"}
		if (gecerliSaat === 6) { return "yı"}
		if (gecerliSaat === 7) { return "yi"}
		if (gecerliSaat === 8) { return "i"}
		if (gecerliSaat === 9) { return "u"}
		if (gecerliSaat === 10) { return "u"}
		if (gecerliSaat === 11) { return "i"}

		
		if (gecerliSaat === 12) { return "yi"}
		if (gecerliSaat === 13) { return "i"}
		if (gecerliSaat === 14) { return "i"}
		if (gecerliSaat === 15) { return "ü"}
		if (gecerliSaat === 16) { return "ü"}
		if (gecerliSaat === 17) { return "i"}
		if (gecerliSaat === 18) { return "yı"}
		if (gecerliSaat === 19) { return "yi"}
		if (gecerliSaat === 20) { return "i"}
		if (gecerliSaat === 21) { return "u"}
		if (gecerliSaat === 22) { return "u"}
		if (gecerliSaat === 23) { return "i"}
		if (gecerliSaat === 24) { return "yi"}


		if (gecerliSaat === 25) { return "i"}
		if (gecerliSaat === 26) { return "yı"}
		if (gecerliSaat === 27) { return "yi"}
		if (gecerliSaat === 28) { return "i"}
		if (gecerliSaat === 29) { return "u"}

	};
	
this.setTimeStr=function(saatMetni,yirmidortSaatModuNeOlsun){
	
	let strSaat_metni ="";
	let ydrH = 0;
	let ydrM = 0;

		strSaat_metni =saatMetni.split(" ")[0]
		ydrH = parseInt(strSaat_metni.split(":")[0]);
		ydrM = parseInt(strSaat_metni.split(":")[1]);
		ydrH_Soru = ydrH;
		ydrM_Soru = ydrM;
	if(DogruCevabiGostermeIzni){
			if (!yirmidortSaatModuNeOlsun) {
				if (ydrH > 11) {
					ydrH = ydrH-12
					ydrH_Soru = ydrH;
				}
				is24H=false;
				ydr24SaatModu=false;
				updPickedTm()
			}else{
				if (ydrH < 12) {
					ydrH = ydrH+12
					ydrH_Soru = ydrH;
				}
				is24H=false;
				ydr24SaatModu=true;
				updPickedTm()
			}
			if(!isClk&&!isNaN(ydrH)){
				hour=parseInt(ydrH)%24;
				second=0;
				updClkPtrs();
				updPickedTm();
			}
			if(!isClk&&!isNaN(ydrM)){
				minute=parseInt(ydrM)%60;
				second=0;
				updClkPtrs();
				updPickedTm();
			}
	} else {
		ydrH=10;
		ydrM=7;
		hour=10;
		minute=7;
		
		if (!yirmidortSaatModuNeOlsun) {
			if (ydrH > 11) {
				ydrH = ydrH-12;
			}
			is24H=false;
			ydr24SaatModu=false;
		}else{
			if (ydrH < 12) {
				ydrH = ydrH+12;
			}
			is24H=false;
			ydr24SaatModu=true;
		}
		updClkPtrs();
		updPickedTm();
	}
		jsSorudakiStringSaatMetni=okunusaCevir_mother(ydrH_Soru, ydrM_Soru)
		jsSorudakiDijitalSaatMetni = getTmStr_Verilen(ydrH_Soru, ydrM_Soru)
			if (soruOkunusMetniolsun){
				jsSorununGoruntulenenSaatMetni.innerText = jsSorudakiStringSaatMetni
			}else{
				jsSorununGoruntulenenSaatMetni.innerText = jsSorudakiDijitalSaatMetni
			}
	};
	this.setLanguage=function(h){
		english = h
	};
	this.setHours=function(h){
		if(!isClk&&!isNaN(h)){
			hour=parseInt(h)%24;
			second=0;
			updClkPtrs();
			updPickedTm()
		}
	};
	this.setLockHands=function(h){
		if(!isClk&&!isNaN(h)){
			LockHands=h;
		}
	};
	this.setdjcReadMode=function(h){
		if(!isClk&&!isNaN(h)){
			djcReadMode=h;
		}
	};
	this.setLightTheme=function(t){
		if(typeof t=='boolean'&&t!=isLight){
			isLight=t;
			setClkTheme();
		}
	};
	this.setMinutes=function(m){
		if(!isClk&&!isNaN(m)){
			minute=parseInt(m)%60;
			second=0;
			updClkPtrs();
			updPickedTm()
		}
	};
	this.show=function(){
		if(typeof tpick.parentNode=='undefined'){alert("Saat henüz hazır değil!");return;}
		if(isHidden){
			isHidden=!isHidden;
			tpick.style.display='';
			scrollToFix()
		}
	};
	if(!cssTransform){
		self.destroy();
		alert("Browser'iniz, gezgininiz 'CSS transform' özelliğini desteklemiyor!'");
		return
	}
	if(!clkFace.getContext){
		self.destroy();
		alert("Browser'iniz, gezgininiz 'HTML canvas' özelliğini desteklemiyor!");
		return
	}
	create()
}
Timepicker.addEvent=function(el,ev,cb){
	if(window.addEventListener)el.addEventListener(ev,cb);
	else el.attachEvent('on'+ev,cb)
};
Timepicker.removeEvent=function(el,ev,cb){
	if(window.addEventListener)el.removeEventListener(ev,cb);
	else el.detachEvent('on'+ev,cb)
};
Timepicker.setCursor=function(e,p){e.style.cursor=p?'pointer':'default'};
Timepicker.getSupportedTransformProp=function(){
	let props=['transform','MozTransform','WebkitTransform','msTransform','OTransform'],
		root=document.documentElement;
	for(let i=0;i<props.length;i++)
		if(props[i] in root.style)return props[i];
	return null
};
Timepicker.tzOffset=Date.parse('01 Jan 1970');
Timepicker.getTime=function(){return (Date.now()-Timepicker.tzOffset)%864e5};
Timepicker.getHours=function(){return parseInt(Timepicker.getTime()/36e5)};
Timepicker.getMinutes=function(){return parseInt(Timepicker.getTime()/6e4)%60};
Timepicker.getSeconds=function(){return parseInt(Timepicker.getTime()/1e3)%60};
Timepicker.getMillis=function(){return Timepicker.getTime()%1e3};
Timepicker.sign=function(n){
	if(isNaN(n))return NaN;
	if(n==0)return 0;
	if(n<0)return -1;
	return 1
};
