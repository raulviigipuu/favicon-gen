export default (ctx, i, canvas) => {
    const angle = 2 * Math.PI * i / 32;
    const radius = 10;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const squareX = centerX + radius * Math.cos(angle) - 5;
    const squareY = centerY + radius * Math.sin(angle) - 5;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.fillRect(squareX, squareY, 10, 10);
};
