var sdate;
var stime;
var db;
var watchID;
var id;
var lat;
var lng;
var user;
var places=[];
var savemode="add";
//for login page
$(document).ready(function(){
	//log in and cached the data and store in local storage,make sure it start with #,otherwise it returns an error.
	$("#btnlogin").click(function(){
		user = $("#user").val();
		var id = user.substring(0,1);
		user=user.substring(1);
		if($("#remember").is(":checked")){
			localStorage.setItem("id",user);
		}
		if(id == '#'){
			alert("Your User ID is: "+ user);	
			location = "index.html#menu";
		}
		else if (id != '#' && id != ''){
			alert("Wrong User ID");
		}
	});
	
	//for log out function
	
	$("#logout").click(function(){
	localStorage.removeItem("id");
	alert("Logged Out");
	$.mobile.navigate("#login");
	});
	
	
	//Load places.json which handles the barangays,munis and prov data of the philippines
	
	$.getJSON("places.json",function(data){
		console.log(data);
		places = data;
		//get the distinct value of province in each arrays
		var provinces = [];
		for(i=0; i<places.places.length; i++){
			if(!provinces.includes(places.places[i].Pro_Name)){
				provinces.push(places.places[i].Pro_Name);
				console.log("added: " + places.places[i].Pro_Name);
			}
		}
		//sort provinces alphabetically and put the data in select box
		provinces.sort();
		console.log("Sorted Provinces: ");
		console.log(provinces);
		for(i=0; i< provinces.length; i++){
			$("#prov").append("<option>" + provinces[i] + "</option>");
		}
		
	});
	//if change in province name, load the municipality of the chosen province
	$("#prov").change(function(){
		var sProv = $("#prov option:selected").val();
		console.log("Changed to province: " + sProv);
		//change muni
		var muni = [];
		for(i=0; i<places.places.length; i++){
			if(places.places[i].Pro_Name==sProv){
				if(!muni.includes(places.places[i].Mun_Name)){
					muni.push(places.places[i].Mun_Name);
					console.log("added: " + places.places[i].Mun_Name);
				}
			}
		}

		muni.sort();
		//clear muni
		$("#muni").html("");
		$("#brgy").html("");
		$("#muni").append("<option value = 'default'>Select Municipality</option>")
		for(i=0; i< muni.length; i++){
			$("#muni").append("<option>" + muni[i] + "</option>");
		}
		$("#muni option").removeAttr("selected");
		$("#muni").selectmenu("refresh",true);
	});
	//if muni has change load the list of barangays of the chosen municipality.
	$("#muni").change(function(){
		var sProv = $("#prov option:selected").val();
		var sMuni = $("#muni option:selected").val();

		console.log("Changed to province: " + sProv);
		console.log("Changed to muni: " + sMuni);
		var brgy = [];
		for(i=0; i<places.places.length; i++){
			if(places.places[i].Pro_Name==sProv){
				if(places.places[i].Mun_Name==sMuni){
					if(!brgy.includes(places.places[i].Bgy_Name)){
						brgy.push(places.places[i].Bgy_Name);
						console.log("added: " + places.places[i].Bgy_Name);
					}
				}
			}
		}

		brgy.sort();
		//clear muni
		$("#brgy").html("");
		$("#brgy").append("<option value = 'default'>Select Barangay</option>")
		for(i=0; i< brgy.length; i++){
			$("#brgy").append("<option>" + brgy[i] + "</option>");
		}
		$("#brgy option").removeAttr("selected");
		$("#brgy").selectmenu("refresh",true);
	});
	
	//to get the recorded coordinates and put it in textbox
	$("#coordsave").click(function(){
		var lat = $('input:text[id=clat]').val();
		var lng = $('input:text[id=clng]').val();
		$("#lat").val(lat);
		$("#lng").val(lng);
		$(":mobile-pagecontainer").pagecontainer("change", "#add", {reloadPage:false});
	});
	//if partially has value, disabled totally.
	$("#partially").change(function(){
		if($(this).val() !="" || $(this).val().length > 0){
			$("#totally").attr("disabled","disabled");
			$("#totally").css("background-color", "red");
		}
		else{
			$("#totally").removeAttr("disabled");
			$("#totally").css("background-color", "");
		}
	});
	//if totally has value, disabled partially
	$("#totally").change(function(){
		if($(this).val() !="" || $(this).val().length > 0){
			$("#partially").attr("disabled","disabled");
			$("#partially").css("background-color", "red");
		}
		else{
			$("#partially").removeAttr("disabled");
			$("#partially").css("background-color", "");
		}
	});
	//check if the value of farm address same as the farmer address //
	$("#faddr").click(function(){
		if($(this).prop('checked')){
			$("#faddress").val($("#farmloc").val());
		}
		else{
			$("#faddress").val("null");
		}
	});
	
	//check if the value of owner is the same as the value of land owner
	$("#lowner").click(function(){
		if($(this).prop('checked')){
			$("#owner").val($("#ffname").val()+" "+$("#flname").val());
		}
		else{
			$("#owner").val("null");
		}
	});
	
	//for the manipulation of crop type,classes and stage
	$("#ctype").change(function(){
		var ctype=$("#ctype").val();
		var ecosystem = $("#ecosystem");
		var stage = $("#stage");
		if(ctype=="Rice"){
		document.getElementById('variety').setAttribute('disabled', true);
			$("#ecotext").text("Ecosystem");
			//load ecosystem for rice
			$(ecosystem).html("<option value='default'>--Select Ecosystem--</option><option value='Irrigated-Inbred'>Irrigated-Inbred</option><option value='Irrigated-Hybrid'>Irrigated-Hybrid</option><option value='Rainfed'>Rainfed</option><option value='Upland'>Upland</option>");
			
			//to load stages of rice
			$(stage).html("<option value='default'>--Select Stage--</option><optgroup label='VEGETATIVE PHASE'><option value = 'Seedling'>Seedling</option><option value = 'Tillering'>Tillering</option><option value = 'Stem-Elongation'>Stem-Elongation</option></optgroup><optgroup label='REPRODUCTIVE PHASE'><option value = 'Booting'>Booting</option><option value = 'Heading'>Heading</option><option value = 'Flowering'>Flowering</option></optgroup><optgroup label='MATURITY'><option value = 'Milking'>Milking</option><option value = 'Dough'>Dough</option><option value = 'Ripening'>Ripening</option></optgroup>");
		}
		else{
			//for corn
			document.getElementById('variety').removeAttribute('disabled');
			$("#ecotext").text("Topography");
			$(ecosystem).html("<option value='default'>--Select Topography--</option><option value='Upland'>Upland</option><option value='Lowland'>Lowland</option>");
			$(sclass).html("<option value='default'>--Select Seed Class--</option><option value='Certified-Seed'>Certified-Seed</option><option value='Good-Seed'>Good-Seed</option><option value='Registered-Seed'>Registered-Seed</option>");
			
			$(stage).html("<option value='default'>--Select Stage--</option><optgroup label='VEGETATIVE PHASE'><option value='Emergence'>Emergence</option><option value='First-Leaf-Collar'>First-Leaf-Collar</option><option value='Second-Leaf-Collar'>Second-Leaf-Collar</option><option value='Third-Leaf-Collar'>Third-Leaf-Collar</option><option value='Nth-Leaf-Collar'>Nth-Leaf-Collar</option><option value='Tasseling'>Tasseling</option></optgroup><optgroup label='REPRODUCTIVE PHASE'><option value='Silking'>Silking</option><option value='Blister'>Blister</option><option value='Milking'>Milking</option><option value='Dough'>Dough</option><option value='Dent'>Dent</option><option value='Maturity'>Maturity</option></optgroup>");
			
		}
		
		$("#ecosystem option").removeAttr("selected");
		$("#ecosystem").selectmenu("refresh",true);
		$("#stage").selectmenu("refresh",true);
		$("#stage option").removeAttr("selected");
		$("#variety option").removeAttr("selected");
		$("#variety").selectmenu("refresh",true);
		$("#sclass option").removeAttr("selected");
		$("#sclass").selectmenu("refresh",true);
	});
	
	$("#ecosystem").change(function(){
	 var ecosystem = $("#ecosystem").val();
	 var sclass=$("#sclass");
		if(ecosystem == "Irrigated-Inbred" || ecosystem=="Lowland" || ecosystem=="Upland"){
			$(sclass).val("");
			$(sclass).html("<option value='default'>--Select Seed Class--</option><option value='Registered-Seed'>Registered-Seed</option><option value='Certified-Seed'>Certified-Seed</option><option value='Good-Seed'>Good-Seed</option>");
		}
		else{
			$(sclass).html("<option value='default'>--Select Seed Class--</option>");
		}
		$("#sclass option").removeAttr("selected");
		$("#sclass").selectmenu("refresh",true);
	});	
});

//load when device is ready
document.addEventListener("deviceready",onDeviceReady,false);
	
function onDeviceReady(){
	user = localStorage.getItem("id");
	console.log("user" + user);
	if(user == "" || user == "undefined" || user == null){
		alert("Please Enter User ID");
	}
	else if(user !== ""){
		alert("welcome back  : " + user)
		$.mobile.navigate("#menu")
	}
	
	//watch gps position update every second 5meters accuracy
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy:true});
	datesurvey();
	initDatabase();
	
	$("#quit").click(function(){
		navigator.app.exitApp();
	});
	
  	$("#c1").click(startcam);
	$("#c2").click(startcam);
	
	function startcam(){
		var imgID = this.getAttribute("data-target");
		navigator.camera.getPicture(onSuccess,onFail,{quality:50,destinationType:Camera.DestinationType.FILE_URI, correctOrientation:true});
		function onSuccess(imageURI){
			var image = document.getElementById(imgID);
			image.src=imageURI;
			
			//move the picture to folder
			
			window.resolveLocalFileSystemURL(imageURI,function(fileEntry){
				window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){
					fs.root.getDirectory("CDCT",{create:true,exclusive:false},function(CDCTDir){
						CDCTDir.getDirectory("images",{create:true,exclusive:false},function(imgDir){
						
						   var lt=$("#lat").val();
							var lg=$("#lng").val();
							var fname = user+'_'+lt+"_"+lg+"_"+imgID+".jpg";
						   fileEntry.moveTo(imgDir,fname,function(){
								image.setAttribute("data-filename",fname);
								
							},function(e){
								alert("Cant move picture");
							});
						},function(e){
							alert("Cant open images folder");
						});
					},function(e){
						alert("Cant open CDCT Folder");
					});
				},function(e){
					alert("Cant open CDCT File System")
				});
			},function(e){
				alert("Cant find picture file");
			})
			
		}

		function onFail(e){
			alert("Failed because: " + e);
		}
	}
function getPictureUrl(fname,imgID){
//alert("getPictureUrl fname: " + fname);
//alert("getPictureUrl imgID: " + imgID);
	window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){
		fs.root.getDirectory("CDCT",{create:true,exclusive:false},function(CDCTDir){
			CDCTDir.getDirectory("images",{create:true,exclusive:false},function(imgDir){
			   imgDir.getFile(fname,{create:false,exclusive:false},function(imgFileEntry){
				   $("#" + imgID).attr("src",imgFileEntry.toURL());
			   });
			},function(e){
				alert("Cant open images folder");
			});
		},function(e){
			alert("Cant open CDCT Folder");
		});
	},function(e){
		alert("Cant open CDCT File System")
	});
}

function refreshform(){
	//refresh form
	$("#t1").attr('src', 'img/noimg.png');
	$("#t2").attr('src', 'img/noimg.png');
	$("#t1").attr('data-filename', '');
	$("#t2").attr('data-filename', '');
	$("#add input[type=text]").val("");
	$("#add input[type=number]").val("");
	$("#remarks").val("");
	$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
	$("select option").removeAttr("selected");
	$("select").selectmenu("refresh",true);
	$("#myheader a").removeClass("ui-disabled");
}
		
 $("#addcrop").click(function(){
	$.mobile.navigate("#add");
	savemode = "add";
	$("#addheader").text("Add Crop Damage Data");
	$("#btnsave").text("Save Data");
  refreshform();
  
  
});

$("#btnsave").click(function(){
		datesurvey();
		db.transaction(function(tx){
			
			if($("#wind").prop('checked')){
			value="true"; 
			}else{
				value="false"; 
			}
			if($("#flood").prop('checked')){ 
			value="true"; 
			}else{
				value="false"; 
			}
		
			lat = $("input:text[id=lat]").val();
			lng= $("input:text[id=lng]").val();
			var damageid = "dmg_"+lat+lng;
			var prov = $("#prov").find(":selected").text();
			var muni = $("#muni").find(":selected").text();
			var brgy = $("#brgy").find(":selected").text();
			var farmloc = $('input:text[id=farmloc]').val().toString().replace(/,/g, "");
			var owner = $('input:text[id=owner]').val().toString().replace(/,/g, "");
			var farmarea = $("#farea").val();
			var frname = $('input:text[id=frname]').val().toString().replace(/,/g, "");
			var flastname = $('input:text[id=flname]').val().toString().replace(/,/g, "");
			var ffname = $('input:text[id=ffname]').val().toString().replace(/,/g, "");
			var faddress = $('input:text[id=faddress]').val().toString().replace(/,/g, "");
			var flood = $('#flood').prop("checked");
			var level = $("#level").find(":selected").text();
			var submergedays = $("#submergedays").find(":selected").text();
			var wind = $('#wind').prop("checked");
			var exposure = $("#exposure").find(":selected").text();
			var ctype = $("#ctype").find(":selected").text();
			var ecosystem = $("#ecosystem").find(":selected").text();
			var variety = $("#variety").find(":selected").text();
			var sclass = $("#sclass").find(":selected").text();
			var stage = $("#stage").find(":selected").text();
			var yieldbefore = $('#yieldbefore').val().toString().replace(/,/g, "");
			var yieldafter = $('#yieldafter').val().toString().replace(/,/g, "");
			var partially = $('#partially').val().toString().replace(/,/g, "");
			var totally = $('#totally').val().toString().replace(/,/g, "");
			var remarks = $('#remarks').val().toString().replace(/,/g, "");
			var pname1 = $("#t1").attr("data-filename");
			var pname2 = $("#t2").attr("data-filename");
			
			var isSaveOK = true;
			
			if(lng=="" && lat == ""){
				isSaveOK=false;
				alert("Please get Coordinates");	
			}
			
			if(totally > farmarea || partially > farmarea){
				isSaveOK=false;
				alert("Totally or Partially damaged area must not be greater than the Farm Area!");
			}
			//$(".req").append("<span style='color:red; font-weight:bold;'> \n Required Field </span>");
			if (prov=="Select Province Name"){
				prov=""
			}
			if (muni=="Select Municipality"){
				muni=""
			}
			if (brgy=="Select Barangay"){
				brgy=""
			}
			if (level=="--Select Water Level--"){
				level=""
			}
			if (submergedays=="--Select Days of Submergence--"){
				submergedays=""
			}
			if (exposure=="--Select Period of Exposure--"){
				exposure=""
			}
			if (ctype=="--Select Crop Type--"){
				ctype=""
			}
			if (ecosystem=="--Select Ecosystem--" || ecosystem == ""){
				ecosystem=""
			}
			if (variety=="--Select Variety--" || variety == ""){
				variety=""
			}
			if (sclass=="--Select Seed Class--" || sclass == ""){
				sclass=""
			}
			if (stage=="--Select Stage--" || stage == ""){
				stage=""
			}
			
			if(isSaveOK){
		
			var sql="";

			if(savemode=="add"){
				sql = "Insert into CropDamage(CropdamageID,latitude,longitude, provname,munname,bgyname,farmloc,ownername,farmarea,farmname,lastname,firstname,farmeraddress,flevel,flood,submergeddays,wind,exposure,ctype,ecosystem,variety,sclass,stage,yieldbefore,yieldafter,partially,totally,remarks,photo1,photo2,surveyedby,datesurvey,timesurvey)Values('"+damageid+"','"+lat+"','"+lng+"','"+prov+"','"+muni+"','"+brgy+"','"+farmloc+"','"+owner+"','"+farmarea+"','"+frname+"','"+flastname+"','"+ffname+"','"+faddress+"','"+level+"','"+flood+"','"+submergedays+"','"+wind+"','"+exposure+"','"+ctype+"','"+ecosystem+"','"+variety+"','"+sclass+"','"+stage+"','"+yieldbefore+"','"+yieldafter+"','"+partially+"','"+totally+"','"+remarks+"','"+pname1+"','"+pname2+"','"+user+"','"+sdate+"','"+stime+"')";
				alert("Save Successfully");
			}
			else if(savemode=="edit"){
			
				sql = "update CropDamage set latitude='"+lat+"',longitude='"+lng+"',provname='"+prov+"', munname='"+muni+"',bgyname='"+brgy+"',farmloc='"+farmloc+"',ownername='"+owner+"',farmarea='"+farmarea+"',farmname='"+frname+"', firstname='"+ffname+"',lastname='"+flastname+"', farmeraddress='"+faddress+"', flevel='"+level+"', flood='"+flood+"',submergeddays='"+submergedays+"', wind='"+wind+"', exposure='"+exposure+"', ctype='"+ctype+"', ecosystem='"+ecosystem+"', variety='"+variety+"', sclass='"+sclass+"', stage='"+stage+"', yieldbefore='"+yieldbefore+"', yieldafter='"+yieldafter+"', partially='"+partially+"', totally='"+totally+"',photo1='"+pname1+"',photo2='"+pname2+"', remarks='"+remarks+"' where CropdamageID='"+id+"'";
				$(":mobile-pagecontainer").pagecontainer("change", "#display", {reloadPage:false});
				//
				
				var s=$("#croplist li").find("h2").text();
				alert(s);
				alert(pname1+pname2);
				alert("update successfully");
				$("#croplist").listview("refresh");
			}
			savemode="add";
			tx.executeSql(sql);
			refreshform();
			
		}
		},function(e){
		alert("ERROR:" + e.message)
		});
	});
	//show the data in listview
	$("#displaydata").click(function(){
		$("#addheader").text("Update Crop Damage Data");
		$("#btnsave").text("Update Data");
		db.transaction(function(tx){
		tx.executeSql("select * from CropDamage", [], function(tx,res){
			$("#croplist").html("");
			for(var x=0;x<res.rows.length;x++){
				 id = res.rows.item(x).CropdamageID;
				$("#croplist").append("<li data-id='"+id+"' data-img1='"+res.rows.item(x).photo1+"' data-img2='"+res.rows.item(x).photo2+"'><a href='#' class='cropdetails'><h2>"+res.rows.item(x).lastname+" "+res.rows.item(x).firstname+"</h2>"+"<h3>"+res.rows.item(x).farmloc+"</h3><h3>"+res.rows.item(x).bgyname+"</h3></a><a href='#' class='editbutton'></a></li>");	
			}
			$("#croplist").listview("refresh");
			
			$(".editbutton").click(function(e){
				 id = $(this).parent().attr("data-id");
				var name = $(this).find("h2");
				alert("Updating data: " +id);
				//Create db transaction searching for the dmg id
				db.transaction(function(tx){
					tx.executeSql("select * from CropDamage where CropdamageID='"+id+"'",[],function(tx,res){
						for(var y=0;y<res.rows.length;y++){
							var dmgitem = res.rows.item(y);
							var p1 = dmgitem.photo1;
							var p2 = dmgitem.photo2;
							window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){
									fs.root.getDirectory("CDCT",{create:true,exclusive:false},function(CDCTDir){
										CDCTDir.getDirectory("images",{create:true,exclusive:false},function(imgDir){
											$("#t1").attr("data-filename",p1);
											$("#t2").attr("data-filename",p2);
											p1 = imgDir.toURL() + p1;
											p2 = imgDir.toURL() + p2;
											$("#t1").attr("src",p1);
											$("#t2").attr("src",p2);
										},function(e){
											alert("Cant open images folder");
										});
									},function(e){
										alert("Cant open EDM Folder");
									});
								},function(e){
									alert("Cant open EDM File System")
								});
							$("input:text[id=lat]").val(dmgitem.latitude);
							$("input:text[id=lng]").val(dmgitem.longitude);
							$("input:text[id=farmloc]").val(dmgitem.farmloc);
							$("input:text[id=owner]").val(dmgitem.ownername);
							$("#farea").val(dmgitem.farmarea);
							$("input:text[id=frname]").val(dmgitem.farmname);
							$("input:text[id=ffname]").val(dmgitem.firstname);
							$("input:text[id=flname]").val(dmgitem.lastname);
							$("input:text[id=faddress]").val(dmgitem.farmeraddress);
							$("#yieldbefore").val(dmgitem.yieldbefore);
							$("#yieldafter").val(dmgitem.yieldafter);
							$("#partially").val(dmgitem.partially);
							$("#totally").val(dmgitem.totally);
							$("input:text[id=remarks]").val(dmgitem.remarks);
							$("#flood").val(dmgitem.flood);
							$("#wind").val(dmgitem.wind);
							
							
							
							$('#prov').val(dmgitem.provname);
							try{
								$('#prov').selectmenu("refresh");
								$("#prov").change();
								$("#muni").change();
							}catch(e){
								$('#prov').selectmenu();
								$('#prov').selectmenu("refresh");
								try{
									$("#prov").change();
								}catch(er){
								}
							}
							
							$("#muni").val(dmgitem.munname);
							try{
								$("#muni").selectmenu("refresh");
								$("#muni").change();
							}catch(e){
								$("#muni").selectmenu();
								$("#muni").selectmenu("refresh");
								try{
									$("#muni").change();
								}catch(er){
								}
							}
							
							$("#brgy").val(dmgitem.bgyname);
							try{
								$("#brgy").selectmenu("refresh");
							}catch(e){
								$("#brgy").selectmenu();
								$("#brgy").selectmenu("refresh");
								try{
									$("#brgy").change();
								}catch(er){
								}
							}
							
							$("#level").val(dmgitem.flevel.trim());	
							try{
								$("#level").selectmenu("refresh");
							}catch(e){
								$("#level").selectmenu();
								$("#level").selectmenu("refresh");
							}
							
							$("#level").val(dmgitem.flevel.trim());	
							try{
								$("#level").selectmenu("refresh");
							}catch(e){
								$("#level").selectmenu();
								$("#level").selectmenu("refresh");
							}
							
							$("#submergedays").val(dmgitem.submergeddays.trim());	
							try{
								$("#submergedays").selectmenu("refresh");
							}catch(e){
								$("#submergedays").selectmenu();
								$("#submergedays").selectmenu("refresh");
							}
							
							$("#exposure").val(dmgitem.exposure.trim());	
							try{
								$("#exposure").selectmenu("refresh");
							}catch(e){
								$("#exposure").selectmenu();
								$("#exposure").selectmenu("refresh");
							}
							
							$("#ctype").val(dmgitem.ctype.trim());	
							try{
								$("#ctype").selectmenu("refresh");
								$("#ctype").change();
							}catch(e){
								$("#ctype").selectmenu();
								$("#ctype").selectmenu("refresh");
								try{
									$("#ctype").change();
								}catch(er){
								}
							}
							
							var eco=$("#ecosystem").val(dmgitem.ecosystem);
								try{
								$("#ecosystem").selectmenu("refresh");
								$("#ecosystem").change();
							}catch(e){
								$("#ecosystem").selectmenu();
								$("#ecosystem").selectmenu("refresh");
								try{
									$("#ecosystem").change();
								}catch(er){
								}
							}
							$("#variety").val(dmgitem.variety.trim());	
							try{
								$("#variety").selectmenu("refresh");
							}catch(e){
								$("#variety").selectmenu();
								$("#variety").selectmenu("refresh");
							}
				
							$("#sclass").val(dmgitem.sclass.trim());	
							try{
								$("#sclass").selectmenu("refresh");
							}catch(e){
								$("#sclass").selectmenu();
								$("#sclass").selectmenu("refresh");
							}
							
							$("#stage").val(dmgitem.stage.trim());	
							try{
								$("#stage").selectmenu("refresh");
							}catch(e){
								$("#stage").selectmenu();
								$("#stage").selectmenu("refresh");
							}
						
							if(dmgitem.flood=="true"){
								$("#flood").prop("checked", true).checkboxradio("refresh");
								alert(dmgitem.flood);
							}
							else{
								$("#flood").prop("checked",false).checkboxradio("refresh");
								alert(dmgitem.flood);					
							}
							
							if(dmgitem.wind=="true"){
								$("#wind").prop("checked", true).checkboxradio("refresh");
								alert(dmgitem.wind);
							}
							else{
								$("#wind").prop("checked",false).checkboxradio("refresh");
								alert(dmgitem.wind);					
							}
							
						savemode="edit";
						$.mobile.navigate("#add");
						$("#myheader a").addClass("ui-disabled");
									
						}
					});
				});
			});
			
			$(".cropdetails").click(function(){
				id=$(this).parent().attr("data-id");
				db.transaction(function(tx){
					tx.executeSql("select * from CropDamage where CropdamageID='"+id+"'",[],function(tx,res){
						for(var x=0;x<res.rows.length;x++){
							$("#cropheader").html(res.rows.item(x).lastname.toUpperCase());
							$("#croptable").html(
							"<tr><td td colspan='2' class='title'>GEOGRAPHY</td></tr>"+
							"<tr><td>Damage ID</td><td>"+res.rows.item(x).CropdamageID+"</td></tr>"+
							"<tr><td>Latitude</td><td>"+res.rows.item(x).latitude+"</td></tr>"+
							"<tr><td>Longitude</td><td>"+res.rows.item(x).longitude+"</td></tr>"+
							"<tr><td>Province Name</td><td>"+res.rows.item(x).provname+"</td></tr>"+
							"<tr><td>Municipality Name</td><td>"+res.rows.item(x).munname+"</td></tr>"+
							"<tr><td>Barangay Name</td><td>"+res.rows.item(x).bgyname+"</td></tr>"+
							"<tr><td>Farm Location(Purok/Sitio)</td><td>"+res.rows.item(x).farmloc+
							"</td></tr>"+"<tr><td td colspan='2' class='title'>FARM INFORMATION</td></tr>"+
							"<tr><td>Farm Owner</td><td>"+res.rows.item(x).ownername+"</td></tr>"+
							"<tr><td>Farm Area(Hectare)</td><td>"+res.rows.item(x).farmarea+"</td></tr>"+
							"<tr><td>Farm Name</td><td>"+res.rows.item(x).farmname+"</td></tr>"+
							"<tr><td td colspan='2' class='title'>FARMER INFORMATION</td></tr>"+
							"<tr><td>Farmer Name</td><td>"+res.rows.item(x).lastname+" "+res.rows.item(x).firstname+"</td></tr>"+
							"<tr><td>Farmer Address (Purok/Sitio)</td><td>"+res.rows.item(x).farmeraddress+"</td></tr>"+
							"<tr><td td colspan='2' class='title'>DAMAGE INFORMATION</td></tr>"+
							"<tr><td>Flood</td><td>"+res.rows.item(x).flood+"</td></tr>"+
							"<tr><td>Flood Level (meter)</td><td>"+res.rows.item(x).flevel+"</td></tr>"+
							"<tr><td>Days of Submergence</td><td>"+res.rows.item(x).submergeddays+"</td></tr>"+
							"<tr><td>Severe Wind</td><td>"+res.rows.item(x).wind+"</td></tr>"+
							"<tr><td>Period of Exposure</td><td>"+res.rows.item(x).exposure+"</td></tr>"+
							"<tr><td td colspan='2' class='title'>CROP INFORMATION</td></tr>"+
							"<tr><td>Crop Type</td><td>"+res.rows.item(x).ctype+"</td></tr>"+
							"<tr><td>Ecosystem</td><td>"+res.rows.item(x).ecosystem+"</td></tr>"+
							"<tr><td>Variety</td><td>"+res.rows.item(x).variety+"</td></tr>"+
							"<tr><td>Seed Class</td><td>"+res.rows.item(x).sclass+"</td></tr>"+
							"<tr><td>Stage</td><td>"+res.rows.item(x).stage+"</td></tr>"+
							"<tr><td td colspan='2' class='title'>YIELD LOSSES</td></tr>"+
							"<tr><td>Yield Before Calamity</td><td>"+res.rows.item(x).yieldbefore+
							"</td></tr>"+"<tr><td>Yield After Calamity </td><td>"+res.rows.item(x).yieldafter+
							"</td></tr>"+"<tr><td>Partially Damage</td><td>"+res.rows.item(x).partially+
							"</td></tr>"+"<tr><td>Totally Damage</td><td>"+res.rows.item(x).totally+
							"</td></tr>"+"<tr><td td colspan='2' class='title'>OTHER INFORMATION</td></tr>"+
							"<tr><td>PHOTO 1</td><td>"+res.rows.item(x).photo1+"</td></tr>"+
							"<tr><td>PHOTO 2</td><td>"+res.rows.item(x).photo2+"</td></tr>"+
							"<tr><td>Surveyed By</td><td>"+res.rows.item(x).surveyedby+"</td></tr>"+
							"<tr><td>Date Survey</td><td>"+res.rows.item(x).datesurvey+"</td></tr>"+
							"<tr><td>Time Survey</td><td>"+res.rows.item(x).timesurvey+"</td></tr>"+
							"<tr><td>Remarks</td><td>"+res.rows.item(x).remarks+"</td></tr>"
							);
						}
						
						$.mobile.navigate("#showdata");
						$("tr:odd").css("background-color", "#E8E8E8");
					});
				});
				
			});
		
		});
			
		
	},function(e){
	alert("ERROR:" + e.message)
	});
	});

	/**
	 * Dynamic Places 
	 * https://github.com/chayserie/cdct/issues/2
	 * 
	 * Submit an ajax call to places.json file, then use the array of values to make dynamic combo boxes
	 * This is not recommended :(
	 * because parsing the whole 7MB json is too slow (tested on browser) 
	 */
	
	 /**
	  * Swipe actions for data
	  * https://github.com/chayserie/cdct/issues/3
	  * 
	  * Create functionality to support jQueryMobile swipe events for data\
	  * * Delete (With Confirm)
	  * * View
	  * * Update
	  */
	 $(document).on("swiperight swipeleft", "#croplist li", function(e){
		 if(confirm("Delete this record?\nFarmer: " + $(this).find("h2").text())){
			var ids = $(this).attr("data-id");
			alert(ids);
			//Execute SQL Delete command here
			db.transaction(function(tx){
				tx.executeSql("delete from CropDamage where CropdamageID='"+ids+"'");
			 
			});
			$("#croplist").listview("refresh");
			$(this).remove();
			alert("Deleted "+ids);
		 }
	 });

	 
}//end of device ready

function initDatabase() {
	db = window.sqlitePlugin.openDatabase({
		  name: 'cdat_mobile.db',
		  location: 'default'
		  });
		 db.transaction(function(tx){
			 tx.executeSql('CREATE TABLE if not exists CropDamage(CropdamageID INTEGER NOT NULL,latitude REAL, longitude REAL,provname TEXT,munname TEXT,bgyname TEXT,farmloc TEXT,ownername TEXT,farmarea TEXT,farmname TEXT,lastname TEXT,firstname TEXT,farmeraddress TEXT,flevel TEXT,flood TEXT,submergeddays TEXT,wind TEXT,exposure TEXT,ctype TEXT,ecosystem TEXT,variety TEXT,sclass TEXT,stage TEXT,yieldbefore TEXT,yieldafter TEXT,partially TEXT,totally TEXT,remarks TEXT,photo1 TEXT,photo2 TEXT,surveyedby TEXT,datesurvey TEXT,timesurvey)');
		 },function(e){
			alert("ERROR:" + e.message)
		}); 	
		//reset the database
		$("#reset").click(function(){
			db.transaction(function(tx){
				tx.executeSql("delete from CropDamage");
			});
			$(":mobile-pagecontainer").pagecontainer("change", "#menu", {reloadPage:false});
			alert("Successfully reset the database");
		});
		savetocsv();
	}//end of database initialization
	function savetocsv(){
		$("#exportcsv").click(function(){
		var expo = "CropdamageID,latitude,longitude, provname,munname,bgyname,farmloc,ownername,farmarea,farmname,farmername,farmeraddress,flevel,flood,submergeddays,wind,exposure,ctype,ecosystem,variety,sclass,stage,yieldbefore,yieldafter,partially,totally,remarks,photo1,photo2,surveyedby,datesurvey,timesurvey\n";
		//alert(expo);
		db.transaction(function(tx){
			tx.executeSql("select * from CropDamage order by CropdamageID asc", [], function(tx,res){
				for(var x=0;x<res.rows.length;x++){
					var xdata = res.rows.item(x);
					expo = expo+xdata.CropdamageID+","+
							xdata.latitude+","+
							xdata.longitude+","+
							xdata.provname+","+
							xdata.munname+","+
							xdata.bgyname+","+
							xdata.farmloc+","+
							xdata.ownername+","+
							xdata.farmarea+","+
							xdata.farmname+","+
							xdata.lastname+" "+xdata.firstname+","+
							xdata.farmeraddress+","+
							xdata.flevel+","+
							xdata.flood+","+
							xdata.submergeddays+","+
							xdata.wind+","+
							xdata.exposure+","+
							xdata.ctype+","+
							xdata.ecosystem+","+
							xdata.variety+","+
							xdata.sclass+","+
							xdata.stage+","+
							xdata.yieldbefore+","+
							xdata.yieldafter+","+
							xdata.partially+","+
							xdata.totally+","+
							xdata.remarks+","+
							xdata.photo1+","+
							xdata.photo2+","+
							xdata.surveyedby+","+
							xdata.datesurvey+","+
							xdata.timesurvey+", \n";
				}
				alert(expo);
				exportdb(expo);
			},function(error){
				alert("ExecuteSql Error: " + error);
			});
		},function(error){
			alert("error"+error);
		});
	});
	}
	function exportdb(expo){
		 window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){
				fs.root.getDirectory("CDCT",{create:true},function(fdir){
					var d = new Date();
					var y = d.getFullYear();
					var m = d.getMonth() + 1;
					if(m < 10) m = "0" + m;
					var dt = d.getDate();
					if(dt < 10) dt = "0" + dt;
					var hour = ('0'+d.getHours()).slice(-2);
					var minutes = ('0'+d.getMinutes()).slice(-2);
					var sec = ('0'+d.getSeconds()).slice(-2);
					var saveday = y+m+dt+"_"+hour+minutes+sec;
					var exportfilename = "CDCT_Export_" +saveday+".csv";
					alert(exportfilename);
					fdir.getFile(exportfilename,{create:true,exclusive:false},function(fileEntry){
						//alert("File Okay? " + fileEntry.isFile.toString());
						//alert("File Ready: " + fileEntry.fullPath);
						//write now
						fileEntry.createWriter(function(fileWriter){
							fileWriter.onwriteend=function(){
								alert("Successfully written file to" + fileEntry.fullPath);
							}

							fileWriter.onerror = function(e){
								alert("Cant Write to File because: " + e.toString());
							}

							//var dataObj = new Blob([imageData],{type:'image/jpeg'});
							fileWriter.write(expo);
						});
					},function(){
						alert("Cant Create File");
					});
				});
			},function(){
				alert("Cant Open File System");
		});
	}
	
  function datesurvey(){
		var curdate = new Date();
		var year = curdate.getFullYear();
		var month = ('0'+(curdate.getMonth() + 1)).slice(-2);
		var day = ('0'+ curdate.getDate()).slice(-2);
		var hour = ('0'+curdate.getHours()).slice(-2);
		var minutes = ('0'+curdate.getMinutes()).slice(-2);
		var sec = ('0'+curdate.getSeconds()).slice(-2);
		sdate = year +'-'+ month +'-'+ day;
		stime = hour + ':' + minutes+':'+sec;
		
	}
	function camerapicture(){
	navigator.camera.getPicture(onSuccess, onFail,{
		quality:20,
		destinationType: Camera.DestinationType.FILE_URI,
		encodingType: Camera.EncodingType.JPEG,
		mediaType:Camera.MediaType.Picture,
		correctOrientation:true,
		targetWidth:200,
		targetHeight:200
		
		
	});
	function onSuccess(imageData) { 
      var image = document.getElementById('img1'); 
      image.src = "data:image/jpeg;base64," + imageData;
	  window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){
			fs.root.getDirectory("CDCT",{create:true},function(fdir){
				fdir.getFile("img.jpg",{create:true,exclusive:false},function(fileEntry){
					alert("File Okay? " + fileEntry.isFile.toString());
					alert("File Ready: " + fileEntry.fullPath);
					//write now
					fileEntry.createWriter(function(fileWriter){
						fileWriter.onwriteend=function(){
							alert("Successfully written file to /n" + fileEntry.fullPath);
						}

						fileWriter.onerror = function(e){
							alert("Cant Write to File because: " + e.toString());
						}

						//var dataObj = new Blob([imageData],{type:'image/jpeg'});
						fileWriter.write(imageData);
					});
				},function(){
					alert("Cant Create File");
				});
			});
		},function(){
			alert("Cant Open File System");
		});
   }  
   
   function onFail(message) { 
      alert('Failed because: ' + message); 
   } 
}


 function onSuccess(position) {
	lat=position.coords.latitude;
	lng=position.coords.longitude;
	 lat=$("#clat").val(lat.toFixed(6));
	 lng=$("#clng").val(lng.toFixed(6));
	// alert(lat+lng);
	}
function onError(error){
	alert('code' +error.code +'\n'+ 'message:' +error.message);
}

	
