var root = window.player;
var $ = window.Zepto;
var $scope = $(document.body);
var songList;
var controlmanager;
var audiomanager = new root.audioManager();
var processor = root.processor;
var playlist = root.playlist;


$scope.on("play:change",function(e, index, flag) {
    var curdata = songList[index];
    root.render(curdata);
    audiomanager.setAudioSource(curdata.audio);
    if (audiomanager.status === "play" || flag) {
        audiomanager.play();
        processor.start();
    }
    processor.render(curdata.duration);
})

$scope.on("click",".prev-btn",function(){
    var index = controlmanager.prev();
    $scope.trigger("play:change",[index]);
})

$scope.on("click",".next-btn",function(){
    var index = controlmanager.next();
    $scope.trigger("play:change",[index]);
})

$scope.on("click",".play-btn",function(){
    if(audiomanager.status === "play") {
        audiomanager.pause();
        processor.stop();
    }else {
        audiomanager.play();
        processor.start();
    }
    $scope.find(".play-btn").toggleClass('playing');
})

$scope.on("click", ".list-btn", function() {
    playlist.show(controlmanager);
})

//绑定touch事件
function bindTouch() {
    var $slidePoint = $scope.find(".slide-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var width = offset.width;
    var left = offset.left;
    $slidePoint.on("touchstart",function(e) {
        processor.stop();
    }).on("touchmove",function(e) {
        var x = e.changedTouches[0].clientX;
        var percentage = (x - left) / width;
        if (percentage > 1) {
            percentage = 1;
        }else if(percentage < 0){
            percentage = 0;
        }
        processor.updata(percentage);
    }).on("touchend",function(e) {
        var x = e.changedTouches[0].clientX;
        var percentage = (x - left) / width;
        if (percentage > 1) {
            percentage = 1;
        }else if(percentage < 0){
            percentage = 0;
        }
        processor.start(percentage);
        var curDuration = songList[controlmanager.index].duration;
        var duration = curDuration * percentage;
        audiomanager.jumptoPlay(duration);
        $scope.find(".play-btn").addClass("playing");
    })
}


function getData(url){
    $.ajax({
        url : url,
        type : "GET",
        success : successedFn,
        error : function(){
            console.log("error");
        }
    })
}
function successedFn(data){
    bindTouch();
    songList = data;
    controlmanager = new root.controlManager(data.length);
    $scope.trigger("play:change",[0]);
    playlist.render(data);
}
getData("/mock/data.json");