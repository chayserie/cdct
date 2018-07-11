var sdate;
var stime;
var db;
var watchID;
var id;
var lat;
var lng;
var places;
var savemode="add";

	//load when device is ready
	document.addEventListener("deviceready",onDeviceReady,false);
	
	function onDeviceReady(){
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
						var fname = lt+"_"+lg+"_"+imgID+".jpg";
					   alert(fname);
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
	$("select option").removeAttr("selected");
	$("select").selectmenu("refresh",true);
    $('input[type=checkbox]').prop('checked', false).checkboxradio('refresh');
		
}
		
 $("#addcrop").click(function(){
	$.mobile.navigate("#add");
	savemode = "add";
	$(":mobile-pagecontainer").pagecontainer("change", "#add", {reloadPage:false});
	$("#addheader").text("Add Crop Damage Data");
	$("#btnsave").text("Save Data");
	//refresh form
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
				alert(lat+" "+lng);
			var damageid = "dmg_"+lat+lng;
			var prov = $("#prov").find(":selected").text();
			var muni = $("#muni").find(":selected").text();
			var brgy = $("#brgy").find(":selected").text();
			var farmloc = $('input:text[id=farmloc]').val();
			var owner = $('input:text[id=owner]').val();
			var farmarea = $("#farea").val();
			var frname = $('input:text[id=frname]').val();
			var flastname = $('input:text[id=flname]').val();
			var ffname = $('input:text[id=ffname]').val();
			var faddress = $('input:text[id=faddress]').val();
			var season = $("#season").find(":selected").text();
			var dname = $('input:text[id=dname]').val();
			var flood = $('#flood').prop("checked");
			var level = $("#level").find(":selected").text();
			var wtype = $("#wtype").find(":selected").text();
			var submergedays = $("#submergedays").find(":selected").text();
			var wind = $('#wind').prop("checked");
			var velocity = $("#velocity").find(":selected").text();
			var exposure = $("#exposure").find(":selected").text();
			var ctype = $("#ctype").find(":selected").text();
			var ecosystem = $("#ecosystem").find(":selected").text();
			var sclass = $("#sclass").find(":selected").text();
			var stage = $("#stage").find(":selected").text();
			var yieldbefore = $('#yieldbefore').val();
			var yieldafter = $('#yieldafter').val();
			var partially = $('#partially').val();
			var totally = $('#totally').val();
			var remarks = $('#remarks').val();
			var pname1 = $("#t1").attr("data-filename");
			var pname2 = $("#t2").attr("data-filename");
			var isSaveOK = true;
			if(lat==""){
				isSaveOK=false;
				$(".req1").addClass("req");
				$(":mobile-pagecontainer").pagecontainer("change", "#add", {reloadPage:false});
			}
			if(lng==""){
				isSaveOK=false;
				$(".req1").addClass("req");
				$(":mobile-pagecontainer").pagecontainer("change", "#add", {reloadPage:false});
			}
			//$(".req").append("<span style='color:red; font-weight:bold;'> \n Required Field </span>");
			
			if (prov=="Select Province Name"){
				prov="null"
			}
			if (muni=="Select Municipality"){
				muni="null"
			}
			if (brgy=="Select Barangay"){
				brgy="null"
			}
			if (season=="--Select Crop Season--"){
				season="null"
			}
			if (level=="--Select Water Level-"){
				level="null"
			}
			if (wtype=="--Select Water Type--"){
				wtype="null"
			}
			if (submergedays=="--Select Days of Submergence--"){
				submergedays="null"
			}
			if (velocity=="--Select Wind Velocity--"){
				velocity="null"
			}
			if (exposure=="--Select Period of Exposure--"){
				exposure="null"
			}
			if (ctype=="--Select Crop Type--"){
				ctype="null"
			}
			if (ecosystem=="Select Ecosystem"){
				ecosystem="null"
			}
			if (sclass=="Select Seed Class"){
				sclass="null"
			}
			if (stage=="--Select Stage--"){
				stage="null"
			}
			
			if(isSaveOK==false){
			alert("Please get coordinates");
			}
		

			
			if(isSaveOK){
		
			var sql="";

			if(savemode=="add"){
				sql = "Insert into CropDamage(CropdamageID,latitude,longitude, provname,munname,bgyname,farmloc,ownername,farmarea,farmname,lastname,firstname,farmeraddress,season,damagename,flevel,flood,watertype,submergeddays,wind,velocity,exposure,ctype,ecosystem,sclass,stage,yieldbefore,yieldafter,partially,totally,remarks,photo1,photo2,surveyedby,datesurvey,timesurvey)Values('"+damageid+"','"+lat+"','"+lng+"','"+prov+"','"+muni+"','"+brgy+"','"+farmloc+"','"+owner+"','"+farmarea+"','"+frname+"','"+flastname+"','"+ffname+"','"+faddress+"','"+season+"','"+dname+"','"+level+"','"+flood+"','"+wtype+"','"+submergedays+"','"+wind+"','"+velocity+"','"+exposure+"','"+ctype+"','"+ecosystem+"','"+sclass+"','"+stage+"','"+yieldbefore+"','"+yieldafter+"','"+partially+"','"+totally+"','"+remarks+"','"+pname1+"','"+pname2+"','"+"chay"+"','"+sdate+"','"+stime+"')";
				alert("Save Successfully");
			}else if(savemode=="edit"){
				sql = "update CropDamage set latitude='"+lat+"',longitude='"+lng+"',provname='"+prov+"', munname='"+muni+"',bgyname='"+brgy+"',farmloc='"+farmloc+"',ownername='"+owner+"',farmarea='"+farmarea+"',farmname='"+frname+"', firstname='"+ffname+"',lastname='"+flastname+"', farmeraddress='"+faddress+"', season='"+season+"', damagename='"+dname+"', flevel='"+level+"', flood='"+flood+"', watertype='"+wtype+"', submergeddays='"+submergedays+"', wind='"+wind+"', velocity='"+velocity+"', exposure='"+exposure+"', ctype='"+ctype+"', ecosystem='"+ecosystem+"', sclass='"+sclass+"', stage='"+stage+"', yieldbefore='"+yieldbefore+"', yieldafter='"+yieldafter+"', partially='"+partially+"', totally='"+totally+"',photo1='"+pname1+"',photo2='"+pname2+"', remarks='"+remarks+"' where CropdamageID='"+id+"'";
				$("#croplist").listview("refresh");
				$(":mobile-pagecontainer").pagecontainer("change", "#display", {reloadPage:false});
				var samp = $("#" + id).find("h2");
				alert(samp);
				alert("update successfully");
			}
			savemode="add";
			tx.executeSql(sql);
			//refresh form
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
				$("#croplist").append("<li data-id='"+id+"'><a href='#' class='cropdetails'><h2>"+res.rows.item(x).lastname+" "+res.rows.item(x).firstname+"</h2>"+"<h3>"+res.rows.item(x).farmloc+"</h3><h3>"+res.rows.item(x).bgyname+"</h3></a><a href='#' class='editbutton'></a></li>");	
			}
			$("#croplist").listview("refresh");
			
			$(".editbutton").click(function(e){
				 id = $(this).parent().attr("data-id");
				var name = $(this).find("h2");
				alert("Updating: " +id+name);
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
											p1 = imgDir.toURL() + p1;
											p2 = imgDir.toURL() + p2;
											$("#t1").attr("src",p1);
											$("#t2").attr("src",p2);
											alert(p1+p2);
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
							$('#prov').find(":selected").text(dmgitem.provname);
							$('#muni').find(":selected").text(dmgitem.munname);
							$('#brgy').find(":selected").text(dmgitem.bgyname);
							$("input:text[id=farmloc]").val(dmgitem.farmloc);
							$("input:text[id=owner]").val(dmgitem.ownername);
							$("#farea").val(dmgitem.farmarea);
							$("input:text[id=frname]").val(dmgitem.farmname);
							$("input:text[id=ffname]").val(dmgitem.firstname);
							$("input:text[id=flname]").val(dmgitem.lastname);
							$("input:text[id=faddress]").val(dmgitem.farmeraddress);
							$('#season').find(":selected").text(dmgitem.season);
							$("input:text[id=dname]").val(dmgitem.damagename);
							$('#level').find(":selected").text(dmgitem.flevel);
							$("input:checkbox[id=flood]").val(dmgitem.flood);
							$('#wtype').find(":selected").text(dmgitem.watertype);
							$('#submergedays').find(":selected").text(dmgitem.submergeddays);
							$("input:checkbox[id=wind]").val(dmgitem.wind);
							$('#velocity').find(":selected").text(dmgitem.velocity);
							$('#exposure').find(":selected").text(dmgitem.exposure);
							$('#ctype').find(":selected").text(dmgitem.ctype);
							$('#ecosystem').find(":selected").text(dmgitem.ecosystem);
							$('#sclass').find(":selected").text(dmgitem.sclass);
							$('#stage').find(":selected").text(dmgitem.stage);
							$("#yieldbefore").val(dmgitem.yieldbefore);
							$("#yieldafter").val(dmgitem.yieldafter);
							$("#partially").val(dmgitem.partially);
							$("#totally").val(dmgitem.totally);
							$("input:text[id=remarks]").val(dmgitem.remarks);
							
						savemode="edit";
						$.mobile.navigate("#add");
						
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
							"<tr><td>Season</td><td>"+res.rows.item(x).season+"</td></tr>"+
							"<tr><td>Damage Name</td><td>"+res.rows.item(x).damagename+"</td></tr>"+
							"<tr><td>Flood</td><td>"+res.rows.item(x).flood+"</td></tr>"+
							"<tr><td>Flood Level (meter)</td><td>"+res.rows.item(x).flevel+"</td></tr>"+
							"<tr><td>Water Type</td><td>"+res.rows.item(x).watertype+"</td></tr>"+
							"<tr><td>Days of Submergence</td><td>"+res.rows.item(x).submergeddays+"</td></tr>"+
							"<tr><td>Severe Wind</td><td>"+res.rows.item(x).wind+"</td></tr>"+
							"<tr><td>Velocity</td><td>"+res.rows.item(x).velocity+"</td></tr>"+
							"<tr><td>Period of Exposure</td><td>"+res.rows.item(x).exposure+"</td></tr>"+
							"<tr><td td colspan='2' class='title'>CROP INFORMATION</td></tr>"+
							"<tr><td>Crop Type</td><td>"+res.rows.item(x).ctype+"</td></tr>"+
							"<tr><td>Ecosystem</td><td>"+res.rows.item(x).ecosystem+"</td></tr>"+
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
	 * becasuse parsing the whole 7MB json is too slow (tested on browser) 
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
			 tx.executeSql('CREATE TABLE if not exists CropDamage(CropdamageID INTEGER NOT NULL,latitude REAL, longitude REAL,provname TEXT,munname TEXT,bgyname TEXT,farmloc TEXT,ownername TEXT,farmarea TEXT,farmname TEXT,lastname TEXT,firstname TEXT,farmeraddress TEXT,season TEXT, damagename TEXT,flevel TEXT,flood TEXT,watertype TEXT,submergeddays TEXT,wind TEXT,velocity TEXT,exposure TEXT,ctype TEXT,ecosystem TEXT,sclass TEXT,stage TEXT,yieldbefore TEXT,yieldafter TEXT,partially TEXT,totally TEXT,remarks TEXT,photo1 TEXT,photo2 TEXT,surveyedby TEXT,datesurvey TEXT,timesurvey)');
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
		var expo = "CropdamageID,latitude,longitude, provname,munname,bgyname,farmloc,ownername,farmarea,farmname,lastname,firstname,farmeraddress,season,damagename,flevel,flood,watertype,submergeddays,wind,velocity,exposure,ctype,ecosystem,sclass,stage,yieldbefore,yieldafter,partially,totally,remarks,photo1,photo2,surveyedby,datesurvey,timesurvey\n";
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
							xdata.lastname+","+
							xdata.firstname+","+
							xdata.farmeraddress+","+
							xdata.season+","+
							xdata.damagename+","+
							xdata.flevel+","+
							xdata.flood+","+
							xdata.watertype+","+
							xdata.submergeddays+","+
							xdata.wind+","+
							xdata.velocity+","+
							xdata.exposure+","+
							xdata.ctype+","+
							xdata.ecosystem+","+
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
					var hour = ('0'+curdate.getHours()).slice(-2);
					var minutes = ('0'+curdate.getMinutes()).slice(-2);
					var sec = ('0'+curdate.getSeconds()).slice(-2);
					var saveday = y+m+dt+"_"+hour+minutes+sec;
					var exportfilename = "CDCT_Export_" +saveday+".csv";
					alert(exportfilename);
					fdir.getFile(exportfilename,{create:true,exclusive:false},function(fileEntry){
						alert("File Okay? " + fileEntry.isFile.toString());
						alert("File Ready: " + fileEntry.fullPath);
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


$(document).ready(function () {
	
	$("#coordsave").click(function(){
		var lat = $('input:text[id=clat]').val();
		var lng = $('input:text[id=clng]').val();
		$("#lat").val(lat);
		$("#lng").val(lng);
		$(":mobile-pagecontainer").pagecontainer("change", "#add", {reloadPage:false});
		});
	
		$("#ctype").change(function(){
			var ctype=$("#ctype").val();
			var ecosystem = $("#ecosystem");
			if(ctype=="rice"){
				$(ecosystem).html("<option value='default'>--Select Ecosystem--</option><option value='inbred'>Irrigated - Inbred</option><option value='hybrid'>Irrigated - Hybrid</option><option value='rainfed'>Rainfed</option><option value='upland'>Upland</option>");
			}
			else{
				$(ecosystem).html("<option value='default'>--Select Ecosystem--</option><option value='irrigated'>Irrigated</option><option value='rainfed'>Rainfed</option><option value='upland'>Upland</option>");
			}
			
			$("#ecosystem option").removeAttr("selected");
			$("#ecosystem").selectmenu("refresh",true);
		
		});
	
		$("#ecosystem").change(function(){
		 var ecosystem = $("#ecosystem").val();
		 var sclass=$("#sclass");
			if(ecosystem == "inbred"){
				$(sclass).val("");
				$(sclass).html("<option value='default'>--Select Seed Class--</option><option value='certified'>Certified Seed</option><option value='good'>Good Seed</option><option value='registered'>Registered Seed</option>");
			}
			else{
				$(sclass).html("<option value='default'>--Select Seed Class--</option>");
			}
			$("#sclass option").removeAttr("selected");
			$("#sclass").selectmenu("refresh",true);
		});
		
		
				
	});//end of document ready
	
