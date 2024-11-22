const mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399), // Center coordinates for the map
    zoom: 10 // Zoom level
};

const map = new naver.maps.Map('map', mapOptions);

let markerList = [];
let infowindowList = [];

const getClickHandler = (i) => () => {
    const marker = markerList[i];
    const infowindow = infowindowList[i];
    if (infowindow.getMap()) {
        infowindow.close();
    } else {
        infowindow.open(map, marker);
    }
};

const getClickMap = (i) => () => {
    const infowindow = infowindowList[i];
    infowindow.close();
};
let x = [];
const bodyId = window.location.pathname.split('/')[2];
$.ajax({
    url: `/list/${bodyId}`,
    type: "GET",
}).done((response) => { 
    console.log(response);
    if (response.message !== "success") return;
    
    const data = response.locations;  
    
    for (let i in data) {
        const target = data[i];
        const latlng = new naver.maps.LatLng(target.lat, target.lng);

        let marker = new naver.maps.Marker({
            map: map,
            position: latlng,
            icon: {
                content: '<div class="marker"></div>',
                anchor: new naver.maps.Point(7.5, 7.5) // Centers the custom marker icon
            }
        });
        
        const content = `
            <div class="infowindow_wrap">
                <div class="infowindow_title">${Number(i) + 1}.${target.title}</div>
                <div class="infowindow_address">${target.address}</div>
              <div class="infowindow_time">집합시간: ${target.time}</div>
              <div class="infowindow_memo">메모: ${target.memo}</div>
            </div>
        `;

        const infowindow = new naver.maps.InfoWindow({
            content: content,
            backgroundColor: '#00ff0000',
            borderColor: '#00ff0000',
            anchorSize: new naver.maps.Size(0, 0)
        });
        infowindow.open(map, marker);

        naver.maps.Event.addListener(marker, 'mouseover', () => {
          infowindow.open(map, marker);
      });
  
      // 마우스 아웃 이벤트
      naver.maps.Event.addListener(marker, 'mouseout', () => {
          infowindow.close();
      });
        x.push(latlng);
        markerList.push(marker);
        infowindowList.push(infowindow);
        console.log(infowindow);
    }

    

    let polyline = new naver.maps.Polyline({
      map: map,
      path: x,

    });
    polyline.setOptions({
      strokeColor:'#008d62',  
      strokeStyle: 'solid',  // 실선
      strokeOpacity: 1  // 선의 투명도(1은 불투명, 0은 투명
    });
    

    for (let i = 0, ii = markerList.length; i < ii; i++) {
        naver.maps.Event.addListener(markerList[i], 'click', getClickHandler(i));
        naver.maps.Event.addListener(map, "click", getClickMap(i));
    }
}).fail((error) => {
  console.log("데이터 요청 실패");
  alert("실패");
});

const cluster1 = {
    content: '<div class="cluster1">1</div>'
  };
  
  const cluster2 = {
    content: '<div class="cluster2">2</div>'
  };
  
  const cluster3 = {
    content: '<div class="cluster3">3</div>'
  };
  
  const markerClustering = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 12,
    map: map,
    markers: markerList,
    disableClickZoom: false,
    gridSize: 20,
    icons: [cluster1, cluster2, cluster3],
    indexGenerator: [2, 5, 10],
    stylingFunction: (clusterMarker, count) => {
      $(clusterMarker.getElement()).find('div:first-child').text(count);
    },
  });

  const urlPrefix = "https://navermaps.github.io/maps.js/docs/data/region";
const urlSuffix = ".json";
let regionGeoJson = [];
let loadCount = 0;

const tooltip = {
  content: `<div style="position:absolute;z-index:1000;padding:5px 10px;background:white;border:1px solid black;font-size:14px;display:none:pointer-events;none;"></div>`
};

tooltip.appendTo(map.getPanes().floatPane);

naver.maps.Event.once(map, 'initStyleMap', () => {
  for (let i = 1; i <= 18; i++) {
    let keyword = i.toString();
    if (keyword.length === 1) {
      keyword = "0" + keyword;
    }

    $.ajax({
      url: urlPrefix + keyword + urlSuffix,
      success: (geojson) => {
        regionGeoJson.push(geojson);
        loadCount++;
        if (loadCount === 17) {
          startDataLayer();
        }
      }
    });
  }
});

function startDataLayer() {
  map.data.setStyle((feature) => {
    const styleOptions = {
      fillColor: "#ff0000",
      fillOpacity: 0.0001,
      strokeColor: "#ff0000",
      strokeWeight: 2,
      strokeOpacity: 0.4
    };

    if (feature.getProperty("focus")) {
      styleOptions.fillOpacity = 0.6;
      styleOptions.fillColor = "#0f0";
      styleOptions.strokeColor = "#0f0";
      styleOptions.strokeWeight = 4;
      styleOptions.strokeOpacity = 1;
    }

    return styleOptions;
  });

  regionGeoJson.forEach((geojson) => {
    map.data.addGeoJson(geojson);
  });
}

// 클릭 이벤트 설정
map.data.addListener('click', (e) => {
    let feature = e.feature;
    if (feature.getProperty("focus") !== true) {
      feature.setProperty("focus", true);
    } else {
      feature.setProperty("focus", false);
    }
  });
  
  // 마우스 오버 이벤트 설정
  map.data.addListener('mouseover', (e) => {
    let feature = e.feature;
    let regionName = feature.getProperty("area1");
    tooltip.css({
      display: 'block',
      left: e.offset.x,
      top: e.offset.y,
    }).text(regionName);
    map.data.overrideStyle(feature, {
      fillOpacity: 0.6,
      strokeWeight: 4,
      strokeOpacity: 1,
    });
  });
  
  // 마우스 아웃 이벤트 설정
  map.data.addListener('mouseout', (e) => {
    tooltip.hide().empty();
    map.data.revertStyle();
  });

