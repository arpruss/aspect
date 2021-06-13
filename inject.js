function adjust(value) {
    var stretchX = null;
    var stretchY = null;
    var ratio = null;
    
    document.dispatchEvent(new Event('mobi.omegacentauri.killStretchVideoEvent'));

    var mode = value.includes(":") ? "aspect" : "scale";

    values = value.trim().split(/[ :,]+/);
    if (values.length == 0)
        return;
    
    if (mode == "scale") {
        stretchX = parseFloat(values[0]);
        if (values.length == 2)
            stretchY = parseFloat(values[1]);
        else
            stretchY = 1;
    }
    else {
        if (values.length == 1)
            ratio = parseFloat(values[0]);
        else
            ratio = parseFloat(values[0]) / parseFloat(values[1]);
    }
    
    console.log(stretchX,stretchY,ratio);
    
    document.dispatchEvent(new Event('mobi.omegacentauri.killStretchVideoEvent'));
    var vid = document.getElementsByTagName('video');
    
    function stretchVideo(v) {
        console.log(v);
        if (v.style.background != "black")
            v.style.background = "black";
        var transform = null;
        if (stretchX != null) {
            transform = "scale("+stretchX+","+stretchY+")";
        }
        else if (ratio != null) {
            if (v.style.objectFit != "contain")
                v.style.objectFit = "contain";
            videoRatio = v.videoWidth / v.videoHeight;
            console.log("vr",videoRatio);
            if (videoRatio >= ratio) {
                transform = "scaleX("+(ratio/videoRatio)+")";
            }
            else {
                transform = "scaleY("+(videoRatio/ratio)+")";
            }
        }
        if (transform != null && v.style.webkitTransform != transform)
            v.style.webkitTransform=transform;
        console.log("transform",transform);
    }

    function stretchAll() {
        var vid = document.getElementsByTagName('video');
        for(var i=0;i<vid.length;i++)
            stretchVideo(vid[i]);
    }

    stretchAll();

    function resizeListener() {
        setTimeout(stretchAll, 1000);
    }
    if (typeof(ResizeObserver) != "undefined") {
        var observer = new ResizeObserver(function(entries) {
            for (let e of entries) {
                setTimeout(function() { stretchVideo(e.target) }, 1000);
            }
        });        
        for (var i=0;i<vid.length;i++)
            observer.observe(vid[i]);
    }
    else {
        observer = null;
    }
    
    function killListener() {
        document.removeEventListener('mobi.omegacentauri.killStretchVideoEvent', killListener);
        window.removeEventListener('resize', resizeListener);
        if (observer != null) 
            for(var i=0;i<vid.length;i++)
                observer.unobserve(vid[i]);
    }
    
    document.addEventListener('mobi.omegacentauri.killStretchVideoEvent', killListener);           
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(message);
        switch(message.action) {
            case "resize": 
                adjust(message.value)
                break;
        }
    }
);

