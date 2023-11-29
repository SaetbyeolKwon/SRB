document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawSnowflake(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    let snowflakes = [];
    for (let i = 0; i < 200; i++) {
        snowflakes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 4 + 1,
            speed: Math.random() * 1 + 0.5
        });
    }

    function updateSnowflakes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach(flake => {
            flake.y += flake.speed;
            if (flake.y > canvas.height) flake.y = -flake.radius;
            drawSnowflake(flake.x, flake.y, flake.radius);
        });
        requestAnimationFrame(updateSnowflakes);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateSnowflakes();

    // Moving train animation
    const train = document.getElementById('moving-train');
    let trainPosition = -200;

    function animateTrain() {
        trainPosition += 2;
        if (trainPosition > window.innerWidth) trainPosition = -200;
        train.style.left = trainPosition + 'px';
        requestAnimationFrame(animateTrain);
    }

    // animateTrain();
});
