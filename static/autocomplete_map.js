function initialize() {
var mainVar={};
mainVar.points=[];
mainVar.autocomplete={};
southWest = new google.maps.LatLng( 46.319072, 30.593684);
northEast = new google.maps.LatLng(46.600037, 30.813411 );
defaultBounds = new google.maps.LatLngBounds( southWest, northEast );
mainVar.completeOptions = {
   bounds : defaultBounds,
   componentRestrictions:{country:'ua'},
  types: ['address']};

var mapOptions = {
    center: new google.maps.LatLng(46.4774700,30.7326200),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();
 directionsRenderer.setMap(map);
    directionsRenderer.setOptions({
     draggable: true
 });

    $('#button').on('click', function(e){
    if ($('#begin_point').val().length > 0 && $('#end_point').val().length > 0){
     var data = {begin_address:$('#begin_address').val(),
                   begin_point:$('#begin_point').val(),
                   end_address:$('#end_address').val(),
                  end_point:$('#end_point').val(),
                  isSaved: $('#button').hasClass('save')
                  };
     $.get("/main/", data);
     }
     });

google.maps.event.addListener(map, "dblclick", function (event) {
   if(mainVar.points.length ==0){
   mainVar.points[0]= event.latLng;
    drawRoute(mainVar.points[0]);}
   else{
   mainVar.points[1]=event.latLng;
   drawRoute(mainVar.points[0],mainVar.points[1]);
   }
});

     google.maps.event.addListener(directionsRenderer, 'directions_changed', function () {
        var whole_path = directionsRenderer.directions.routes[0].overview_path;
        fetchAddress(mainVar.points[0],'begin');
        fetchAddress(mainVar.points[1],'end');

        computeTotalDistanceforRoute(directionsRenderer.directions);
        });

//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('begin_address'));
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('end_address'));


  inputHandling('begin');
  inputHandling('end');

function inputHandling(type) {
   var inputAddress = $('#'+type+'_address');
   var point= $('#'+type+'_point');
   mainVar.autocomplete[type] = new google.maps.places.Autocomplete(document.getElementById(type+'_address'), mainVar.completeOptions);
            google.maps.event.addListener(mainVar.autocomplete[type], 'place_changed',function(){
            var place = mainVar.autocomplete[type].getPlace();
                if (!place.geometry){
                    console.log("NO GEOMETRY");
                    return;}
            console.log("point",place.geometry.location.lng()+" "+place.geometry.location.lat());
            point.val(place.geometry.location.lng()+" "+place.geometry.location.lat());
            i=(type=='begin')?0:1;
            mainVar.points[i]=place.geometry.location;
            if ($('#begin_point').val().length > 0 && $('#end_point').val().length > 0)
                drawRoute(mainVar.points[0],mainVar.points[1]);

           if (place.address_components) {
                address = [
                    (place.address_components[1] && place.address_components[1].long_name || ''),
                   (place.address_components[0] && place.address_components[0].long_name || ''),
                    (place.address_components[2] && place.address_components[2].long_name || ''),
                   place.geometry.location.lng(),
                   place.geometry.location.lat()
                  ].join(' ');
                  console.log("address  " ,address);
                }
                });

    }

function drawRoute(){
    var _request = '';
         _request = {
        origin: arguments[0],
        destination: arguments[arguments.length-1],
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        unitSystem:  google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: false,
        avoidHighways: false,
        avoidTolls: false
          };
    directionsService.route(_request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);}
    });
}


function computeTotalDistanceforRoute(result) {
    var route = result.routes[0];
    var totalDistance = 0;
    for (var i = 0; i < route.legs.length; i++) {
    totalDistance += route.legs[i].distance.value;}
    console.log("dist",totalDistance);
}

function fetchAddress(point, type) {
		locater = new google.maps.Geocoder();

        locater.geocode({'location': point}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var _r = results[0];
                var re =  /,\s*Одес{1,2}а/
                console.log("address",_r.formatted_address.split(re)[0]);
                $('#'+type+'_point').val(_r.geometry.location.lng()+" "+_r.geometry.location.lat());
                $('#'+type+'_address').val(_r.formatted_address.split(re)[0]);
//              $('#'+type+'_address').attr('placeholder',_r.formatted_address.split(re)[0]);
            }
        });
}
    }
google.maps.event.addDomListener(window, 'load', initialize);
