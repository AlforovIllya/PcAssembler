"use strict";




var vetCPU = [];
var vetDivCPU = [];

var vetMotherBoards = [];
var vetDivMotherBoards = [];

var vetGraphicsCards = [];
var vetDivGraphicsCards = [];

var vetMemory = [];
var vetDivMemory = [];

var vetCpuFan = [];
var vetDivCpuFan = [];

var vetCase = [];
var vetDivCase = [];

var vetPowerSup = [];
var vetDivPowerSup = [];

var cpuDone = 0;
var mbDone = 0;
var gcDone = 0;
var memDone = 0;
var cpuFanDone = 0;
var caseDone = 0;
var powerSupDone = 0;



var CPUprice = 0;
var MBprice = 0;
var GCprice = 0;
var MEMprice = 0;
var CpuFanPrice = 0;
var CasePrice = 0;
var PowerSupPrice = 0;


var CPUrange = 0;
var MBrange = 0;
var GCrange = 0;
var MEMrange = 0;
var CpuFanrange = 0;
var Caserange = 0;
var PowerSuprange = 0;

var totalPrice = 0;

$(document).ready(function(){
    //$("#list").hide();


	selectTypePc();

    $("#selectType").on("change", function () {
    	selectTypePc();
    })

	

    $("#generatePC").on("click", function(){
		
		
		waitingDialog.show();
		//waitingDialog.show('WAITING');
        
		$("#CPU").html("");
		$("#Motherboards").html("");
		$("#GraphicsCards").html("");
		$("#RAM").html("");
		$("#cpuFan").html("");
		$("#case").html("");
		$("#powerSup").html("");

		var maxPrice = $("#maxPrice").val();


        CPUprice = (maxPrice * CPUrange)/100;
        MBprice = (maxPrice * MBrange)/100;
        GCprice = (maxPrice * GCrange)/100;
        MEMprice = (maxPrice * MEMrange)/100;
        CpuFanPrice = (maxPrice * CpuFanrange)/100;
        CasePrice = (maxPrice * Caserange)/100;
        PowerSupPrice = (maxPrice * PowerSuprange)/100;



		
		//Chiamate Al Server
		serverGetCPU();
		
        
    });

});

function selectTypePc() {
    if($("#selectType").val()==1){
        //Pc Gaming
        CPUrange = 20;
        MBrange = 13;
        GCrange = 35;
        MEMrange = 8;
        CpuFanrange = 6;
        Caserange = 8;
        PowerSuprange = 10;
    }else if($("#selectType").val()==2){
        //Pc Office
        CPUrange = 30;
        MBrange = 15;
        GCrange = 21;
        MEMrange = 9;
        CpuFanrange = 6;
        Caserange = 8;
        PowerSuprange = 11;
    }else if($("#selectType").val()==3){
        //Pc Normal
        CPUrange = 25;
        MBrange = 14;
        GCrange = 25;
        MEMrange = 10;
        CpuFanrange = 8;
        Caserange = 8;
        PowerSuprange = 10;
    }

    $("#rangeCPU").val(CPUrange);
	$("#cpuSliderOutput").val(CPUrange);
	
    $("#rangeMB").val(MBrange);
	$("#mbSliderOutput").val(MBrange);
	
    $("#rangeGC").val(GCrange);
	$("#gcSliderOutput").val(GCrange);
	
    $("#rangeRAM").val(MEMrange);
	$("#ramSliderOutput").val(MEMrange);
	
    $("#rangeCpuFAN").val(CpuFanrange);
	$("#cpuFanSliderOutput").val(CpuFanrange);
	
    $("#rangeCase").val(Caserange);
	$("#caseSliderOutput").val(Caserange);
	
    $("#rangePower").val(PowerSuprange);
	$("#pewerSliderOutput").val(PowerSuprange);
}
function construction(it1, it2, it3, it4, it5, it6, it7){
	var sum =0;
	sum = it1+it2+it3+it4+it5+it6+it7;


	if(sum==7){


		$("#CPU").html("");
		$("#Motherboards").html("");
		$("#GraphicsCards").html("");
		$("#RAM").html("");
		$("#cpuFan").html("");
		$("#case").html("");
		$("#powerSup").html("");

		
		var filterList = socketsPermited();
		selectCpu(filterList);
		selectGc();
		selectCase();
		

		waitingDialog.hide();
		$(".item-operate").html("");
		$(".item-msg").html("");
		$(".item-container").addClass("col-sm-10")
		
	}

}

function socketsPermited(){
	var List = {
		cpuSocket:[
			1200,
			2066,
			1151,
			2011,
			1150,
			1155,
			1156,
			1366
		],

	};

	
	for(var i = 0; i<List.cpuSocket.length;i++){
		var exist = 0;

		for(var j = 0; j<vetCPU.length; j++){
			if(List.cpuSocket[i]==vetCPU[j].socket.replace(/\s/g, "")){
				exist=1;
			}
		}
		
		if(exist==0){
			List.cpuSocket.splice(i,1);
		}
	}
	for(var i = 0; i<List.cpuSocket.length;i++){
		var exist = 0;

		for(var j = 0; j<vetMotherBoards.length; j++){
			if(List.cpuSocket[i]==vetMotherBoards[j].socket.replace(/\s/g, "")){
				exist=1;
			}
		}
		
		if(exist==0){
			List.cpuSocket.splice(i,1);
		}
	}

	
	
	return List;
}


function serverGetCPU(){
	let getCpu = sendRequestNoCallback("/getCpuIntel","GET",{"CPUprice":CPUprice});
	getCpu.fail(function(jqXHR,test_status,str_error){
			var timeout = Math.floor(Math.random() * 1000) + 200;
			setTimeout(serverGetCPU, timeout);
	});
	getCpu.done(function(data){
		vetCPU=data.data;
		vetDivCPU= data.div;
		cpuDone=1;
		serverGetMb();
		
		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
		
	});
}
function serverGetMb(){
	let getMBoard = sendRequestNoCallback("/getMotherboardIntel","GET",{"MBprice":MBprice});
	getMBoard.fail(function(jqXHR,test_status,str_error){
		var timeout = Math.floor(Math.random() * 1000) + 200;
		setTimeout(serverGetMb, timeout);
	});
	getMBoard.done(function(data){
		vetMotherBoards=data.data;
		vetDivMotherBoards= data.div;
		mbDone=1;


		serverGetGCard();
		
		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
		
	});
}
function serverGetGCard(){
	let getGCards = sendRequestNoCallback("/getGraphicsCards","GET",{"GCprice":GCprice});
	getGCards.fail(function(jqXHR,test_status,str_error){
		var timeout = Math.floor(Math.random() * 1000) + 200;
		setTimeout(serverGetGCard, timeout);
	});
	getGCards.done(function(data){
		vetGraphicsCards=data.data;
		vetDivGraphicsCards=data.div;
		gcDone=1;

		serverGetRAM();
		
		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
		
	});
}
function serverGetRAM(){
	let getMem = sendRequestNoCallback("/getMemory","GET",{"MEMprice":MEMprice});
	getMem.fail(function(jqXHR,test_status,str_error){
		var timeout = Math.floor(Math.random() * 1000) + 200;
		setTimeout(serverGetRAM, timeout);
	});
	getMem.done(function(data){
		vetMemory=data.data;
		vetDivMemory=data.div;
		memDone=1;
		
		serverGetCpuFan();
		
		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
		
	});
}
function serverGetCpuFan(){
	let getCpuFan = sendRequestNoCallback("/getCpuFan","GET",{"CpuFanPrice":CpuFanPrice});
	getCpuFan.fail(function(jqXHR,test_status,str_error){
		var timeout = Math.floor(Math.random() * 1000) + 200;
		setTimeout(serverGetCpuFan, timeout);
	});
	getCpuFan.done(function(data){
		vetCpuFan=data.data;
		vetDivCpuFan=data.div;
		cpuFanDone=1;

		serverGetCase();
		
		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
	});
}
function serverGetCase(){
	let getCase = sendRequestNoCallback("/getCase","GET",{"CasePrice":CasePrice});
	getCase.fail(function(jqXHR,test_status,str_error){
		var timeout = Math.floor(Math.random() * 1000) + 200;
		setTimeout(serverGetCase, timeout);
	});
	getCase.done(function(data){
		vetCase=data.data;
		vetDivCase=data.div;
		caseDone=1;

		serverGetPowerSup();

		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
	});
}
function serverGetPowerSup(){
	let getPowerSup = sendRequestNoCallback("/getPowerSup","GET",{"PowerSupPrice":PowerSupPrice});
	getPowerSup.fail(function(jqXHR,test_status,str_error){
		var timeout = Math.floor(Math.random() * 1000) + 200;	
		setTimeout(serverGetPowerSup, timeout);
	});
	getPowerSup.done(function(data){
		vetPowerSup=data.data;
		vetDivPowerSup=data.div;
		powerSupDone=1;
		construction(cpuDone, mbDone, memDone, gcDone, cpuFanDone, caseDone, powerSupDone);
	});
}


function selectCpu(filterList){
	
	
	var itemOk=0;
	var i = 0;


	if(vetCPU.length>0)
	{
		do{

			var socket=vetCPU[i].socket;
	
	
			filterList.cpuSocket.forEach(element => {
				if(socket!="undefined" && socket!=""){
					if(socket.replace(/\s/g, "")==element){
						itemOk++;
					}
				}
			});
	
			
	
			if(itemOk<1){
				i++;
				itemOk=0;
			}
			
			
		}while(itemOk<1 && i<vetCPU.length-1);
	
		if(itemOk){
			$("#CPU").append(vetDivCPU[i]);

			var buttonCollapse =
				'<div class=" col-sm-2">'+
                '<button id="btnCpu" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

            	'</div>';
			$("#CPU").append(buttonCollapse);
			

			


			$("#collapse1").collapse();
			socket = vetCPU[i].socket.replace(/\s/g, "");
			selectMb(socket);
			selectCpuFan();

            getPrice();
		}
	}
	
		

	
}

function selectMb(socket){
	var i=0;
	var itemOk=0;

	if(vetMotherBoards.length>0){
		do{

		
			var Mbsocket=vetMotherBoards[i].socket.replace(/\s/g, "");
	
	
			
			if(socket==Mbsocket){
				itemOk++;
			}
			
			
	
			if(itemOk<1){
				itemOk=0;
				i++;
			}
	
		}while(itemOk<1 && i<vetMotherBoards.length-1);
	}
	

	if(itemOk==1){
		$("#Motherboards").append(vetDivMotherBoards[i]);
		$("#collapse2").collapse()
		selectRam(vetMotherBoards[i].memorySlots)

		var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnMotherboards" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
		$("#Motherboards").append(buttonCollapse);
		
        getPrice()
	}
		
	
}

function selectGc(){
	var i=0;

	if(vetDivGraphicsCards.length>0){
		$("#GraphicsCards").append(vetDivGraphicsCards[i]);
		$("#collapse3").collapse();

		var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnGraphicsCards" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
		$("#GraphicsCards").append(buttonCollapse);

        getPrice()
	}
	
}

function selectRam(memorySlots){
	var i=0;
	var itemOk=0;
	
	
	if(memorySlots.search("x")>0)
		memorySlots=memorySlots.split("x");

	else if(memorySlots.search("X")>0)
		memorySlots=memorySlots.split("X");

	else if(memorySlots.search("×")>0)
		memorySlots=memorySlots.split("×");

	

	if(vetMemory.length>0){

		
		if(memorySlots.length>=2){
			if(memorySlots[1].replace(/\s/g, "")=="DDR3"){
				memorySlots=240
			}
			else if(memorySlots[1].replace(/\s/g, "")=="DDR4"){
				memorySlots=288
			}
			else{
				memorySlots=memorySlots[1].slice(0, 3);
			}
		}
		
		do{

			
			
			
			
			
			
			if(memorySlots==vetMemory[i].pin){
				itemOk++;
			}


			
			
			
	
			if(itemOk<1){
				itemOk=0;
				i++;
			}
	
		}while(itemOk<1 && i<vetMemory.length-1);
	}
	if(itemOk>0){

		$("#RAM").append(vetDivMemory[i]);
		$("#collapse4").collapse();

		var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnRAM" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
		$("#RAM").append(buttonCollapse);

        getPrice()
	}
	
}

function selectCpuFan(){
	var i=0;
	if(vetCpuFan.length>0){
		$("#cpuFan").append(vetDivCpuFan[i]);
		$("#collapse5").collapse();

		var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btncpuFan" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
		$("#cpuFan").append(buttonCollapse);

        getPrice()
	}	
	
}

function selectCase(){
	var i=0;
	var itemOk=0;

	if(vetCase.length>0){
		do{


			if(vetCase[i].Compatibility!="undefined"){
				itemOk++;
			}

	
			if(itemOk<1){
				itemOk=0;
				i++;
			}
	
		}while(itemOk<1 && i<vetCase.length-1);
		
	}	

	if(itemOk>0){
		$("#case").append(vetDivCase[i]);
		$("#collapse6").collapse();
		selectPowerSup(vetCase[i].Compatibility);

		var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btncase" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
		$("#case").append(buttonCollapse);

        getPrice()
	}
	
}

function selectPowerSup(caseComp){
	var i=0;
	var itemOk=0;
	var powerSupName = "";

	if(caseComp!="undefined"){
		caseComp = caseComp.split('/');
	}
	
	
	if(vetPowerSup.length>0){
		
		$("#powerSup").append(vetDivPowerSup[i]);
		$("#collapse7").collapse();

		var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnpowerSup" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
		$("#powerSup").append(buttonCollapse);

        getPrice()
		
	}	

	
}

function getPrice() {
	var priceContiner =	$(".price-current");
	
	var strong =0;
	var sup = 0;


	
	for(var i=0; i<priceContiner.length;i++){
		
		for(var j=0; j<priceContiner[i].childNodes.length ;j++){


			if(priceContiner[i].childNodes[j].nodeName=="STRONG"){


                if(priceContiner[i].childNodes[j].textContent.search(",")>0){
                	strong = strong + parseInt(priceContiner[i].childNodes[j].textContent.replace(",", "")) ;
                }
                else {
                	strong = strong + parseInt(priceContiner[i].childNodes[j].textContent	) ;
				}

			}
			else if(priceContiner[i].childNodes[j].nodeName=="SUP"){
                //console.log(priceContiner[i].childNodes[j].textContent.replace(".", ""));
                sup = sup + parseInt(priceContiner[i].childNodes[j].textContent.replace(".", "")) ;
            }
		}

	}

	strong = strong+ sup/100;

	$('li').filter(function() {
		return $(this).text().trim().length == 0;
	  }).remove();
    
    $("#totalPrice").text(strong + " $");
}




//WAiting dialog
var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);

$(document).ready(function() {
    $('.dropright button').on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!$(this).next('div').hasClass('show')) {
            $(this).next('div').addClass('show');
        } else {
            $(this).next('div').removeClass('show');
        }

    });
});


function caricaModal(id){
	console.log(id);
	$("#modalText").text("");

	if(id=="btnCpu"){
		for(var j=0;j<vetDivCPU.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changeCpu("+j+");");
			obj.innerHTML=vetDivCPU[j];
			$("#modalText").append(obj);
		}
	}
	if(id=="btnMotherboards"){
		for(var j=0;j<vetDivMotherBoards.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changeMotherboards("+j+");");
			obj.innerHTML=vetDivMotherBoards[j];
			$("#modalText").append(obj);
		}
	}

	if(id=="btnGraphicsCards"){
		for(var j=0;j<vetDivGraphicsCards.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changeGraphicsCards("+j+");");
			obj.innerHTML=vetDivGraphicsCards[j];
			$("#modalText").append(obj);
		}
	}

	if(id=="btnRAM"){
		for(var j=0;j<vetDivMemory.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changeRAM("+j+");");
			obj.innerHTML=vetDivMemory[j];
			$("#modalText").append(obj);
		}
	}

	if(id=="btncpuFan"){
		for(var j=0;j<vetDivCpuFan.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changecpuFan("+j+");");
			obj.innerHTML=vetDivCpuFan[j];
			$("#modalText").append(obj);
		}
	}
	if(id=="btncase"){
		for(var j=0;j<vetDivCase.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changecase("+j+");");
			obj.innerHTML=vetDivCase[j];
			$("#modalText").append(obj);
		}
	}
	if(id=="btnpowerSup"){
		for(var j=0;j<vetDivPowerSup.length;j++ ){
			var obj = document.createElement('div');
			obj.setAttribute("onclick","changepowerSup("+j+");");
			obj.innerHTML=vetDivPowerSup[j];
			$("#modalText").append(obj);
		}
	}

	
	$("#modalText").children().removeClass("item-container");
	$("#modalText").children().addClass("row");
	$("#modalText .price").addClass("col-sm-4");
	$("#modalText li").removeClass("price-current");

	
	
	$("#modalText .item-features").remove();
	$("#modalText .price-ship").remove();
	$("#modalText .price-current-num").remove();
	$("#modalText .price-current-range").remove();
	$("#modalText .price-was").remove();
	$("#modalText .price-save-endtime").remove();
	$("#modalText .price-save").remove();
	$("#modalText .item-buying-choices").remove();
	$("#modalText .item-stock").remove();
	$("#modalText .item-promo").remove();
	$("#modalText .item-branding").remove();
	$("#modalText .item-img").addClass("col-sm-2");
	$("#modalText .item-info").addClass("col-sm-6");
	$("#modalText a").removeAttr("href");
	$("#modalText .form-checkbox").remove();
	$("#modalText .item-msg").remove();
	$("#modalText .item-button-area").remove();


	

}

function changeCpu(i){
	console.log(i);
	$("#CPU").html(vetDivCPU[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#CPU .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnCpu" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#CPU").append(buttonCollapse);



	getPrice();
}

function changeMotherboards(i){
	console.log(i);
	$("#Motherboards").html(vetDivMotherBoards[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#Motherboards .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnMotherboards" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#Motherboards").append(buttonCollapse);

	

	getPrice();
}
function changeGraphicsCards(i){
	console.log(i);
	$("#GraphicsCards").html(vetDivGraphicsCards[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#GraphicsCards .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnGraphicsCards" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#GraphicsCards").append(buttonCollapse);

	
	getPrice();
}

function changeRAM(i){
	console.log(i);
	$("#RAM").html(vetDivMemory[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#RAM .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnRAM" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#RAM").append(buttonCollapse);

	

	getPrice();
}

function changecpuFan(i){
	console.log(i);
	$("#cpuFan").html(vetDivCpuFan[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#cpuFan .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btncpuFan" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#cpuFan").append(buttonCollapse);

	
	getPrice();
}

function changecase(i){
	console.log(i);
	$("#case").html(vetDivCase[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#case .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btncase" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#case").append(buttonCollapse);



	getPrice();
}

function changepowerSup(i){
	console.log(i);
	$("#powerSup").html(vetDivPowerSup[i]);
	$(".item-operate").html("");
	$(".item-msg").html("");
	$("#powerSup .item-container").addClass("col-sm-10");

	

	var buttonCollapse =
		'<div class=" col-sm-2">'+
		'<button id="btnpowerSup" type="button" onClick="caricaModal(this.id)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><span class="glyphicon glyphicon-retweet"></span></button>'+

		'</div>';
	$("#powerSup").append(buttonCollapse);

	

	getPrice();
}

