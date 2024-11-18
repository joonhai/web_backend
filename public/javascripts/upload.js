
const mapContainer = document.getElementById("map");
const mapOption = {
    center: new kakao.maps.LatLng(37.554477, 126.970419), // Map center coordinates
    level: 3 // Map zoom level
};

let map = new kakao.maps.Map(mapContainer, mapOption);
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

let markerList = [];

let ps = new kakao.maps.services.Places();

searchPlaces();

function searchPlaces() {
    let keyword = $("#keyword").val(); // Get the value from the input field
    ps.keywordSearch(keyword, placesSearchCB); // Search places with the keyword
}

function placesSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data)
        console.log(data); // Log data if the search is successful
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다."); // Alert if there are no results
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 중 오류가 발생했습니다."); // Alert if there's an error
        return;
    }
}

function displayPlaces(data) {
    let listEl = document.getElementById("placesList");
    let bounds = new kakao.maps.LatLngBounds();

    removeAllChildNodes(listEl);
    removeMarker();
    
    for (let i = 0; i < data.length; i++) {
        let lat = data[i].y;
        let lng = data[i].x;
        let address_name = data[i]["address_name"];
        let place_name = data[i]["place_name"];

        const placePosition = new kakao.maps.LatLng(lat, lng);
        bounds.extend(placePosition);

        let marker = new kakao.maps.Marker({
            position: placePosition,
        });

        marker.setMap(map);
        markerList.push(marker);

        const el = document.createElement("div");
        const itemStr = `
            <div class="info">
                <div class="info_title">
                    ${place_name}
                </div>
                <span>${address_name}</span>
            </div>
        `;

        //el.innerHTML = itemStr;
        el.className = "item";

        kakao.maps.event.addListener(marker, "click", function () {
            displayInfowindow(marker, place_name, address_name, lat, lng);
        });

        el.onclick = function () {
            displayInfowindow(marker, place_name, address_name, lat, lng);
        };

        listEl.appendChild(el);
    }

    map.setBounds(bounds);
}

function displayInfowindow(marker, title, address, lat, lng) {
    var content = `
        <div style="padding:25px;">
            ${title}<br>
            ${address}<br>
            <textarea id="memo" placeholder="메모를 입력하세요" style="width:100%; height:60px;"></textarea><br>
            <input type="time" id="timepicker" style="width:100%; margin-top:10px;"><br>
            <button onclick="onSubmit('${title}', '${address}', ${lat}, ${lng},
             document.getElementById('memo').value,document.getElementById('timepicker').value);">등록</button>
        </div>
    `;

    map.panTo(marker.getPosition());
    infowindow.setContent(content);
    infowindow.open(map, marker);
}

function onSubmit(title, address, lat, lng, memo, time ) {
    const bodyId = window.location.pathname.split('/')[2];
    $.ajax({
        url: `/list/${bodyId}/location`,
        data: { title, address, lat, lng,memo,time },
        type: "POST",
    })
    .done((response) => {
        console.log("데이터 요청 성공");
        alert("위치가 추가되었습니다");
        window.location.href = `/list/${bodyId}`;   // 위치 추가 후 상세 페이지로 리다이렉트
    })
    .fail((error) => {
        console.log("데이터 요청 실패");
        alert("실패");
    });
}


function removeAllChildNodes(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}

function removeMarker() {
    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
    markerList = [];
}
