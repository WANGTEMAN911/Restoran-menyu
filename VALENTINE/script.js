// "NO" tugmasi yaqinlashganda qochib ketishi uchun
function moveButton() {
    const noBtn = document.getElementById('no-btn');
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

// "YES" tugmasi bosilganda
function acceptInvitation() {
    document.getElementById('question').innerText = "YAY! I Love You! ❤️";
    document.getElementById('cat').src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDk3NW4xdTFydTZvZDF4MG41ejRweXZwbDZvZ3BhcnlzcnZodDVlYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/KztT2c4u8mYYUiMKdJ/giphy.gif";
    document.getElementById('no-btn').style.display = 'none';
}