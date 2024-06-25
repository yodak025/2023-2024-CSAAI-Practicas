function secret_key() {
    document.body.style.backgroundImage = "url('Images/secretBackground.jpeg')";
    var canvas = document.getElementsByClassName("canvas")[0];
    canvas.style.backgroundColor = "rgba(0, 0, 0, 0.7)";

    const normal = document.getElementsByClassName("normal-text")[0];
    const secret = document.getElementsByClassName("secret-text")[0];

    normal.style.display = "none";
    secret.style.display = "block";
}

function redemption_key() {

    var video = document.createElement('video');

    video.setAttribute('src', 'timelapse.mp4');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('muted', '');

    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '-1'; 

    document.body.appendChild(video);


    var canvas = document.getElementsByClassName("canvas")[0];
    canvas.style.backgroundColor = "none";

    const secret = document.getElementsByClassName("secret-text")[0];
    const redemption = document.getElementsByClassName("redemption-text")[0];

    secret.style.display = "none";
    redemption.style.display = "block";
}