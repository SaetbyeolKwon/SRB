document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let animateSnowflakes = false; // by defualt it won't snow
    let snowflakeOpacity = 0;

    function drawSnowflake(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${snowflakeOpacity})`;
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

        // Fade in/out logic
        if (animateSnowflakes && snowflakeOpacity < 1) {
            snowflakeOpacity = Math.min(1, snowflakeOpacity + 0.01);
        } else if (!animateSnowflakes && snowflakeOpacity > 0) {
            snowflakeOpacity = Math.max(0, snowflakeOpacity - 0.01);
        }
        requestAnimationFrame(updateSnowflakes);
    }

    window.startSnowflake = function() {
        animateSnowflakes = true;
    }
    
    window.stopSnowflake = function() {
        animateSnowflakes = false;
    }
            
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateSnowflakes();
});
